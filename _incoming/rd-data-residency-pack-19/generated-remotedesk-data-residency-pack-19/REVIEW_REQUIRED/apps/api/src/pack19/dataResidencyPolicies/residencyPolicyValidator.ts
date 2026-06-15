const SUPPORTED_REGIONS = new Set(["us", "eu", "uk", "apac", "ca", "au"]);

export function validateResidencyPolicy(input: { primaryRegion: string; backupRegions: string[] }): string[] {
  const errors: string[] = [];
  if (!SUPPORTED_REGIONS.has(input.primaryRegion)) errors.push("unsupported-primary-region");
  for (const region of input.backupRegions) if (!SUPPORTED_REGIONS.has(region)) errors.push(`unsupported-backup-region:${region}`);
  if (input.backupRegions.includes(input.primaryRegion)) errors.push("backup-duplicates-primary");
  return errors;
}
