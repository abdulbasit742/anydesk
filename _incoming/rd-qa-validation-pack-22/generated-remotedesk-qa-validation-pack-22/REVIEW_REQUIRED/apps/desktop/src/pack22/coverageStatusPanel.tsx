import React from "react";

export function CoverageStatusPanel(props: { statements: number; branches: number; functions: number; lines: number }): JSX.Element {
  return <aside>Coverage: statements {props.statements}% · branches {props.branches}% · functions {props.functions}% · lines {props.lines}%</aside>;
}
