import React from 'react';
export function ReleaseChannelBadge(props:{channel:'internal'|'alpha'|'beta'|'stable'|'hotfix'; version:string}): JSX.Element { return <span data-release-channel={props.channel}>Release {props.version} · {props.channel}</span>; }
