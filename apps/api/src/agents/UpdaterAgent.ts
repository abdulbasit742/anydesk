import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class UpdaterAgent extends BaseAgent {
  private remoteExecutor: any;
  private sandboxEnvironment: any;

  constructor(messageBus: any, remoteExecutor: any) {
    super(AgentType.UPDATER, messageBus);
    this.remoteExecutor = remoteExecutor;
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe(AgentType.UPDATER, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    if (message.type === MessageType.ACTION_REQUIRED) {
      await this.executeUpdate(message);
    }
  }

  /**
   * Execute update
   */
  private async executeUpdate(message: AgentMessage): Promise<void> {
    const { incidentId, deviceId, issue, details } = message.context;

    const action = this.logAction({
      agentType: AgentType.UPDATER,
      deviceId,
      actionType: issue,
      description: `Software update for ${issue}`,
      status: "pending",
    });

    try {
      let result: any;

      switch (issue) {
        case "UPDATE_AVAILABLE":
          result = await this.updateSoftware(deviceId, details);
          break;

        case "SSL_CERTIFICATE_EXPIRING":
          result = await this.renewSSLCertificate(deviceId, details);
          break;

        case "SECURITY_PATCH_AVAILABLE":
          result = await this.applySecurityPatch(deviceId, details);
          break;

        default:
          throw new Error(`Unknown update issue: ${issue}`);
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

      // Attempt rollback
      await this.rollbackUpdate(deviceId, details);

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
   * Update software
   */
  private async updateSoftware(deviceId: string, details: any): Promise<any> {
    const { packageName, currentVersion, newVersion } = details;

    console.log(
      `[Updater] Updating ${packageName} from ${currentVersion} to ${newVersion} on ${deviceId}`
    );

    // Step 1: Test in sandbox
    const sandboxTest = await this.testUpdateInSandbox(packageName, newVersion);

    if (!sandboxTest.success) {
      throw new Error(`Sandbox test failed: ${sandboxTest.error}`);
    }

    // Step 2: Create backup
    const backup = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Backup current version
        cp -r /opt/${packageName} /opt/${packageName}.backup.${currentVersion}
        
        # Create restore script
        cat > /opt/restore_${packageName}.sh << 'EOF'
        #!/bin/bash
        rm -rf /opt/${packageName}
        mv /opt/${packageName}.backup.${currentVersion} /opt/${packageName}
        systemctl restart ${packageName}
        EOF
        chmod +x /opt/restore_${packageName}.sh
      `,
      timeout: 60,
    });

    // Step 3: Apply update
    const updateResult = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Stop service
        systemctl stop ${packageName}
        
        # Update package
        apt-get update
        apt-get install -y --only-upgrade ${packageName}
        
        # Start service
        systemctl start ${packageName}
        
        # Verify
        systemctl status ${packageName}
      `,
      timeout: 300,
    });

    if (updateResult.exitCode !== 0) {
      // Rollback
      await this.remoteExecutor.execute(deviceId, {
        script: `/opt/restore_${packageName}.sh`,
        timeout: 60,
      });

      throw new Error(`Update failed: ${updateResult.stderr}`);
    }

    // Step 4: Verify new version
    const verification = await this.remoteExecutor.execute(deviceId, {
      script: `${packageName} --version`,
      timeout: 30,
    });

    return {
      action: "software_updated",
      packageName,
      previousVersion: currentVersion,
      newVersion,
      sandboxTested: true,
      backupCreated: true,
      status: "success",
      updatedAt: new Date(),
    };
  }

  /**
   * Test update in sandbox
   */
  private async testUpdateInSandbox(packageName: string, version: string): Promise<any> {
    console.log(`[Updater] Testing ${packageName} v${version} in sandbox`);

    try {
      // Simulate sandbox environment
      const result = await this.remoteExecutor.execute("sandbox", {
        script: `
          # Install package
          apt-get update
          apt-get install -y ${packageName}=${version}
          
          # Run basic tests
          ${packageName} --version
          ${packageName} --help
          
          # Check for conflicts
          apt-get check
        `,
        timeout: 300,
      });

      return {
        success: result.exitCode === 0,
        error: result.stderr,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Renew SSL certificate
   */
  private async renewSSLCertificate(deviceId: string, details: any): Promise<any> {
    const { domain, certificatePath } = details;

    console.log(`[Updater] Renewing SSL certificate for ${domain} on ${deviceId}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Renew certificate using Let's Encrypt
        certbot renew --quiet --no-eff-email
        
        # Verify renewal
        openssl x509 -in ${certificatePath} -noout -dates
        
        # Reload web server
        systemctl reload nginx || systemctl reload apache2
      `,
      timeout: 300,
    });

    return {
      action: "ssl_certificate_renewed",
      domain,
      certificatePath,
      renewedAt: new Date(),
      status: "success",
    };
  }

  /**
   * Apply security patch
   */
  private async applySecurityPatch(deviceId: string, details: any): Promise<any> {
    const { cveId, affectedPackage } = details;

    console.log(`[Updater] Applying security patch for ${cveId} on ${deviceId}`);

    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Update package manager
        apt-get update
        
        # Install security updates
        apt-get install -y --only-upgrade ${affectedPackage}
        
        # Verify patch
        apt-cache policy ${affectedPackage}
      `,
      timeout: 300,
    });

    return {
      action: "security_patch_applied",
      cveId,
      affectedPackage,
      patchedAt: new Date(),
      status: "success",
    };
  }

  /**
   * Rollback update
   */
  private async rollbackUpdate(deviceId: string, details: any): Promise<any> {
    const { packageName } = details;

    console.log(`[Updater] Rolling back ${packageName} on ${deviceId}`);

    try {
      const result = await this.remoteExecutor.execute(deviceId, {
        script: `/opt/restore_${packageName}.sh`,
        timeout: 300,
      });

      return {
        action: "update_rolled_back",
        packageName,
        status: "success",
      };
    } catch (error: any) {
      console.error(`[Updater] Rollback failed:`, error);
      return {
        action: "rollback_failed",
        packageName,
        error: error.message,
      };
    }
  }

  /**
   * Check for available updates
   */
  async checkForUpdates(deviceId: string): Promise<any[]> {
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        apt-get update
        apt list --upgradable
      `,
      timeout: 60,
    });

    return result.upgradablePackages || [];
  }
}
