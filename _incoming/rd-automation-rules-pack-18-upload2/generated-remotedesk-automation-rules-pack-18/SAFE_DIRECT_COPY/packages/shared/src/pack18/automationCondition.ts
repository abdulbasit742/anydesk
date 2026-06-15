export type ConditionOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than";

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

export function evaluateCondition(condition: AutomationCondition, input: Record<string, unknown>): boolean {
  const actual = input[condition.field];
  if (condition.operator === "equals") return actual === condition.value;
  if (condition.operator === "not_equals") return actual !== condition.value;
  if (condition.operator === "contains") return String(actual ?? "").includes(String(condition.value));
  if (condition.operator === "greater_than") return Number(actual) > Number(condition.value);
  if (condition.operator === "less_than") return Number(actual) < Number(condition.value);
  return false;
}
