package main

import (
"encoding/json"
"flag"
"fmt"
"log"
"net/http"
"os"
"os/signal"
"syscall"
"time"
)

type AgentConfig struct {
APIEndpoint  string
DeviceID     string
AuthToken    string
HeartbeatInterval time.Duration
}

type HeartbeatPayload struct {
DeviceID    string                 `json:"deviceId"`
Timestamp   time.Time              `json:"timestamp"`
Status      string                 `json:"status"`
SystemInfo  SystemInfo             `json:"systemInfo"`
Metrics     SystemMetrics          `json:"metrics"`
}

type SystemInfo struct {
Hostname     string `json:"hostname"`
OS           string `json:"os"`
Arch         string `json:"arch"`
CPUCount     int    `json:"cpuCount"`
TotalMemory  uint64 `json:"totalMemory"`
AgentVersion string `json:"agentVersion"`
}

type SystemMetrics struct {
CPUUsage    float64 `json:"cpuUsage"`
MemoryUsage float64 `json:"memoryUsage"`
DiskUsage   float64 `json:"diskUsage"`
Uptime      uint64  `json:"uptime"`
}

var (
apiEndpoint       = flag.String("api", "http://localhost:3000", "API endpoint")
deviceID          = flag.String("device-id", "", "Device ID")
authToken         = flag.String("token", "", "Authentication token")
heartbeatInterval = flag.Duration("heartbeat", 30*time.Second, "Heartbeat interval")
)

func main() {
flag.Parse()

if *deviceID == "" {
log.Fatal("Device ID is required")
}

if *authToken == "" {
log.Fatal("Authentication token is required")
}

config := AgentConfig{
APIEndpoint:       *apiEndpoint,
DeviceID:          *deviceID,
AuthToken:         *authToken,
HeartbeatInterval: *heartbeatInterval,
}

agent := NewAgent(config)

// Setup signal handling
sigChan := make(chan os.Signal, 1)
signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

// Start heartbeat loop
go agent.StartHeartbeat()

// Start command listener
go agent.StartCommandListener()

// Wait for shutdown signal
<-sigChan
fmt.Println("\nShutting down agent...")
agent.Stop()
}

type Agent struct {
config AgentConfig
done   chan bool
}

func NewAgent(config AgentConfig) *Agent {
return &Agent{
config: config,
done:   make(chan bool),
}
}

func (a *Agent) StartHeartbeat() {
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

func (a *Agent) sendHeartbeat() {
payload := HeartbeatPayload{
DeviceID:  a.config.DeviceID,
Timestamp: time.Now(),
Status:    "online",
SystemInfo: SystemInfo{
Hostname:     getHostname(),
OS:           getOS(),
Arch:         getArch(),
CPUCount:     getCPUCount(),
TotalMemory:  getTotalMemory(),
AgentVersion: "0.1.0",
},
Metrics: SystemMetrics{
CPUUsage:    getCPUUsage(),
MemoryUsage: getMemoryUsage(),
DiskUsage:   getDiskUsage(),
Uptime:      getUptime(),
},
}

data, err := json.Marshal(payload)
if err != nil {
log.Printf("Failed to marshal heartbeat: %v", err)
return
}

req, err := http.NewRequest("POST", a.config.APIEndpoint+"/api/devices/heartbeat", nil)
if err != nil {
log.Printf("Failed to create heartbeat request: %v", err)
return
}

req.Header.Set("Authorization", "Bearer "+a.config.AuthToken)
req.Header.Set("Content-Type", "application/json")

client := &http.Client{Timeout: 10 * time.Second}
resp, err := client.Do(req)
if err != nil {
log.Printf("Failed to send heartbeat: %v", err)
return
}
defer resp.Body.Close()

if resp.StatusCode != http.StatusOK {
log.Printf("Heartbeat failed with status %d", resp.StatusCode)
}
}

func (a *Agent) StartCommandListener() {
ticker := time.NewTicker(5 * time.Second)
defer ticker.Stop()

for {
select {
case <-ticker.C:
a.checkForCommands()
case <-a.done:
return
}
}
}

func (a *Agent) checkForCommands() {
// In production, would poll for pending commands
// For now, this is a placeholder
}

func (a *Agent) Stop() {
close(a.done)
}

// System information helpers
func getHostname() string {
hostname, err := os.Hostname()
if err != nil {
return "unknown"
}
return hostname
}

func getOS() string {
return "linux"
}

func getArch() string {
return os.Getenv("GOARCH")
}

func getCPUCount() int {
return 1 // Placeholder
}

func getTotalMemory() uint64 {
return 1024 * 1024 * 1024 // 1GB placeholder
}

func getCPUUsage() float64 {
return 0.0 // Placeholder
}

func getMemoryUsage() float64 {
return 0.0 // Placeholder
}

func getDiskUsage() float64 {
return 0.0 // Placeholder
}

func getUptime() uint64 {
return 0 // Placeholder
}
