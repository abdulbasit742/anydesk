import assert from "node:assert/strict"; import { escapeCsvCell } from "../../packages/shared/src/pack16/csvExportSafety.js"; assert.equal(escapeCsvCell("=1+1"), "\"'=1+1\"");
