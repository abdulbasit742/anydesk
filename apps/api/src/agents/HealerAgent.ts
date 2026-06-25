import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class HealerAgent extends BaseAgent {
  private remoteExecutor: any;
  private knowledgeBase: any;

  constructor(messageBus: any, remoteExecutor: any) {
    super(AgentType.HEALER, messageBus);
    this.remoteExecutor = remoteExecutor;
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe(AgentType.HEALER, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    if (message.type === MessageType.ACTION_REQUIRED) {
      await this.executeHealing(message);
    }
  }

  /**
   * Execute healing action
   */
  private async executeHealing(message: AgentMessage): Promise<void> {
    const { incidentId, deviceId, issue, details } = message.context;

    const action = this.logAction({
      agentType: AgentType.HEALER,
      deviceId,
      actionType: issue,
      description: `Healing action for ${issue}`,
      status: "pending",
    });

    try {
      let result: any;

      switch (issue) {
        case "DISK_SPACE_CRITICAL":
          result = await this.healDiskSpace(deviceId, details);
          break;

        case "SERVICE_CRASHED":
          result = await this.restartService(deviceId, details);
          break;

        case "MEMORY_LEAK":
          result = await this.handleMemoryLeak(deviceId, details);
          break;

        default:
          throw new Error(`Unknown issue type: ${issue}`);
      }

      // Update action status
      action.status = "completed";
      action.result = result;

      await this.sendMessage({
        recipient: AgentType.ORCHESTRATOR,
        type: MessageType.ACTION_COMPLETED,
        priority: Priority.MEDIUM,
        context: {
          incidentId,
          deviceId,
          actionResult: result,
        },
      });
    } catch (error: any) {
      action.status = "failed";
      action.error = error.message;

      await this.sendMessage({
        recipient: AgentType.ORCHESTRATOR,
        type: MessageType.ACTION_FAILED,
        priority: Priority.HIGH,
        context: {
          incidentId,
          deviceId,
          error: error.message,
        },
      });
    }
  }

  /**
   * Heal disk space issue
   */
  private async healDiskSpace(deviceId: string, details: any): Promise<any> {
    const { partition, usagePercent } = details;

    console.log(`[Healer] Healing disk space on ${deviceId}: ${partition} at ${usagePercent}%`);

    // Execute cleanup script on device
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Find and remove old log files
        find ${partition} -name "*.log" -mtime +30 -delete
        
        # Clear package manager cache
        apt-get clean || yum clean all || true
        
        # Clear temp files
        rm -rf /tmp/* /var/tmp/*
        
        # Get new usage
        df -h ${partition}
      `,
      timeout: 300,
    });

    return {
      action: "disk_cleanup",
      partition,
      previousUsage: usagePercent,
      newUsage: result.diskUsage,
      filesRemoved: result.filesRemoved,
      spaceFreed: result.spaceFreed,
    };
  }

  /**
   * Restart crashed service
   */
  private async restartService(deviceId: string, details: any): Promise<any> {
    const { serviceName } = details;

    console.log(`[Healer] Restarting service ${serviceName} on ${deviceId}`);

    // Check if service exists in knowledge base
    const knownIssue = await prisma.knowledgeBaseEntry.findFirst({
      where: {
        issueType: "SERVICE_CRASHED",
        metadata: { path: ["serviceName"], equals: serviceName },
      },
    });

    // Execute restart
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        systemctl restart ${serviceName}
        sleep 2
        systemctl status ${serviceName}
      `,
      timeout: 60,
    });

    // Check if service is running
    if (result.exitCode === 0) {
      return {
        action: "service_restart",
        serviceName,
        status: "running",
        restartTime: new Date(),
      };
    } else {
      throw new Error(`Failed to restart service: ${result.stderr}`);
    }
  }

  /**
   * Handle memory leak
   */
  private async handleMemoryLeak(deviceId: string, details: any): Promise<any> {
    const { processName, pid } = details;

    console.log(`[Healer] Handling memory leak for ${processName} (PID: ${pid}) on ${deviceId}`);

    // Get process memory info
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        ps aux | grep ${processName} | grep -v grep
        cat /proc/${pid}/status | grep VmRSS
      `,
      timeout: 30,
    });

    // Schedule restart at low-usage time
    const restartSchedule = await this.remoteExecutor.execute(deviceId, {
      script: `
        echo "kill -9 ${pid}" | at now + 1 hour
        echo "systemctl restart ${processName}" | at now + 1 hour 1 minute
      `,
      timeout: 30,
    });

    return {
      action: "memory_leak_scheduled_restart",
      processName,
      pid,
      currentMemory: result.memory,
      restartScheduledAt: new Date(Date.now() + 60 * 60 * 1000),
    };
  }

  /**
   * Get healing history
   */
  async getHealingHistory(deviceId?: string, limit: number = 100): Promise<any[]> {
    const history = this.getActionHistory(limit);

    if (deviceId) {
      return history.filter((a) => a.deviceId === deviceId);
    }

    return history;
  }
}
