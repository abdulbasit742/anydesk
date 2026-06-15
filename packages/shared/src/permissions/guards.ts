import { PermissionSet, PermissionAction, PermissionRequest } from './contracts.js';

export function isGranted(set: PermissionSet, action: PermissionAction): boolean {
  return set.grants.some((g) => g.action === action && g.granted);
}

export function isPending(req: PermissionRequest): boolean {
  return !req.approvedAt && !req.deniedAt;
}

export function isExpired(set: PermissionSet, action: PermissionAction): boolean {
  const grant = set.grants.find((g) => g.action === action);
  if (!grant || !grant.expiresAt) return false;
  return Date.now() > grant.expiresAt;
}

export function assertGranted(set: PermissionSet, action: PermissionAction): void {
  if (!isGranted(set, action) || isExpired(set, action)) {
    throw new Error(`Permission denied: ${action}`);
  }
}


