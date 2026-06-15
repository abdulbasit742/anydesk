import { HTTPClient } from './httpClient.js';
import { TokenPair } from './types.js';

export interface LoginPayload { email: string; password: string; mfaCode?: string; }
export interface RegisterPayload { email: string; password: string; fullName: string; orgName?: string; }

export class AuthClient {
  constructor(private http: HTTPClient) {}

  login(payload: LoginPayload) { return this.http.post<TokenPair>('/auth/login', payload); }
  signup(payload: RegisterPayload) { return this.http.post<TokenPair>('/auth/signup', payload); }
  register(payload: RegisterPayload) { return this.signup(payload); }
  refresh(refreshToken: string) { return this.http.post<TokenPair>('/auth/refresh', { refreshToken }); }
  logout() { return this.http.post<void>('/auth/logout', {}); }
  me() { return this.http.get<{ id: string; email: string; name: string; orgId?: string }>('/auth/me'); }
}


