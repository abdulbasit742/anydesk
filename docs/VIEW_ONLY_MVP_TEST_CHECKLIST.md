# View-Only MVP Test Checklist

Branch: `chatgpt/24-view-only-mvp-test-pack`

Use this checklist to verify the RemoteDesk PC-to-PC view-only MVP.

## Safety scope

This test is view-only only.

Do not enable:

- remote input
- clipboard sync
- file transfer
- unattended access
- silent access
- recording

## Required apps

1. API running on `http://localhost:5000`
2. Desktop host app logged in and registered
3. Dashboard/PWA logged in as viewer

## Test A — Host device registration

Expected result:

- desktop login succeeds
- device enroll/register succeeds
- heartbeat succeeds
- device appears online in dashboard

Record:

- PASS/FAIL
- device ID
- exact error if failed

## Test B — Viewer route open

Open:

`/dashboard/viewer?deviceId=<DEVICE_ID>`

Expected result:

- viewer page loads
- safety banner visible
- Request from device button visible
- remote input/file transfer/clipboard not present

## Test C — Session request

Click `Request from device`.

Expected result:

- backend creates pending session
- viewer joins signaling server
- desktop host receives consent request

## Test D — Host consent

On desktop host, accept only after verifying:

- viewer identity is visible
- requested mode is view-only
- screen source is selected

Expected result:

- session becomes accepted/active
- host starts screen capture
- host emits WebRTC offer

## Test E — WebRTC viewer

Expected result:

- viewer receives offer
- viewer sends answer
- ICE candidates exchange
- video stream appears in dashboard viewer

## Test F — Emergency stop

Click emergency stop from viewer or host.

Expected result:

- media tracks stop
- peer closes
- session state changes
- viewer video disappears
- host sharing stops

## Final PASS definition

The MVP passes only if a second browser/PC can see the host screen after host consent and can stop the session safely.

If video does not appear, record exact blocker:

- no session request
- no host consent modal
- no offer
- no answer
- ICE failed
- screen capture permission failed
- TURN/STUN/network issue
