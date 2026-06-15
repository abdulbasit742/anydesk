export type ReleaseChannel = 'internal'|'alpha'|'beta'|'stable'|'hotfix';
export function releaseChannelRank(c: ReleaseChannel): number { return {internal:0,alpha:1,beta:2,stable:3,hotfix:4}[c]; }
export function canPromoteChannel(from: ReleaseChannel, to: ReleaseChannel): boolean { return releaseChannelRank(to) >= releaseChannelRank(from) && !(from === 'hotfix' && to !== 'stable'); }
