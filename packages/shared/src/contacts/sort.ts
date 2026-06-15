import { DeviceContact } from './types.js';

export type SortKey = 'name' | 'lastConnected' | 'created' | 'favorite';

export function sortContacts(contacts: DeviceContact[], key: SortKey, dir: 'asc' | 'desc' = 'asc'): DeviceContact[] {
  const next = [...contacts];
  next.sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case 'name': cmp = a.name.localeCompare(b.name); break;
      case 'lastConnected': cmp = (a.lastConnectedAt ?? 0) - (b.lastConnectedAt ?? 0); break;
      case 'created': cmp = a.createdAt - b.createdAt; break;
      case 'favorite': cmp = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0); break;
    }
    return dir === 'desc' ? -cmp : cmp;
  });
  return next;
}


