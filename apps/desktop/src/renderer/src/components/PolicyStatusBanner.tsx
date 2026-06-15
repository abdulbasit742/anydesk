import type { DeviceAccessPolicySnapshot, SessionPermissionSet } from "@shared/index";

interface PolicyStatusBannerProps {
  policy: DeviceAccessPolicySnapshot | null;
  permissions: SessionPermissionSet | null;
  message?: string;
  fromCache?: boolean;
}

export function PolicyStatusBanner({ policy, permissions, message, fromCache }: PolicyStatusBannerProps) {
  const trust = policy?.trustStatus ?? "missing";
  const remoteInput = permissions?.remoteInput ?? "blocked";
  const clipboard = permissions?.clipboardSync ?? "blocked";
  const fileTransfer = permissions?.fileTransfer ?? "blocked";

  return (
    <div className={`policyBanner policyBanner--${trust}`}>
      <div>
        <strong>Device policy</strong>
        <p>{message ?? "Policy loaded. Host controls remain the source of truth."}</p>
      </div>
      <div className="policyPills">
        <span>Trust: {trust}</span>
        <span>Input: {remoteInput}</span>
        <span>Clipboard: {clipboard}</span>
        <span>Files: {fileTransfer}</span>
        {fromCache ? <span>Cached</span> : null}
      </div>
    </div>
  );
}
