export type SocketClientToServerEvent =
  | 'auth.resume'
  | 'session.create'
  | 'session.join'
  | 'session.leave'
  | 'session.signal'
  | 'session.ice-restart-request'
  | 'audit.emit'
  | 'support.bundle-ready';

export type SocketServerToClientEvent =
  | 'auth.accepted'
  | 'auth.rejected'
  | 'session.created'
  | 'session.joined'
  | 'session.peer-joined'
  | 'session.peer-left'
  | 'session.signal'
  | 'session.ice-restart-requested'
  | 'session.ended'
  | 'billing.limit-hit'
  | 'security.event';

export type SocketEventName = SocketClientToServerEvent | SocketServerToClientEvent;
