import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";

export enum AgentType {
  ORCHESTRATOR = "orchestrator",
  HEALER = "healer",
  GUARDIAN = "guardian",
  OPTIMIZER = "optimizer",
  UPDATER = "updater",
  BACKUP = "backup",
  COMPLIANCE = "compliance",
  COST = "cost",
  COMMUNICATION = "communication",
  LEARNING = "learning",
}

export enum MessageType {
  ISSUE_DETECTED = "ISSUE_DETECTED",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  ACTION_COMPLETED = "ACTION_COMPLETED",
  ACTION_FAILED = "ACTION_FAILED",
  REQUEST_APPROVAL = "REQUEST_APPROVAL",
  APPROVAL_GRANTED = "APPROVAL_GRANTED",
  APPROVAL_DENIED = "APPROVAL_DENIED",
  KNOWLEDGE_QUERY = "KNOWLEDGE_QUERY",
  KNOWLEDGE_RESPONSE = "KNOWLEDGE_RESPONSE",
  STATUS_UPDATE = "STATUS_UPDATE",
  ESCALATION = "ESCALATION",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface AgentMessage {
  messageId: string;
  timestamp: Date;
  sender: AgentType;
  recipient?: AgentType;
  type: MessageType;
  priority: Priority;
  context: Record<string, any>;
  requiresApproval?: boolean;
  status?: "pending" | "processing" | "completed" | "failed";
}

export interface AgentAction {
  actionId: string;
  agentType: AgentType;
  deviceId: string;
  actionType: string;
  description: string;
  status: "pending" | "executing" | "completed" | "failed" | "rolled_back";
  result?: Record<string, any>;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export abstract class BaseAgent extends EventEmitter {
  protected agentType: AgentType;
  protected agentId: string;
  protected isActive: boolean = false;
  protected messageBus: any;
  protected actionLog: AgentAction[] = [];

  constructor(agentType: AgentType, messageBus: any) {
    super();
    this.agentType = agentType;
    this.agentId = `${agentType}_${uuidv4().substring(0, 8)}`;
    this.messageBus = messageBus;
  }

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.isActive = true;
    this.subscribeToMessages();
    console.log(`[${this.agentType}] Agent initialized: ${this.agentId}`);
  }

  /**
   * Shutdown the agent
   */
  async shutdown(): Promise<void> {
    this.isActive = false;
    this.removeAllListeners();
    console.log(`[${this.agentType}] Agent shutdown: ${this.agentId}`);
  }

  /**
   * Subscribe to relevant messages
   */
  protected abstract subscribeToMessages(): void;

  /**
   * Handle incoming message
   */
  protected abstract handleMessage(message: AgentMessage): Promise<void>;

  /**
   * Send a message to another agent or broadcast
   */
  protected async sendMessage(
    message: Omit<AgentMessage, "messageId" | "timestamp" | "sender">
  ): Promise<void> {
    const fullMessage: AgentMessage = {
      messageId: uuidv4(),
      timestamp: new Date(),
      sender: this.agentType,
      ...message,
    };

    await this.messageBus.publish(fullMessage);
  }

  /**
   * Log an action
   */
  protected logAction(action: Omit<AgentAction, "actionId" | "createdAt">): AgentAction {
    const fullAction: AgentAction = {
      actionId: uuidv4(),
      createdAt: new Date(),
      ...action,
    };

    this.actionLog.push(fullAction);
    return fullAction;
  }

  /**
   * Get agent status
   */
  getStatus(): any {
    return {
      agentId: this.agentId,
      agentType: this.agentType,
      isActive: this.isActive,
      actionCount: this.actionLog.length,
    };
  }

  /**
   * Get action history
   */
  getActionHistory(limit: number = 100): AgentAction[] {
    return this.actionLog.slice(-limit);
  }
}
