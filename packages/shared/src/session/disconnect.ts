export type DisconnectReason =
  | 'user_initiated'
  | 'host_rejected'
  | 'peer_disconnected'
  | 'network_error'
  | 'ice_failure'
  | 'session_timeout'
  | 'auth_expired'
  | 'incompatible_version'
  | 'policy_violation'
  | 'unknown';

export interface DisconnectEvent {
  reason: DisconnectReason;
  code: number;
  message: string;
  timestamp: number;
  recoverable: boolean;
}


