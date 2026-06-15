import assert from 'node:assert/strict'; import { isForwardVersion } from '../../packages/shared/src/pack20/versionPolicy.js'; assert.equal(isForwardVersion('1.0.0','1.0.1'), true);
