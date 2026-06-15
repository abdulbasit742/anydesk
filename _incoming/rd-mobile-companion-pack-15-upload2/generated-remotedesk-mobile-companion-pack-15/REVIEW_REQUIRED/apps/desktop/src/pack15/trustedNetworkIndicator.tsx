import React from 'react';
export function TrustedNetworkIndicator(props: { trusted: boolean; label?: string }): JSX.Element { return <span data-trusted-network={props.trusted}>{props.trusted ? `Trusted network${props.label ? `: ${props.label}` : ''}` : 'Untrusted network'}</span>; }
