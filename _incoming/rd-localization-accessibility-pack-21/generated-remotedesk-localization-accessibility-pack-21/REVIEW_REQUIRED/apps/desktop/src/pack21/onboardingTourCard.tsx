import React from "react";

export function OnboardingTourCard(props: { title: string; step: number; total: number; onContinue: () => void }): JSX.Element {
  return <section><h3>{props.title}</h3><p>Step {props.step} of {props.total}</p><button onClick={props.onContinue}>Continue</button></section>;
}
