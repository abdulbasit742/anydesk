export type OrgId = string & { __brand: 'OrgId' };

export interface Organization {
  id: OrgId;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  settings: OrgSettings;
}

export interface OrgSettings {
  maxSeats: number;
  requireApproval: boolean;
  allowedDomains: string[];
  sessionRecordingEnabled: boolean;
  mfaRequired: boolean;
}


