import { EventEmitter } from "events";
import { AgentMessage, AgentType } from "./BaseAgent.js";

export class MessageBus extends EventEmitter {
  private messageHistory: AgentMessage[] = [];
  private subscribers: Map<AgentType | "broadcast", Set<Function>> = new Map();
  private maxHistorySize: number = 10000;

  constructor() {
    super();
  }

  /**
   * Publish a message
   */
  async publish(message: AgentMessage): Promise<void> {
    // Store in history
    this.messageHistory.push(message);
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }

    // Route to recipient or broadcast
    if (message.recipient) {
      this.routeToAgent(message.recipient, message);
    } else {
      this.broadcast(message);
    }

    // Emit for monitoring
    this.emit("message", message);
  }

  /**
   * Subscribe to messages for a specific agent
   */
  subscribe(agentType: AgentType | "broadcast", handler: (msg: AgentMessage) => void): void {
    if (!this.subscribers.has(agentType)) {
      this.subscribers.set(agentType, new Set());
    }
    this.subscribers.get(agentType)!.add(handler);
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribe(agentType: AgentType | "broadcast", handler: Function): void {
    const handlers = this.subscribers.get(agentType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Route message to specific agent
   */
  private routeToAgent(agentType: AgentType, message: AgentMessage): void {
    const handlers = this.subscribers.get(agentType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error routing message to ${agentType}:`, error);
        }
      }
    }
  }

  /**
   * Broadcast message to all agents
   */
  private broadcast(message: AgentMessage): void {
    const handlers = this.subscribers.get("broadcast");
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(message);
        } catch (error) {
          console.error("Error broadcasting message:", error);
        }
      }
    }
  }

  /**
   * Get message history
   */
  getHistory(filter?: { sender?: AgentType; type?: string; limit?: number }): AgentMessage[] {
    let result = [...this.messageHistory];

    if (filter?.sender) {
      result = result.filter((m) => m.sender === filter.sender);
    }

    if (filter?.type) {
      result = result.filter((m) => m.type === filter.type);
    }

    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }

    return result;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * Get stats
   */
  getStats(): {
    totalMessages: number;
    subscribers: number;
    historySize: number;
  } {
    let subscriberCount = 0;
    for (const handlers of this.subscribers.values()) {
      subscriberCount += handlers.size;
    }

    return {
      totalMessages: this.messageHistory.length,
      subscribers: subscriberCount,
      historySize: this.messageHistory.length,
    };
  }
}
