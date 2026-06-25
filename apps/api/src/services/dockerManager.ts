import axios, { AxiosInstance } from "axios";
import { prisma } from "../lib/prisma.js";

export interface DockerContainerInfo {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: Array<{
    IP: string;
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
  }>;
  Labels: Record<string, string>;
  State: string;
  Status: string;
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Networks: Record<string, any>;
  };
}

export class DockerManager {
  private clients: Map<string, AxiosInstance> = new Map();

  async initializeClient(deviceId: string, dockerSocketUrl: string): Promise<void> {
    const client = axios.create({
      baseURL: dockerSocketUrl,
      timeout: 10000
    });

    this.clients.set(deviceId, client);
  }

  private getClient(deviceId: string): AxiosInstance {
    const client = this.clients.get(deviceId);
    if (!client) throw new Error(`Docker client not initialized for device ${deviceId}`);
    return client;
  }

  async listContainers(deviceId: string, all: boolean = false): Promise<DockerContainerInfo[]> {
    try {
      const client = this.getClient(deviceId);
      const response = await client.get("/containers/json", {
        params: { all }
      });

      // Save to database
      for (const container of response.data) {
        await prisma.dockerContainer.upsert({
          where: {
            deviceId_containerId: {
              deviceId,
              containerId: container.Id
            }
          },
          update: {
            containerName: container.Names?.[0]?.replace(/^\//, ""),
            image: container.Image,
            status: container.State,
            ports: container.Ports,
            lastUpdated: new Date()
          },
          create: {
            deviceId,
            containerId: container.Id,
            containerName: container.Names?.[0]?.replace(/^\//, ""),
            image: container.Image,
            status: container.State,
            ports: container.Ports
          }
        });
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to list containers for device ${deviceId}:`, error);
      throw error;
    }
  }

  async getContainerStats(deviceId: string, containerId: string): Promise<any> {
    try {
      const client = this.getClient(deviceId);
      const response = await client.get(`/containers/${containerId}/stats`, {
        params: { stream: false }
      });

      const stats = response.data;
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * 100.0;
      const memoryUsage = stats.memory_stats.usage / (1024 * 1024); // MB

      return {
        cpuUsage: parseFloat(cpuPercent.toFixed(2)),
        memoryUsage: parseFloat(memoryUsage.toFixed(2)),
        networkIO: stats.networks
      };
    } catch (error) {
      console.error(`Failed to get stats for container ${containerId}:`, error);
      throw error;
    }
  }

  async startContainer(deviceId: string, containerId: string): Promise<void> {
    try {
      const client = this.getClient(deviceId);
      await client.post(`/containers/${containerId}/start`);

      await prisma.dockerContainer.update({
        where: {
          deviceId_containerId: { deviceId, containerId }
        },
        data: {
          status: "running"
        }
      });
    } catch (error) {
      console.error(`Failed to start container ${containerId}:`, error);
      throw error;
    }
  }

  async stopContainer(deviceId: string, containerId: string, timeout: number = 10): Promise<void> {
    try {
      const client = this.getClient(deviceId);
      await client.post(`/containers/${containerId}/stop`, null, {
        params: { t: timeout }
      });

      await prisma.dockerContainer.update({
        where: {
          deviceId_containerId: { deviceId, containerId }
        },
        data: {
          status: "exited"
        }
      });
    } catch (error) {
      console.error(`Failed to stop container ${containerId}:`, error);
      throw error;
    }
  }

  async restartContainer(deviceId: string, containerId: string, timeout: number = 10): Promise<void> {
    try {
      const client = this.getClient(deviceId);
      await client.post(`/containers/${containerId}/restart`, null, {
        params: { t: timeout }
      });

      await prisma.dockerContainer.update({
        where: {
          deviceId_containerId: { deviceId, containerId }
        },
        data: {
          status: "running"
        }
      });
    } catch (error) {
      console.error(`Failed to restart container ${containerId}:`, error);
      throw error;
    }
  }

  async removeContainer(deviceId: string, containerId: string, force: boolean = false): Promise<void> {
    try {
      const client = this.getClient(deviceId);
      await client.delete(`/containers/${containerId}`, {
        params: { force }
      });

      await prisma.dockerContainer.delete({
        where: {
          deviceId_containerId: { deviceId, containerId }
        }
      });
    } catch (error) {
      console.error(`Failed to remove container ${containerId}:`, error);
      throw error;
    }
  }

  async getContainerLogs(
    deviceId: string,
    containerId: string,
    tail: number = 100
  ): Promise<string> {
    try {
      const client = this.getClient(deviceId);
      const response = await client.get(`/containers/${containerId}/logs`, {
        params: {
          stdout: true,
          stderr: true,
          tail
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get logs for container ${containerId}:`, error);
      throw error;
    }
  }

  async inspectContainer(deviceId: string, containerId: string): Promise<any> {
    try {
      const client = this.getClient(deviceId);
      const response = await client.get(`/containers/${containerId}/json`);
      return response.data;
    } catch (error) {
      console.error(`Failed to inspect container ${containerId}:`, error);
      throw error;
    }
  }
}

export const dockerManager = new DockerManager();
