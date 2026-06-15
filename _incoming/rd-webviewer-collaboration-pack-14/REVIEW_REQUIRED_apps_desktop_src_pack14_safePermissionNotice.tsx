import React from "react";

export function SafePermissionNotice(props: { permission: string; blockedReason: string }): JSX.Element {
  return <aside role="status"><strong>{props.permission} blocked</strong><p>{props.blockedReason}</p></aside>;
}
