import React from "react";

export function DepartmentSwitcher(props: { departments: Array<{ id: string; path: string }>; selectedId?: string; onChange: (id: string) => void }): JSX.Element {
  return (
    <label>
      Department
      <select value={props.selectedId ?? ""} onChange={(event) => props.onChange(event.currentTarget.value)}>
        {props.departments.map((department) => <option key={department.id} value={department.id}>{department.path}</option>)}
      </select>
    </label>
  );
}
