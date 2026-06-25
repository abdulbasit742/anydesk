import { MessageBus } from "./core/MessageBus.js";
import { OrchestratorAgent } from "./OrchestratorAgent.js";
import { HealerAgent } from "./HealerAgent.js";
import { GuardianAgent } from "./GuardianAgent.js";
import { OptimizerAgent } from "./OptimizerAgent.js";
import { UpdaterAgent } from "./UpdaterAgent.js";
import { BackupAgent } from "./BackupAgent.js";
import { CommunicationAgent } from "./CommunicationAgent.js";

export class AgentSwarmManager {
  private messageBus: MessageBus;
  private orchestrator: OrchestratorAgent;
  private agents: Map<string, any> = new Map();
  private remoteExecutor: any;

  constructor(remoteExecutor: any) {
    this.messageBus = new MessageBus();
    this.remoteExecutor = remoteExecutor;
    this.orchestrator = new OrchestratorAgent(this.messageBus);
  }

  /**
   * Initialize the agent swarm
   */
  async initialize(): Promise<void> {
    console.log("[AgentSwarmManager] Initializing agent swarm...");

    // Initialize orchestrator
    await this.orchestrator.initialize();

    // Initialize specialized agents
    const healer = new HealerAgent(this.messageBus, this.remoteExecutor);
    const guardian = new GuardianAgent(this.messageBus, this.remoteExecutor);
    const optimizer = new OptimizerAgent(this.messageBus, this.remoteExecutor);
    const updater = new UpdaterAgent(this.messageBus, this.remoteExecutor);
    const backup = new BackupAgent(this.messageBus, this.remoteExecutor);
    const communication = new CommunicationAgent(this.messageBus);

    // Initialize all agents
    await Promise.all([
      healer.initialize(),
      guardian.initialize(),
      optimizer.initialize(),
      updater.initialize(),
      backup.initialize(),
      communication.initialize(),
    ]);

    // Register agents with orchestrator
    this.orchestrator.registerAgent("healer", healer);
    this.orchestrator.registerAgent("guardian", guardian);
    this.orchestrator.registerAgent("optimizer", optimizer);
    this.orchestrator.registerAgent("updater", updater);
    this.orchestrator.registerAgent("backup", backup);
    this.orchestrator.registerAgent("communication", communication);

    // Store agents
    this.agents.set("healer", healer);
    this.agents.set("guardian", guardian);
    this.agents.set("optimizer", optimizer);
    this.agents.set("updater", updater);
    this.agents.set("backup", backup);
    this.agents.set("communication", communication);

    console.log("[AgentSwarmManager] Agent swarm initialized successfully");
  }

  /**
   * Shutdown the agent swarm
   */
  async shutdown(): Promise<void> {
    console.log("[AgentSwarmManager] Shutting down agent swarm...");

    await this.orchestrator.shutdown();

    for (const agent of this.agents.values()) {
      await agent.shutdown();
    }

    console.log("[AgentSwarmManager] Agent swarm shutdown complete");
  }

  /**
   * Report an issue to the swarm
   */
  async reportIssue(
    deviceId: string,
    issueType: string,
    details: any,
    priority: string = "MEDIUM"
  ): Promise<void> {
    await this.messageBus.publish({
      messageId: `msg_${Date.now()}`,
      timestamp: new Date(),
      sender: "system",
      type: "ISSUE_DETECTED",
      priority: priority as any,
      context: {
        deviceId,
        issue: issueType,
        details,
      },
    } as any);
  }

  /**
   * Get swarm status
   */
  async getStatus(): Promise<any> {
    const orchestratorStatus = await this.orchestrator.getStatus();

    const agentStatuses = [];
    for (const [name, agent] of this.agents) {
      agentStatuses.push({
        name,
        ...agent.getStatus(),
      });
    }

    return {
      orchestrator: orchestratorStatus,
      agents: agentStatuses,
      messageBus: this.messageBus.getStats(),
    };
  }

  /**
   * Get message history
   */
  getMessageHistory(filter?: any): any[] {
    return this.messageBus.getHistory(filter);
  }

  /**
   * Get agent action history
   */
  getAgentActionHistory(agentType: string, limit: number = 100): any[] {
    const agent = this.agents.get(agentType);
    if (!agent) return [];
    return agent.getActionHistory(limit);
  }
}

// Global instance
let swarmManager: AgentSwarmManager | null = null;

export function getSwarmManager(): AgentSwarmManager | null {
  return swarmManager;
}

export function setSwarmManager(manager: AgentSwarmManager): void {
  swarmManager = manager;
}
