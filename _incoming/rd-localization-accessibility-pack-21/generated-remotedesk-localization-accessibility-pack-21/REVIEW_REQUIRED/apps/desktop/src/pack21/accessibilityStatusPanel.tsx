import React from "react";

export function AccessibilityStatusPanel(props: { highIssues: number; criticalIssues: number; reducedMotion: boolean }): JSX.Element {
  return <aside role="status">Accessibility: {props.highIssues} high · {props.criticalIssues} critical · reduced motion {props.reducedMotion ? "on" : "off"}</aside>;
}
