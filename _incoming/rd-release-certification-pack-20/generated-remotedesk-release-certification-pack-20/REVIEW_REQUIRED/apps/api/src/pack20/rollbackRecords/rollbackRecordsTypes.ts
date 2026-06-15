export interface RollbackRecord { id:string; releaseId:string; targetVersion:string; reason:string; status:string; createdAt:string; }
export interface RollbackRecordRepository { create(record:RollbackRecord): Promise<RollbackRecord>; update(id:string, patch:Partial<RollbackRecord>): Promise<RollbackRecord|null>; list(filter:Partial<RollbackRecord>, limit:number): Promise<RollbackRecord[]>; }
