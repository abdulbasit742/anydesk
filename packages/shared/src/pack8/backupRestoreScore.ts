export interface BackupRestoreCheck { name: string; passed: boolean; required: boolean; }
export function scoreBackupRestore(checks: readonly BackupRestoreCheck[]): { passed: boolean; failedRequired: string[] } {
  const failedRequired = checks.filter((check) => check.required && !check.passed).map((check) => check.name);
  return { passed: failedRequired.length === 0, failedRequired };
}
