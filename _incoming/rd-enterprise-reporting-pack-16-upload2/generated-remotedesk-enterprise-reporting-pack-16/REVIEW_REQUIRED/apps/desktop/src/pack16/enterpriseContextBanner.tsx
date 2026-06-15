import React from "react";

export function EnterpriseContextBanner(props: { organizationName: string; departmentPath?: string; role: string }): JSX.Element {
  return (
    <aside role="status">
      <strong>{props.organizationName}</strong>
      <span>{props.departmentPath ? ` · ${props.departmentPath}` : ""} · {props.role}</span>
    </aside>
  );
}
