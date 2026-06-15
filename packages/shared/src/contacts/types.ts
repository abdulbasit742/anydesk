export type ContactId = string & { __brand: 'ContactId' };

export interface DeviceContact {
  id: ContactId;
  remoteDeskId: string;
  name: string;
  alias?: string;
  os?: string;
  lastConnectedAt?: number;
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  createdAt: number;
}

export interface RecentDevice {
  contactId: ContactId;
  connectedAt: number;
  durationSeconds: number;
  role: 'host' | 'client';
}

export interface FavoriteDevice {
  contactId: ContactId;
  rank: number;
  pinnedAt: number;
}


