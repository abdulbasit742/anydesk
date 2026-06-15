import React from "react";

export function RetentionStatusNotice(props: { resourceType: string; keepDays: number; legalHold: boolean }): JSX.Element {
  return <aside role="status">{props.resourceType}: retained {props.keepDays} days{props.legalHold ? " · legal hold active" : ""}</aside>;
}
