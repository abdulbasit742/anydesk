import { EventEmitter } from "events";
import { prisma } from "../../lib/prisma.js";
import { DeviceRegistry } from "../core/DeviceRegistry.js";

export interface AutomationTrigger {
  type: "event" | "state" | "schedule";
  deviceId?: string;
  eventType?: string;
  condition?: Record<string, any>;
  schedule?: string; // cron format
}

export interface AutomationAction {
  deviceId: string;
  command: string;
  params?: Record<string, any>;
  delay?: number; // milliseconds
}

export interface AutomationRule {
  id: string;
  userId: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions?: Array<{ field: string; operator: string; value: any }>;
  actions: AutomationAction[];
  createdAt: Date;
}

export class AutomationEngine extends EventEmitter {
  private deviceRegistry: DeviceRegistry;
  private rules: Map<string, AutomationRule> = new Map();
  private executionHistory: any[] = [];

  constructor(deviceRegistry: DeviceRegistry) {
    super();
    this.deviceRegistry = deviceRegistry;
  }

  /**
   * Initialize automation engine
   */
  async initialize(): Promise<void> {
    console.log("[AutomationEngine] Initializing...");

    // Load all automation rules from database
    const rules = await prisma.automationRule.findMany();

    for (const rule of rules) {
      if (rule.enabled) {
        this.registerRule(rule as any);
      }
    }

    console.log(`[AutomationEngine] Loaded ${rules.length} automation rules`);
  }

  /**
   * Register an automation rule
   */
  async registerRule(rule: AutomationRule): Promise<void> {
    this.rules.set(rule.id, rule);

    // Set up trigger listeners
    if (rule.trigger.type === "event" && rule.trigger.deviceId) {
      const device = this.deviceRegistry.getDevice(rule.trigger.deviceId);

      if (device) {
        device.on(rule.trigger.eventType || "event", () => {
          this.evaluateRule(rule);
        });
      }
    } else if (rule.trigger.type === "schedule" && rule.trigger.schedule) {
      // Set up cron job
      this.scheduleRule(rule);
    }

    console.log(`[AutomationEngine] Registered rule: ${rule.name}`);
  }

  /**
   * Unregister an automation rule
   */
  async unregisterRule(ruleId: string): Promise<void> {
    this.rules.delete(ruleId);
    console.log(`[AutomationEngine] Unregistered rule: ${ruleId}`);
  }

  /**
   * Evaluate a rule and execute if conditions are met
   */
  private async evaluateRule(rule: AutomationRule): Promise<void> {
    try {
      // Check conditions
      if (rule.conditions && rule.conditions.length > 0) {
        const conditionsMet = await this.evaluateConditions(rule.conditions);

        if (!conditionsMet) {
          return;
        }
      }

      // Execute actions
      await this.executeActions(rule);

      // Log execution
      this.logExecution(rule, "success");
    } catch (error) {
      console.error(`[AutomationEngine] Error evaluating rule ${rule.id}:`, error);
      this.logExecution(rule, "failed", error);
    }
  }

  /**
   * Evaluate conditions
   */
  private async evaluateConditions(conditions: any[]): Promise<boolean> {
    for (const condition of conditions) {
      const { field, operator, value } = condition;

      // Parse field (e.g., "device:123:battery")
      const [type, deviceId, metric] = field.split(":");

      if (type === "device") {
        const state = await this.deviceRegistry.getDeviceState(deviceId);

        if (!state) return false;

        const fieldValue = metric ? state.metrics?.[metric] : state.status;

        if (!this.compareValues(fieldValue, operator, value)) {
          return false;
        }
      } else if (type === "time") {
        // Time-based conditions
        const now = new Date();
        const hour = now.getHours();

        if (operator === "between") {
          const [startHour, endHour] = value;
          if (hour < startHour || hour >= endHour) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Execute automation actions
   */
  private async executeActions(rule: AutomationRule): Promise<void> {
    for (const action of rule.actions) {
      // Apply delay if specified
      if (action.delay) {
        await new Promise((resolve) => setTimeout(resolve, action.delay));
      }

      try {
        await this.deviceRegistry.sendCommand(action.deviceId, {
          id: `action_${Date.now()}`,
          name: action.command,
          params: action.params,
          timestamp: new Date(),
          status: "pending",
        });

        console.log(`[AutomationEngine] Executed action: ${action.command} on ${action.deviceId}`);
      } catch (error) {
        console.error(`[AutomationEngine] Error executing action:`, error);
      }
    }
  }

  /**
   * Compare values based on operator
   */
  private compareValues(fieldValue: any, operator: string, value: any): boolean {
    switch (operator) {
      case "equals":
        return fieldValue === value;
      case "not_equals":
        return fieldValue !== value;
      case "greater_than":
        return fieldValue > value;
      case "less_than":
        return fieldValue < value;
      case "greater_than_or_equal":
        return fieldValue >= value;
      case "less_than_or_equal":
        return fieldValue <= value;
      case "contains":
        return String(fieldValue).includes(value);
      case "in":
        return Array.isArray(value) && value.includes(fieldValue);
      default:
        return false;
    }
  }

  /**
   * Schedule a rule based on cron expression
   */
  private scheduleRule(rule: AutomationRule): void {
    // TODO: Implement cron scheduling using node-cron
    console.log(`[AutomationEngine] Scheduled rule: ${rule.name}`);
  }

  /**
   * Log automation execution
   */
  private logExecution(rule: AutomationRule, status: string, error?: any): void {
    const execution = {
      ruleId: rule.id,
      ruleName: rule.name,
      status,
      error: error?.message,
      timestamp: new Date(),
    };

    this.executionHistory.push(execution);

    // Keep only last 1000 executions
    if (this.executionHistory.length > 1000) {
      this.executionHistory.shift();
    }
  }

  /**
   * Get automation rules
   */
  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit: number = 100): any[] {
    return this.executionHistory.slice(-limit);
  }
}

