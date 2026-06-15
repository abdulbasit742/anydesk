export interface ManualQaItem {
  id: string;
  required: boolean;
  checked: boolean;
}

export function manualQaComplete(items: readonly ManualQaItem[]): boolean {
  return items.every((item) => !item.required || item.checked);
}
