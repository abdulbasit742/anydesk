export function buildSafePortalLink(baseUrl: string, path: string): string {
  const base = new URL(baseUrl);
  if (base.protocol !== "https:") throw new Error("portal-base-url-must-use-https");
  return new URL(path.replace(/^\/+/, ""), `${base.origin}/`).toString();
}
