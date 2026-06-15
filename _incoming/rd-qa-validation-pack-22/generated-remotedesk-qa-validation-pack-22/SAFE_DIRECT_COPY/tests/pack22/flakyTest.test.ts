import assert from "node:assert/strict"; import { quarantineRecommended } from "../../packages/shared/src/pack22/flakyTest.js"; assert.equal(quarantineRecommended({ runs: 10, failures: 2 }), true);
