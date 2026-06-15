export interface SbomSummary { packageCount:number; unknownLicenses:number; criticalVulnerabilities:number; highVulnerabilities:number; }
export function sbomBlocksRelease(s: SbomSummary): boolean { return s.unknownLicenses > 0 || s.criticalVulnerabilities > 0 || s.highVulnerabilities > 10; }
