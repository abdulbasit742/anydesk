import React from 'react';
export function QrPairingDisplay(props: { code: string; expiresAt: string; qrText: string }): JSX.Element { return <section><h3>Pair mobile companion</h3><code>{props.code}</code><p>Expires {new Date(props.expiresAt).toLocaleString()}</p><textarea readOnly value={props.qrText} aria-label='QR pairing payload' /></section>; }
