import React from "react";

export function EncryptionStatusBadge(props: { status: "active" | "rotating" | "retired" | "disabled" }): JSX.Element {
  return <span data-encryption-key-status={props.status}>Encryption key: {props.status}</span>;
}
