 # Testing Strategy


 - **Unit:** pure logic (state machines, backoff, normalization, schemas). No DOM/network.
 - **Service:** in-memory stores + mocked WebRTC/MediaStream.
 - **Route:** supertest against an in-memory Express app (`testServer.ts`).
 - **Integration:** capture â†’ engine â†’ input pipeline with mocks installed via `webrtcTestHarness`.

Run: `pnpm -r test`. Coverage focus: signaling negotiation, reconnect, consent timeout, schema validation.
