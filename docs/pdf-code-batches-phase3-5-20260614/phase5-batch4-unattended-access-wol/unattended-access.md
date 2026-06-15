   # Unattended Access, Schedules & Wake-on-LAN


   ## Access grants
   An owner grants another user access to a device: scope (view/control/full),
   unattended (no host click needed), optional expiry, optional weekly schedule.
   Grants are revocable and checked on every unattended connect via `assertAllowed`:
   revoked → ACCESS_DENIED, past expiry → GRANT_EXPIRED, outside schedule → OUTSIDE_SCHEDULE.


   ## Unattended PIN
   Host sets a 6-10 digit PIN (hashed with the same scrypt hasher as passwords).
   Unattended connect requires **both** a valid grant and the correct PIN, then issues
   a short-lived session token that opens signaling without the accept/reject prompt.


   ## Wake-on-LAN
   If a device has a stored MAC + broadcast address, `POST /access/wake` sends a UDP
   magic packet (6x 0xFF + MAC x16) to port 9 on the broadcast address. Requires a
   relay/agent on the same L2 network as the target (a always-on peer or router).

   ## Security notes
   - Unattended access is the highest-risk feature: grant + PIN + audit log on every connect.
   - Schedules are evaluated in the grant's timezone via Intl, no server-clock assumptions.
   - Consider hardware-key/2FA on the grantee account before enabling `full` unattended scope.




Phase 5, Batch 4 done: 18 files — access/PIN/WoL DTOs + schemas + new error codes, pure schedule evaluator
(timezone-aware via Intl), access-grant migration + repo + service ( assertAllowed enforces

revoke/expiry/schedule), unattended-PIN service (scrypt-hashed), Wake-on-LAN magic-packet service, three
route files + schema, route registration, 3 test suites, and a doc.

What this enables: an owner can grant someone scoped, time-boxed, revocable access to a device, the host
sets an unattended PIN, and a viewer connects without anyone clicking Accept (grant + PIN both required, every
connect audited). Sleeping host? Fire a Wake-on-LAN magic packet first.

That's a feature-complete AnyDesk-class product across Phases 1-5. Next number = Phase 6 Batch 1 (billing +
subscription tiers with Stripe, seat limits, usage metering), or point me wherever. Bolo.
