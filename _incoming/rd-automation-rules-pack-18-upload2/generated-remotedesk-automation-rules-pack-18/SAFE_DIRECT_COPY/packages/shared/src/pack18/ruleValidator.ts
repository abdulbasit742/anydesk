import { isSafeAutomationAction } from "./automationAction.js";
import { isSupportedAutomationTrigger } from "./automationTrigger.js";

export interface AutomationRuleDraft {
  name: string;
  trigger: string;
  actions: string[];
}

export function validateAutomationRuleDraft(rule: AutomationRuleDraft): string[] {
  const errors: string[] = [];
  if (rule.name.trim().length < 3) errors.push("name-too-short");
  if (!isSupportedAutomationTrigger(rule.trigger)) errors.push("unsupported-trigger");
  if (rule.actions.length === 0) errors.push("missing-actions");
  for (const action of rule.actions) {
    if (!isSafeAutomationAction(action)) errors.push(`unsupported-action:${action}`);
  }
  return errors;
}
