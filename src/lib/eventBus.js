import mitt from 'mitt'
export const bus = mitt()

export const EVENTS = {
  STATE_CHANGED: 'state:changed',
  SYSTEM_TICK: 'system:tick',
  RELAY_TRIGGERED: 'relay:triggered',
  FLEET_SENT: 'fleet:sent',
  HEALTH_UPDATED: 'health:updated',
  ACCOUNT_UPDATED: 'account:updated',
  TASK_ASSIGNED: 'task:assigned',
  TASK_COMPLETE: 'task:completed',
  SCHEDULE_RAN: 'schedule:ran',
  ACCOUNT_EXHAUSTED: 'account:exhausted',
  ACCOUNT_LOW: 'account:low'
}

export const E = {
  STATE: 'state:changed',
  TICK: 'system:tick',
  RELAY: 'relay:triggered',
  FLEET: 'fleet:sent',
  HEALTH: 'health:updated',
  ACCOUNT: 'account:updated',
  TASK: 'task:updated',
  SCHEDULE: 'schedule:ran'
}
