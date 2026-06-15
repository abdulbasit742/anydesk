import assert from 'node:assert/strict'; import { canPromoteChannel } from '../../packages/shared/src/pack20/releaseChannel.js'; assert.equal(canPromoteChannel('alpha','beta'), true);
