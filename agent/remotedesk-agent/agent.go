package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/process"
	"github.com/shirou/gopsutil/v3/host"
)

type DeviceAgent struct {
	config            AgentConfig
	client            *http.Client
	systemInfo        SystemInfo
	commandQueue      chan Command
	done              chan bool
	mu                sync.RWMutex
	lastHeartbeat     time.Time
	pendingCommands   []Command
	dockerClient      *DockerClient
}

type Command struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Payload   map[string]interface{} `json:"payload"`
	CreatedAt time.Time              `json:"createdAt"`
}

type CommandResult struct {
	CommandID string      `json:"commandId"`
	Status    string      `json:"status"`
	Result    interface{} `json:"result"`
	Error     string      `json:"error,omitempty"`
}

type DockerClient struct {
	socketPath string
	client     *http.Client
}

type DockerContainer struct {
	ID    string `json:"Id"`
	Names []string `json:"Names"`
	Image string `json:"Image"`
	State string `json:"State"`
	Status string `json:"Status"`
}

func NewDeviceAgent(config AgentConfig) *DeviceAgent {
	agent := &DeviceAgent{
		config:       config,
		client:       &http.Client{Timeout: 30 * time.Second},
		commandQueue: make(chan Command, 100),
		done:         make(chan bool),
		systemInfo:   detectSystemInfo(),
	}

	// Initialize Docker client if available
	agent.dockerClient = NewDockerClient("/var/run/docker.sock")

	return agent
}

func (a *DeviceAgent) Start() {
	log.Printf("Starting RemoteDesk Agent v0.1.0 for device %s", a.config.DeviceID)

	// Start heartbeat loop
	go a.heartbeatLoop()

	// Start command processor
	go a.commandProcessorLoop()

	// Start command poller
	go a.commandPollerLoop()

	// Start metrics collector
	go a.metricsCollectorLoop()
}

func (a *DeviceAgent) Stop() {
	log.Println("Stopping RemoteDesk Agent...")
	close(a.done)
}

// Heartbeat loop sends periodic status updates
func (a *DeviceAgent) heartbeatLoop() {
	ticker := time.NewTicker(a.config.HeartbeatInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			a.sendHeartbeat()
		case <-a.done:
			return
		}
	}
}

// Send heartbeat to API
func (a *DeviceAgent) sendHeartbeat() {
	metrics := a.collectMetrics()

	payload := HeartbeatPayload{
		DeviceID:   a.config.DeviceID,
		Timestamp:  time.Now(),
		Status:     "online",
		SystemInfo: a.systemInfo,
		Metrics:    metrics,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal heartbeat: %v", err)
		return
	}

	req, err := http.NewRequest("POST", a.config.APIEndpoint+"/api/devices/heartbeat", bytes.NewReader(data))
	if err != nil {
		log.Printf("Failed to create heartbeat request: %v", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+a.config.AuthToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := a.client.Do(req)
	if err != nil {
		log.Printf("Failed to send heartbeat: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Heartbeat failed with status %d", resp.StatusCode)
		return
	}

	a.mu.Lock()
	a.lastHeartbeat = time.Now()
	a.mu.Unlock()

	log.Printf("Heartbeat sent successfully at %v", time.Now())
}

// Command poller loop fetches pending commands from API
func (a *DeviceAgent) commandPollerLoop() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			a.pollCommands()
		case <-a.done:
			return
		}
	}
}

// Poll for pending commands
func (a *DeviceAgent) pollCommands() {
	req, err := http.NewRequest("GET", a.config.APIEndpoint+"/api/devices/"+a.config.DeviceID+"/commands/pending", nil)
	if err != nil {
		log.Printf("Failed to create command request: %v", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+a.config.AuthToken)

	resp, err := a.client.Do(req)
	if err != nil {
		log.Printf("Failed to poll commands: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return
	}

	var commands []Command
	if err := json.NewDecoder(resp.Body).Decode(&commands); err != nil {
		log.Printf("Failed to decode commands: %v", err)
		return
	}

	for _, cmd := range commands {
		select {
		case a.commandQueue <- cmd:
		case <-a.done:
			return
		}
	}
}

// Command processor loop executes commands
func (a *DeviceAgent) commandProcessorLoop() {
	for {
		select {
		case cmd := <-a.commandQueue:
			result := a.executeCommand(cmd)
			a.reportCommandResult(result)
		case <-a.done:
			return
		}
	}
}

// Execute a command
func (a *DeviceAgent) executeCommand(cmd Command) CommandResult {
	log.Printf("Executing command: %s (type: %s)", cmd.ID, cmd.Type)

	result := CommandResult{
		CommandID: cmd.ID,
		Status:    "completed",
	}

	switch cmd.Type {
	case "system_info":
		result.Result = a.systemInfo

	case "metrics":
		result.Result = a.collectMetrics()

	case "docker_list":
		containers, err := a.dockerClient.ListContainers()
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		} else {
			result.Result = containers
		}

	case "docker_stats":
		containerID := cmd.Payload["containerId"].(string)
		stats, err := a.dockerClient.GetContainerStats(containerID)
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		} else {
			result.Result = stats
		}

	case "docker_action":
		action := cmd.Payload["action"].(string)
		containerID := cmd.Payload["containerId"].(string)
		err := a.dockerClient.ExecuteAction(containerID, action)
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		} else {
			result.Result = map[string]string{"action": action, "status": "executed"}
		}

	case "execute_shell":
		command := cmd.Payload["command"].(string)
		output, err := a.executeShellCommand(command)
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		} else {
			result.Result = map[string]string{"output": output}
		}

	case "restart":
		err := a.executeShellCommand("sudo systemctl reboot")
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		}

	case "shutdown":
		err := a.executeShellCommand("sudo systemctl poweroff")
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		}

	case "update":
		err := a.executeShellCommand("sudo apt-get update && sudo apt-get upgrade -y")
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		}

	default:
		result.Status = "failed"
		result.Error = fmt.Sprintf("Unknown command type: %s", cmd.Type)
	}

	return result
}

// Report command result back to API
func (a *DeviceAgent) reportCommandResult(result CommandResult) {
	data, err := json.Marshal(result)
	if err != nil {
		log.Printf("Failed to marshal result: %v", err)
		return
	}

	req, err := http.NewRequest(
		"POST",
		a.config.APIEndpoint+"/api/devices/"+a.config.DeviceID+"/commands/"+result.CommandID+"/result",
		bytes.NewReader(data),
	)
	if err != nil {
		log.Printf("Failed to create result request: %v", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+a.config.AuthToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := a.client.Do(req)
	if err != nil {
		log.Printf("Failed to report result: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Result report failed with status %d", resp.StatusCode)
	}
}

// Collect system metrics
func (a *DeviceAgent) collectMetrics() SystemMetrics {
	metrics := SystemMetrics{}

	// CPU usage
	cpuPercent, err := cpu.Percent(time.Second, false)
	if err == nil && len(cpuPercent) > 0 {
		metrics.CPUUsage = cpuPercent[0]
	}

	// Memory usage
	memInfo, err := mem.VirtualMemory()
	if err == nil {
		metrics.MemoryUsage = memInfo.UsedPercent
	}

	// Disk usage
	diskInfo, err := disk.Usage("/")
	if err == nil {
		metrics.DiskUsage = diskInfo.UsedPercent
	}

	// Uptime
	uptime, err := host.Uptime()
	if err == nil {
		metrics.Uptime = uptime
	}

	return metrics
}

// Metrics collector loop
func (a *DeviceAgent) metricsCollectorLoop() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// In production, would store metrics for later retrieval
			metrics := a.collectMetrics()
			log.Printf("Metrics: CPU=%.2f%% Memory=%.2f%% Disk=%.2f%% Uptime=%d",
				metrics.CPUUsage, metrics.MemoryUsage, metrics.DiskUsage, metrics.Uptime)
		case <-a.done:
			return
		}
	}
}

// Execute shell command
func (a *DeviceAgent) executeShellCommand(command string) (string, error) {
	cmd := exec.Command("sh", "-c", command)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out

	err := cmd.Run()
	return out.String(), err
}

// Detect system information
func detectSystemInfo() SystemInfo {
	hostname, _ := os.Hostname()
	cpuCount, _ := cpu.Counts(false)
	memInfo, _ := mem.VirtualMemory()

	return SystemInfo{
		Hostname:     hostname,
		OS:           runtime.GOOS,
		Arch:         runtime.GOARCH,
		CPUCount:     cpuCount,
		TotalMemory:  memInfo.Total,
		AgentVersion: "0.1.0",
	}
}

// Docker Client Implementation
func NewDockerClient(socketPath string) *DockerClient {
	return &DockerClient{
		socketPath: socketPath,
		client: &http.Client{
			Timeout: 10 * time.Second,
			Transport: &http.Transport{
				DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
					return net.DialTimeout("unix", socketPath, 10*time.Second)
				},
			},
		},
	}
}

func (d *DockerClient) ListContainers() ([]DockerContainer, error) {
	resp, err := d.client.Get("http://localhost/containers/json")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var containers []DockerContainer
	if err := json.NewDecoder(resp.Body).Decode(&containers); err != nil {
		return nil, err
	}

	return containers, nil
}

func (d *DockerClient) GetContainerStats(containerID string) (map[string]interface{}, error) {
	resp, err := d.client.Get(fmt.Sprintf("http://localhost/containers/%s/stats?stream=false", containerID))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var stats map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		return nil, err
	}

	return stats, nil
}

func (d *DockerClient) ExecuteAction(containerID, action string) error {
	method := "POST"
	url := fmt.Sprintf("http://localhost/containers/%s/%s", containerID, action)

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return err
	}

	resp, err := d.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Docker API error: %s", string(body))
	}

	return nil
}

// Missing import for net package
import "net"
