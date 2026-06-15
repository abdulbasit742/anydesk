export interface InstallerSignature { platform:'windows'|'macos'|'linux'; signed:boolean; notarized?:boolean; }
export function installerSignatureValid(s: InstallerSignature): boolean { if(!s.signed) return false; return s.platform === 'macos' ? s.notarized === true : true; }
