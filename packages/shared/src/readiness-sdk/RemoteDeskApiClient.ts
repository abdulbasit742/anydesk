export interface RemoteDeskApiClientOptions {
  baseUrl: string;
  getAccessToken: () => Promise<string | undefined>;
  fetchImpl?: typeof fetch;
}

export class RemoteDeskApiClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: RemoteDeskApiClientOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await this.options.getAccessToken();
    const response = await this.fetchImpl(`${this.options.baseUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`RemoteDesk API request failed: ${response.status}`);
    return response.json() as Promise<T>;
  }
}
