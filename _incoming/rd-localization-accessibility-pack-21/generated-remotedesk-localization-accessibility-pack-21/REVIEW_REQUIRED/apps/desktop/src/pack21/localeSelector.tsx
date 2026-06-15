import React from "react";

export function LocaleSelector(props: { locale: string; locales: string[]; onChange: (locale: string) => void }): JSX.Element {
  return (
    <label>
      Language
      <select value={props.locale} onChange={(event) => props.onChange(event.currentTarget.value)}>
        {props.locales.map((locale) => <option key={locale} value={locale}>{locale}</option>)}
      </select>
    </label>
  );
}
