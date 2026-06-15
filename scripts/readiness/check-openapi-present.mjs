import { existsSync } from "node:fs";

const path = "SAFE_DIRECT_COPY/contracts/openapi/remotedesk-openapi.yaml";
if (!existsSync(path)) {
  console.error("OpenAPI contract missing:", path);
  process.exit(1);
}
console.log("OpenAPI contract present.");
