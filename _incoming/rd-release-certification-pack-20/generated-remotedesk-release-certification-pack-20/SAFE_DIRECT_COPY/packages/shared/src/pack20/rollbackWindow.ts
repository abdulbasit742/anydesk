export interface RollbackWindow { releaseStartedAt:string; hours:number; }
export function rollbackWindowOpen(w: RollbackWindow, now=new Date()): boolean { return now.getTime() - new Date(w.releaseStartedAt).getTime() <= w.hours * 3600000; }
