import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class OptimizerAgent extends BaseAgent {
  private remoteExecutor: any;
  private performanceThresholds: Record<string, number> = {
    CPU_USAGE: 80,
    MEMORY_USAGE: 85,
    DISK_IO: 90,
    NETWORK_LATENCY: 100,
  };

  constructor(messageBus: any, remoteExecutor: any) {
    super(AgentType.OPTIMIZER, messageBus);
    this.remoteExecutor = remoteExecutor;
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe(AgentType.OPTIMIZER, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    if (message.type === MessageType.ACTION_REQUIRED) {
      await this.executeOptimization(message);
    }
  }

  /**
   * Execute optimization
   */
  private async executeOptimization(message: AgentMessage): Promise<void> {
    const { incidentId, deviceId, issue, details } = message.context;

    const action = this.logAction({
      agentType: AgentType.OPTIMIZER,
      deviceId,
      actionType: issue,
      description: `Performance optimization for ${issue}`,
      status: "pending",
    });

    try {
      let result: any;

      switch (issue) {
        case "PERFORMANCE_DEGRADED":
          result = await this.optimizePerformance(deviceId, details);
          break;

        case "HIGH_CPU_USAGE":
          result = await this.optimizeCPU(deviceId, details);
          break;

        case "HIGH_MEMORY_USAGE":
          result = await this.optimizeMemory(deviceId, details);
          break;

        case "SLOW_DATABASE":
          result = await this.optimizeDatabase(deviceId, details);
          break;

        default:
          throw new Error(`Unknown optimization issue: ${issue}`);
      }

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
        priority: Priority.MEDIUM,
        context: {
          incidentId,
          deviceId,
          error: error.message,
        },
      });
    }
  }

  /**
   * Optimize overall performance
   */
  private async optimizePerformance(deviceId: string, details: any): Promise<any> {
    console.log(`[Optimizer] Optimizing performance on ${deviceId}`);

    // Collect performance metrics
    const metrics = await this.remoteExecutor.execute(deviceId, {
      script: `
        # CPU usage
        top -bn1 | grep "Cpu(s)" | awk '{print $2}'
        
        # Memory usage
        free | grep Mem | awk '{print ($3/$2) * 100}'
        
        # Disk I/O
        iostat -x 1 2 | tail -1 | awk '{print $4}'
        
        # Network latency
        ping -c 1 8.8.8.8 | tail -1 | awk '{print $4}' | cut -d'/' -f2
      `,
      timeout: 30,
    });

    // Identify bottleneck
    const bottleneck = this.identifyBottleneck(metrics);

    // Apply optimization
    let optimization: any;
    if (bottleneck === "CPU") {
      optimization = await this.optimizeCPU(deviceId, details);
    } else if (bottleneck === "MEMORY") {
      optimization = await this.optimizeMemory(deviceId, details);
    } else if (bottleneck === "DISK_IO") {
      optimization = await this.optimizeDiskIO(deviceId, details);
    }

    return {
      action: "performance_optimized",
      bottleneck,
      optimization,
      metricsAfter: await this.getPerformanceMetrics(deviceId),
    };
  }

  /**
   * Optimize CPU usage
   */
  private async optimizeCPU(deviceId: string, details: any): Promise<any> {
    console.log(`[Optimizer] Optimizing CPU on ${deviceId}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Find top CPU-consuming processes
        ps aux --sort=-%cpu | head -5
        
        # Adjust process priorities
        for pid in $(ps aux --sort=-%cpu | tail -4 | awk '{print $2}'); do
          renice +10 -p $pid
        done
        
        # Enable CPU frequency scaling
        echo "powersave" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
      `,
      timeout: 30,
    });

    return {
      action: "cpu_optimized",
      topProcesses: result.processes,
      frequencyScalingEnabled: true,
    };
  }

  /**
   * Optimize memory usage
   */
  private async optimizeMemory(deviceId: string, details: any): Promise<any> {
    console.log(`[Optimizer] Optimizing memory on ${deviceId}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Clear page cache
        sync; echo 1 > /proc/sys/vm/drop_caches
        
        # Increase swappiness for better memory management
        sysctl -w vm.swappiness=60
        
        # Get memory stats before and after
        free -h
      `,
      timeout: 30,
    });

    return {
      action: "memory_optimized",
      cacheCleared: true,
      swappinessAdjusted: true,
      memoryStats: result.memory,
    };
  }

  /**
   * Optimize disk I/O
   */
  private async optimizeDiskIO(deviceId: string, details: any): Promise<any> {
    console.log(`[Optimizer] Optimizing disk I/O on ${deviceId}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Optimize I/O scheduler
        echo "noop" > /sys/block/sda/queue/scheduler
        
        # Increase read-ahead buffer
        blockdev --setra 256 /dev/sda
        
        # Defragment filesystem (if ext4)
        e4defrag -c /dev/sda1 || true
      `,
      timeout: 60,
    });

    return {
      action: "disk_io_optimized",
      schedulerOptimized: true,
      readAheadIncreased: true,
    };
  }

  /**
   * Optimize database
   */
  private async optimizeDatabase(deviceId: string, details: any): Promise<any> {
    const { databaseType, databaseName } = details;

    console.log(`[Optimizer] Optimizing ${databaseType} database on ${deviceId}`);

    let result: any;

    if (databaseType === "mysql") {
      result = await this.remoteExecutor.execute(deviceId, {
        script: `
          mysql -e "ANALYZE TABLE \`${databaseName}\`.*;"
          mysql -e "OPTIMIZE TABLE \`${databaseName}\`.*;"
          mysql -e "SHOW TABLE STATUS FROM \`${databaseName}\`;"
        `,
        timeout: 300,
      });
    } else if (databaseType === "postgresql") {
      result = await this.remoteExecutor.execute(deviceId, {
        script: `
          psql -d ${databaseName} -c "ANALYZE;"
          psql -d ${databaseName} -c "VACUUM ANALYZE;"
          psql -d ${databaseName} -c "REINDEX DATABASE ${databaseName};"
        `,
        timeout: 300,
      });
    }

    return {
      action: "database_optimized",
      databaseType,
      databaseName,
      analyzed: true,
      optimized: true,
    };
  }

  /**
   * Identify performance bottleneck
   */
  private identifyBottleneck(metrics: any): string {
    if (metrics.cpu > 80) return "CPU";
    if (metrics.memory > 85) return "MEMORY";
    if (metrics.diskIO > 90) return "DISK_IO";
    if (metrics.latency > 100) return "NETWORK";
    return "UNKNOWN";
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(deviceId: string): Promise<any> {
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        echo "CPU: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')"
        echo "Memory: $(free | grep Mem | awk '{print ($3/$2) * 100}')"
        echo "Disk: $(df -h / | tail -1 | awk '{print $5}')"
      `,
      timeout: 30,
    });

    return result;
  }
}
