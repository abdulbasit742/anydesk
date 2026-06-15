export function installerArtifactBlocksRelease(i:{platform:string; signed:boolean; notarized?:boolean}): boolean { return !i.signed || (i.platform==='macos' && i.notarized!==true); }
