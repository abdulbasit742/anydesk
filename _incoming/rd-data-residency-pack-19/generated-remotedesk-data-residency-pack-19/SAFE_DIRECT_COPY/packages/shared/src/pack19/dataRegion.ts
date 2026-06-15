export type DataRegion = "us" | "eu" | "uk" | "apac" | "ca" | "au";

export function normalizeDataRegion(value: string): DataRegion | undefined {
  const region = value.trim().toLowerCase();
  return ["us", "eu", "uk", "apac", "ca", "au"].includes(region) ? region as DataRegion : undefined;
}

export function regionDisplayName(region: DataRegion): string {
  return { us: "United States", eu: "European Union", uk: "United Kingdom", apac: "Asia Pacific", ca: "Canada", au: "Australia" }[region];
}
