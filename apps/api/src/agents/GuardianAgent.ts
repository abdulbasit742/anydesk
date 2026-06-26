import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class GuardianAgent extends BaseAgent {
  private remoteExecutor: any;
  private threatDatabase: any;

  constructor(messageBus: any, remoteExecutor: any) {
    super(AgentType.GUARDIAN, messageBus);
    this.remoteExecutor = remoteExecutor;
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe(AgentType.GUARDIAN, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    if (message.type === MessageType.ACTION_REQUIRED) {
      await this.executeSecurityAction(message);
    }
  }

  /**
   * Execute security action
   */
  private async executeSecurityAction(message: AgentMessage): Promise<void> {
    const { incidentId, deviceId, issue, details } = message.context;

    const action = this.logAction({
      agentType: AgentType.GUARDIAN,
      deviceId,
      actionType: issue,
      description: `Security action for ${issue}`,
      status: "pending",
    });

    try {
      let result: any;

      switch (issue) {
        case "SECURITY_THREAT":
          result = await this.respondToThreat(deviceId, details);
          break;

        case "VULNERABILITY_DETECTED":
          result = await this.patchVulnerability(deviceId, details);
          break;

        case "SUSPICIOUS_LOGIN":
          result = await this.handleSuspiciousLogin(deviceId, details);
          break;

        case "MALWARE_DETECTED":
          result = await this.quarantineDevice(deviceId, details);
          break;

        default:
          throw new Error(`Unknown security issue: ${issue}`);
      }

      action.status = "completed";
      action.result = result;

      await this.sendMessage({
        recipient: AgentType.ORCHESTRATOR,
        type: MessageType.ACTION_COMPLETED,
        priority: Priority.CRITICAL,
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
        priority: Priority.CRITICAL,
        context: {
          incidentId,
          deviceId,
          error: error.message,
        },
      });
    }
  }

  /**
   * Respond to security threat
   */
  private async respondToThreat(deviceId: string, details: any): Promise<any> {
    const { threatType, severity, source } = details;

    console.log(`[Guardian] Responding to threat: ${threatType} (${severity}) from ${source}`);

    // Block source IP
    const blockResult = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Block source IP
        ufw deny from ${source}
        
        # Kill any connections from source
        ss -K dst ${source}
        
        # Log the incident
        echo "Blocked threat from ${source}: ${threatType}" >> /var/log/security.log
      `,
      timeout: 30,
    });

    // Create security incident record
    const incident = await prisma.securityIncident.create({
      data: {
        deviceId,
        threatType,
        severity: severity as any,
        source,
        status: "mitigated",
        mitigatedBy: AgentType.GUARDIAN,
        mitigatedAt: new Date(),
      },
    });

    return {
      action: "threat_blocked",
      threatType,
      source,
      blocked: true,
      incidentId: incident.id,
    };
  }

  /**
   * Patch vulnerability
   */
  private async patchVulnerability(deviceId: string, details: any): Promise<any> {
    const { cveId, affectedPackage, severity } = details;

    console.log(`[Guardian] Patching vulnerability ${cveId} on ${deviceId}`);

    // Check if patch requires approval
    if (severity === "CRITICAL") {
      // Auto-patch critical vulnerabilities
      const patchResult = await this.remoteExecutor.execute(deviceId, {
        script: `
          apt-get update
          apt-get install -y --only-upgrade ${affectedPackage}
          
          # Verify patch
          dpkg -l | grep ${affectedPackage}
        `,
        timeout: 300,
      });

      return {
        action: "vulnerability_patched",
        cveId,
        affectedPackage,
        status: "patched",
        patchedAt: new Date(),
      };
    } else {
      // Request approval for non-critical patches
      await this.sendMessage({
        recipient: AgentType.ORCHESTRATOR,
        type: MessageType.REQUEST_APPROVAL,
        priority: Priority.HIGH,
        context: {
          actionType: "PATCH_VULNERABILITY",
          deviceId,
          cveId,
          affectedPackage,
          severity,
        },
        requiresApproval: true,
      });

      return {
        action: "patch_approval_requested",
        cveId,
        status: "pending_approval",
      };
    }
  }

  /**
   * Handle suspicious login
   */
  private async handleSuspiciousLogin(deviceId: string, details: any): Promise<any> {
    const { username, source, timestamp } = details;

    console.log(`[Guardian] Handling suspicious login: ${username} from ${source}`);

    // Disable account temporarily
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Lock account
        usermod -L ${username}
        
        # Kill user sessions
        pkill -u ${username}
        
        # Log incident
        echo "Suspicious login detected: ${username} from ${source}" >> /var/log/security.log
      `,
      timeout: 30,
    });

    return {
      action: "suspicious_login_mitigated",
      username,
      source,
      accountLocked: true,
      mitigatedAt: new Date(),
    };
  }

  /**
   * Quarantine device
   */
  private async quarantineDevice(deviceId: string, details: any): Promise<any> {
    const { malwareType } = details;

    console.log(`[Guardian] Quarantining device ${deviceId} due to malware: ${malwareType}`);

    // Isolate device from network
    const result = await this.remoteExecutor.execute(deviceId, {
      script: `
        # Disable network interfaces
        ip link set eth0 down
        ip link set wlan0 down
        
        # Kill network services
        systemctl stop networking
        
        # Log quarantine
        echo "Device quarantined due to malware detection" >> /var/log/security.log
      `,
      timeout: 30,
    });

    // Create quarantine record
    const quarantine = await prisma.deviceQuarantine.create({
      data: {
        deviceId,
        reason: malwareType,
        status: "active",
        quarantinedAt: new Date(),
      },
    });

    return {
      action: "device_quarantined",
      malwareType,
      quarantineId: quarantine.id,
      networkDisabled: true,
    };
  }

  /**
   * Get security incidents
   */
  async getSecurityIncidents(deviceId?: string, limit: number = 100): Promise<any[]> {
    const where: any = {};
    if (deviceId) {
      where.deviceId = deviceId;
    }

    return prisma.securityIncident.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
