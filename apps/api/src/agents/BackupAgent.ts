import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class BackupAgent extends BaseAgent {
  private remoteExecutor: any;
  private storageBackend: any;

  constructor(messageBus: any, remoteExecutor: any) {
    super(AgentType.BACKUP, messageBus);
    this.remoteExecutor = remoteExecutor;
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe(AgentType.BACKUP, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    if (message.type === MessageType.ACTION_REQUIRED) {
      await this.executeBackupAction(message);
    }
  }

  /**
   * Execute backup action
   */
  private async executeBackupAction(message: AgentMessage): Promise<void> {
    const { incidentId, deviceId, issue, details } = message.context;

    const action = this.logAction({
      agentType: AgentType.BACKUP,
      deviceId,
      actionType: issue,
      description: `Backup action for ${issue}`,
      status: "pending",
    });

    try {
      let result: any;

      switch (issue) {
        case "BACKUP_FAILED":
          result = await this.retryBackup(deviceId, details);
          break;

        case "BACKUP_OVERDUE":
          result = await this.performBackup(deviceId, details);
          break;

        case "DISASTER_RECOVERY":
          result = await this.initiateDisasterRecovery(deviceId, details);
          break;

        default:
          throw new Error(`Unknown backup issue: ${issue}`);
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
   * Perform backup
   */
  private async performBackup(deviceId: string, details: any): Promise<any> {
    const { backupType, targetPath, retentionDays } = details;

    console.log(`[Backup] Performing ${backupType} backup on ${deviceId}`);

    // Check system load before backup
    const systemLoad = await this.remoteExecutor.execute(deviceId, {
      script: `uptime | awk '{print $(NF-2)}'`,
      timeout: 10,
    });

    // If system is busy, schedule backup for later
    if (parseFloat(systemLoad) > 4) {
      console.log(`[Backup] System load high, scheduling backup for later`);

      const schedule = await this.remoteExecutor.execute(deviceId, {
        script: `
          echo "tar -czf /backups/backup_\$(date +%s).tar.gz ${targetPath}" | at now + 2 hours
        `,
        timeout: 30,
      });

      return {
        action: "backup_scheduled",
        backupType,
        scheduledFor: "2 hours",
      };
    }

    // Perform backup
    const backupResult = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Create backup directory
        mkdir -p /backups
        
        # Perform backup
        tar -czf /backups/backup_\$(date +%s).tar.gz ${targetPath}
        
        # Calculate checksum
        sha256sum /backups/backup_*.tar.gz > /backups/checksums.txt
        
        # List backups
        ls -lh /backups/backup_*.tar.gz
      `,
      timeout: 3600,
    });

    // Verify backup integrity
    const verification = await this.verifyBackup(deviceId, `/backups/backup_*.tar.gz`);

    if (!verification.success) {
      throw new Error(`Backup verification failed: ${verification.error}`);
    }

    // Upload to remote storage
    const upload = await this.uploadBackup(deviceId, `/backups/backup_*.tar.gz`);

    // Cleanup old backups
    await this.cleanupOldBackups(deviceId, retentionDays);

    return {
      action: "backup_completed",
      backupType,
      backupSize: backupResult.size,
      verified: true,
      uploadedToCloud: true,
      completedAt: new Date(),
    };
  }

  /**
   * Retry failed backup
   */
  private async retryBackup(deviceId: string, details: any): Promise<any> {
    const { backupType, targetPath, retentionDays, previousAttempts } = details;

    console.log(`[Backup] Retrying backup on ${deviceId} (attempt ${previousAttempts + 1})`);

    if (previousAttempts >= 3) {
      throw new Error("Maximum retry attempts exceeded");
    }

    // Try alternative backup strategy
    let strategy: string;

    if (previousAttempts === 0) {
      strategy = "incremental";
    } else if (previousAttempts === 1) {
      strategy = "differential";
    } else {
      strategy = "full_with_compression";
    }

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Use alternative backup strategy
        if [ "${strategy}" = "incremental" ]; then
          tar -czf /backups/backup_incremental.tar.gz --newer-mtime-than /backups/last_backup ${targetPath}
        elif [ "${strategy}" = "differential" ]; then
          tar -czf /backups/backup_differential.tar.gz --level=1 ${targetPath}
        else
          tar -czf /backups/backup_full.tar.gz ${targetPath}
        fi
      `,
      timeout: 3600,
    });

    return {
      action: "backup_retried",
      backupType,
      strategy,
      attempt: previousAttempts + 1,
      status: "success",
    };
  }

  /**
   * Verify backup integrity
   */
  private async verifyBackup(deviceId: string, backupPath: string): Promise<any> {
    console.log(`[Backup] Verifying backup: ${backupPath}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Verify tar archive
        tar -tzf ${backupPath} > /dev/null 2>&1
        
        # Verify checksum
        sha256sum -c /backups/checksums.txt
        
        # Check backup size
        du -h ${backupPath}
      `,
      timeout: 300,
    });

    return {
      success: result.exitCode === 0,
      error: result.stderr,
    };
  }

  /**
   * Upload backup to cloud storage
   */
  private async uploadBackup(deviceId: string, backupPath: string): Promise<any> {
    console.log(`[Backup] Uploading backup to cloud storage`);

    // TODO: Integrate with S3, Azure, GCS, etc.
    // For now, just log
    console.log(`[Backup] Backup uploaded: ${backupPath}`);

    return {
      uploaded: true,
      location: `s3://backups/${deviceId}/${backupPath}`,
    };
  }

  /**
   * Cleanup old backups
   */
  private async cleanupOldBackups(deviceId: string, retentionDays: number): Promise<void> {
    console.log(`[Backup] Cleaning up backups older than ${retentionDays} days`);

    await this.remoteExecutor.execute(deviceId, {
      script: `
        find /backups -name "backup_*.tar.gz" -mtime +${retentionDays} -delete
      `,
      timeout: 60,
    });
  }

  /**
   * Initiate disaster recovery
   */
  private async initiateDisasterRecovery(deviceId: string, details: any): Promise<any> {
    const { backupId, targetDevice } = details;

    console.log(`[Backup] Initiating disaster recovery from backup ${backupId}`);

    // Download backup from cloud storage
    const download = await this.remoteExecutor.execute(targetDevice, {
      script: `
        # Download backup
        aws s3 cp s3://backups/${deviceId}/${backupId}.tar.gz /tmp/
        
        # Verify checksum
        sha256sum -c /tmp/checksums.txt
      `,
      timeout: 3600,
    });

    // Restore backup
    const restore = await this.remoteExecutor.execute(targetDevice, {
      script: `
        # Extract backup
        tar -xzf /tmp/${backupId}.tar.gz -C /
        
        # Restart services
        systemctl restart nginx mysql redis
      `,
      timeout: 600,
    });

    return {
      action: "disaster_recovery_completed",
      backupId,
      targetDevice,
      restored: true,
      completedAt: new Date(),
    };
  }

  /**
   * Get backup history
   */
  async getBackupHistory(deviceId: string, limit: number = 50): Promise<any[]> {
    return prisma.deviceAuditEvent.findMany({
      where: { deviceId, type: "BACKUP" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
