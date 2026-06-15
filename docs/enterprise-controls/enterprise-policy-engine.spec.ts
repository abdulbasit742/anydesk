import { describe, it, expect } from "vitest";
import { resolvePolicy, hasPermission } from "./policy-engine";

describe("Enterprise Policy Engine", () => {
  const rootPolicy = {
    remote_input: { enabled: false, requireApproval: true },
    clipboard: { enabled: false, requireApproval: true },
  };

  const teamPolicy = {
    remote_input: { enabled: true, requireApproval: false },
  };

  it("should inherit root policy when no override", () => {
    const resolved = resolvePolicy([rootPolicy, {}]);
    expect(resolved.clipboard.enabled).toBe(false);
  });

  it("should use team override over root", () => {
    const resolved = resolvePolicy([rootPolicy, teamPolicy]);
    expect(resolved.remote_input.enabled).toBe(true);
  });

  it("should deny permission for basic user", () => {
    expect(hasPermission({ role: "user" }, "admin_dashboard")).toBe(false);
  });

  it("should grant permission for admin", () => {
    expect(hasPermission({ role: "admin" }, "admin_dashboard")).toBe(true);
  });

  it("should handle permission conditions", () => {
    expect(hasPermission(
      { role: "help_desk", teams: ["support"] },
      "join_session",
      { team: "support" }
    )).toBe(true);
  });
});
