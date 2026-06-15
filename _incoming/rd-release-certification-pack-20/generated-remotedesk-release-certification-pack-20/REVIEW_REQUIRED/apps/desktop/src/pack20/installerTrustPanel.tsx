import React from 'react';
export function InstallerTrustPanel(props:{signed:boolean; notarized?:boolean; sha256:string}): JSX.Element { return <section><h3>Installer trust</h3><p>Signed: {props.signed ? 'yes' : 'no'}</p><p>Notarized: {props.notarized ? 'yes' : 'not required or missing'}</p><code>{props.sha256}</code></section>; }
