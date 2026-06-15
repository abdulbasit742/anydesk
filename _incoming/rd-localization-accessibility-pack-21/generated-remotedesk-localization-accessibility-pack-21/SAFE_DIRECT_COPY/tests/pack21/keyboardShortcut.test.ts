import assert from "node:assert/strict"; import { shortcutToLabel } from "../../packages/shared/src/pack21/keyboardShortcut.js"; assert.equal(shortcutToLabel({ ctrl: true, key: "k" }), "Ctrl+K");
