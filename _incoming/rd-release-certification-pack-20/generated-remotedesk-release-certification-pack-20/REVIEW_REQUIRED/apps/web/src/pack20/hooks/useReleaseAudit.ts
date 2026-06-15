import { useEffect, useState } from 'react';
export interface useReleaseAuditResult<T> { data?:T; loading:boolean; error?:string; }
export function useReleaseAudit<T>(loader:()=>Promise<T>): useReleaseAuditResult<T> { const [state,setState]=useState<useReleaseAuditResult<T>>({loading:true}); useEffect(()=>{ let cancelled=false; loader().then(data=>{if(!cancelled)setState({loading:false,data});}).catch((error:unknown)=>{if(!cancelled)setState({loading:false,error:error instanceof Error ? error.message : 'Unknown error'});}); return ()=>{cancelled=true;}; },[loader]); return state; }
