import { DeviceContact } from './types.js';

export function searchContacts(contacts: DeviceContact[], query: string): DeviceContact[] {
  const q = query.trim().toLowerCase();
  if (!q) return contacts;
  return contacts.filter((c) =>
    c.remoteDeskId.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    (c.alias?.toLowerCase().includes(q) ?? false) ||
    c.tags.some((t) => t.toLowerCase().includes(q))
  );
}


