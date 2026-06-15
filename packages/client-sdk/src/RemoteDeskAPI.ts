import { SDKConfig } from './types.js';
import { HTTPClient } from './httpClient.js';
import { AuthClient } from './authClient.js';
import { DeviceClient } from './deviceClient.js';
import { SessionClient } from './sessionClient.js';
import { AuditClient } from './auditClient.js';

export class RemoteDeskAPI {
  public readonly http: HTTPClient;
  public readonly auth: AuthClient;
  public readonly devices: DeviceClient;
  public readonly sessions: SessionClient;
  public readonly audit: AuditClient;

  constructor(cfg: SDKConfig) {
    this.http = new HTTPClient(cfg);
    this.auth = new AuthClient(this.http);
    this.devices = new DeviceClient(this.http);
    this.sessions = new SessionClient(this.http);
    this.audit = new AuditClient(this.http);
  }

  setAuthHeader(token: string) {
    (this.http as any).cfg = { ...(this.http as any).cfg, headers: { Authorization: `Bearer ${token}` } };
  }
}


