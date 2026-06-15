import React from 'react';
export function PushNotificationPreview(props: { title: string; body: string }): JSX.Element { return <aside><strong>{props.title}</strong><p>{props.body}</p></aside>; }
