import React from "react";

export function SafeActionNotice(props: { action: string; reason: string }): JSX.Element {
  return <aside role="status"><strong>Automation action blocked</strong><p>{props.action}: {props.reason}</p></aside>;
}
