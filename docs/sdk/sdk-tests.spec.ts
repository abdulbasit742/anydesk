import { describe, it, expect, vi } from "vitest";
import { RemoteDeskClient, RemoteDeskError, RemoteDeskErrorCode } from "./typescript-sdk";

describe("RemoteDeskClient", () => {
  const config = {
    apiUrl: "https://api.test.io/v1",
    socketUrl: "wss://api.test.io/signaling",
  };

  it("should create client with config", () => {
    const client = new RemoteDeskClient(config);
    expect(client).toBeDefined();
  });

  it("should throw if connect called before login", () => {
    const client = new RemoteDeskClient(config);
    expect(() => client.connect()).toThrow("Not authenticated");
  });

  it("should return null deskId before login", () => {
    const client = new RemoteDeskClient(config);
    expect(client.getDeskId()).toBeNull();
  });

  it("should not be connected initially", () => {
    const client = new RemoteDeskClient(config);
    expect(client.isConnected()).toBe(false);
  });
});

describe("RemoteDeskError", () => {
  it("should create error with code", () => {
    const error = new RemoteDeskError(
      "Test error",
      RemoteDeskErrorCode.AUTH_REQUIRED,
      401
    );
    expect(error.code).toBe("RD_E003");
    expect(error.statusCode).toBe(401);
  });

  it("should return user-friendly message", () => {
    const error = new RemoteDeskError(
      "Auth required",
      RemoteDeskErrorCode.AUTH_REQUIRED,
      401
    );
    expect(error.userMessage).toBe("Please log in to continue.");
  });

  it("should identify retryable errors", () => {
    const rateLimit = new RemoteDeskError(
      "Rate limited",
      RemoteDeskErrorCode.RATE_LIMITED,
      429
    );
    expect(rateLimit.retryable).toBe(true);
    
    const auth = new RemoteDeskError(
      "Auth required",
      RemoteDeskErrorCode.AUTH_REQUIRED,
      401
    );
    expect(auth.retryable).toBe(false);
  });
});
