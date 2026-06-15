import assert from "node:assert/strict"; import { formatCountLabel } from "../../packages/shared/src/pack21/pluralRules.js"; assert.equal(formatCountLabel(2, "file", "files"), "2 files");
