export function normalizeDepartmentPath(path: string): string {
  return path.split("/").map((part) => part.trim()).filter(Boolean).join("/").slice(0, 180);
}

export function isChildDepartment(parentPath: string, childPath: string): boolean {
  const parent = normalizeDepartmentPath(parentPath);
  const child = normalizeDepartmentPath(childPath);
  return child !== parent && child.startsWith(`${parent}/`);
}
