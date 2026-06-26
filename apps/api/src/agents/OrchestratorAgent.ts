import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class OrchestratorAgent extends BaseAgent {
  private agentRegistry: Map<AgentType, any> = new Map();
  private policyEngine: any;
  private conflictResolver: any;

  constructor(messageBus: any) {
    super(AgentType.ORCHESTRATOR, messageBus);
  }

  /**
   * Register a specialized agent
   */
  registerAgent(agentType: AgentType, agent: any): void {
    this.agentRegistry.set(agentType, agent);
    console.log(`[Orchestrator] Registered agent: ${agentType}`);
  }

  /**
   * Subscribe to all relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe("broadcast", (msg: AgentMessage) => {
      this.handleMessage(msg);
    });

    this.messageBus.subscribe(AgentType.ORCHESTRATOR, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    try {
      switch (message.type) {
        case MessageType.ISSUE_DETECTED:
          await this.triageIssue(message);
          break;

        case MessageType.ACTION_COMPLETED:
          await this.recordActionCompletion(message);
          break;

        case MessageType.ACTION_FAILED:
          await this.handleActionFailure(message);
          break;

        case MessageType.REQUEST_APPROVAL:
          await this.evaluateApprovalRequest(message);
          break;

        case MessageType.ESCALATION:
          await this.handleEscalation(message);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`[Orchestrator] Error handling message:`, error);
    }
  }

  /**
   * Triage incoming issue
   */
  private async triageIssue(message: AgentMessage): Promise<void> {
    const { deviceId, issue, details } = message.context;

    console.log(`[Orchestrator] Triaging issue: ${issue} on device ${deviceId}`);

    // Create incident record
    const incident = await prisma.incident.create({
      data: {
        deviceId,
        issueType: issue,
        description: JSON.stringify(details),
        status: "open",
        priority: message.priority,
        detectedBy: message.sender,
      },
    });

    // Route to appropriate agent based on issue type
    const targetAgent = this.routeIssue(issue);

    if (targetAgent) {
      await this.sendMessage({
        recipient: targetAgent,
        type: MessageType.ACTION_REQUIRED,
        priority: message.priority,
        context: {
          incidentId: incident.id,
          deviceId,
          issue,
          details,
        },
      });
    } else {
      // No agent can handle this, escalate to human
      await this.sendMessage({
        type: MessageType.ESCALATION,
        priority: Priority.HIGH,
        context: {
          incidentId: incident.id,
          reason: "No agent available for issue type",
          issue,
        },
      });
    }
  }

  /**
   * Route issue to appropriate agent
   */
  private routeIssue(issue: string): AgentType | null {
    const routing: Record<string, AgentType> = {
      DISK_SPACE_CRITICAL: AgentType.HEALER,
      SERVICE_CRASHED: AgentType.HEALER,
      MEMORY_LEAK: AgentType.HEALER,
      SECURITY_THREAT: AgentType.GUARDIAN,
      VULNERABILITY_DETECTED: AgentType.GUARDIAN,
      PERFORMANCE_DEGRADED: AgentType.OPTIMIZER,
      UPDATE_AVAILABLE: AgentType.UPDATER,
      BACKUP_FAILED: AgentType.BACKUP,
      COMPLIANCE_VIOLATION: AgentType.COMPLIANCE,
      COST_ANOMALY: AgentType.COST,
    };

    return routing[issue] || null;
  }

  /**
   * Evaluate approval request
   */
  private async evaluateApprovalRequest(message: AgentMessage): Promise<void> {
    const { actionType, deviceId, reason } = message.context;

    // Check automation policy
    const policy = await prisma.automationPolicy.findFirst({
      where: { actionType },
    });

    if (policy?.autoApprove) {
      // Auto-approve based on policy
      await this.sendMessage({
        recipient: message.sender,
        type: MessageType.APPROVAL_GRANTED,
        priority: message.priority,
        context: {
          actionType,
          deviceId,
          reason: "Auto-approved by policy",
        },
      });
    } else {
      // Require human approval
      await this.sendMessage({
        type: MessageType.ESCALATION,
        priority: Priority.HIGH,
        context: {
          actionType,
          deviceId,
          reason: "Requires human approval",
          requestedBy: message.sender,
        },
      });
    }
  }

  /**
   * Record action completion
   */
  private async recordActionCompletion(message: AgentMessage): Promise<void> {
    const { incidentId, actionResult } = message.context;

    if (incidentId) {
      await prisma.incident.update({
        where: { id: incidentId },
        data: {
          status: "resolved",
          resolvedBy: message.sender,
          resolution: JSON.stringify(actionResult),
          resolvedAt: new Date(),
        },
      });

      // Notify communication agent
      await this.sendMessage({
        recipient: AgentType.COMMUNICATION,
        type: MessageType.STATUS_UPDATE,
        priority: Priority.MEDIUM,
        context: {
          incidentId,
          status: "resolved",
          actionResult,
        },
      });
    }
  }

  /**
   * Handle action failure
   */
  private async handleActionFailure(message: AgentMessage): Promise<void> {
    const { incidentId, error } = message.context;

    if (incidentId) {
      await prisma.incident.update({
        where: { id: incidentId },
        data: {
          status: "failed",
          failureReason: error,
        },
      });

      // Escalate to human
      await this.sendMessage({
        type: MessageType.ESCALATION,
        priority: Priority.HIGH,
        context: {
          incidentId,
          error,
          failedAgent: message.sender,
        },
      });
    }
  }

  /**
   * Handle escalation
   */
  private async handleEscalation(message: AgentMessage): Promise<void> {
    const { incidentId, reason } = message.context;

    console.log(`[Orchestrator] Escalation: ${reason}`);

    // Notify communication agent
    await this.sendMessage({
      recipient: AgentType.COMMUNICATION,
      type: MessageType.ESCALATION,
      priority: message.priority,
      context: message.context,
    });
  }

  /**
   * Get orchestrator status
   */
  async getStatus(): Promise<any> {
    const baseStatus = super.getStatus();

    return {
      ...baseStatus,
      registeredAgents: Array.from(this.agentRegistry.keys()),
      activeIncidents: await prisma.incident.count({
        where: { status: "open" },
      }),
      messageStats: this.messageBus.getStats(),
    };
  }
}
