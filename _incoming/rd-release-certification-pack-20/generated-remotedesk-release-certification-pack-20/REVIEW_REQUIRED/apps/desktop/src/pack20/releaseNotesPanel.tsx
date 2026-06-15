import React from 'react';
export function ReleaseNotesPanel(props:{version:string; notes:string[]}): JSX.Element { return <section><h3>Release notes {props.version}</h3><ul>{props.notes.map(note => <li key={note}>{note}</li>)}</ul></section>; }
