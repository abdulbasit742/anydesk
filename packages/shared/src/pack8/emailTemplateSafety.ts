export interface EmailTemplateSafetyResult { safe: boolean; reasons: string[]; }
export function inspectEmailTemplate(template: string): EmailTemplateSafetyResult {
  const reasons: string[] = [];
  if (/<script/i.test(template)) reasons.push("script-tag");
  if (/javascript:/i.test(template)) reasons.push("javascript-url");
  if (/{{\s*(password|token|secret|clipboard)\s*}}/i.test(template)) reasons.push("unsafe-variable");
  return { safe: reasons.length === 0, reasons };
}
