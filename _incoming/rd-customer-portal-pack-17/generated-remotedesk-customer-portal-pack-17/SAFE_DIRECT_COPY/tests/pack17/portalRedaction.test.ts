import assert from "node:assert/strict"; import { redactPortalText } from "../../packages/shared/src/pack17/portalRedaction.js"; assert.equal(redactPortalText("token here"), "[redacted]");
