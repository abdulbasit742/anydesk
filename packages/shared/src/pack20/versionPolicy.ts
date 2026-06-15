export interface SemverParts { major:number; minor:number; patch:number; }
export function parseSemver(v:string): SemverParts|undefined { const m=/^(\d+)\.(\d+)\.(\d+)$/.exec(v.trim()); return m ? {major:+m[1], minor:+m[2], patch:+m[3]} : undefined; }
export function isForwardVersion(previous:string,next:string): boolean { const a=parseSemver(previous), b=parseSemver(next); return !!a && !!b && (b.major>a.major || (b.major===a.major && b.minor>a.minor) || (b.major===a.major && b.minor===a.minor && b.patch>a.patch)); }
