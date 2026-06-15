# QA checklist

- Verify signed stable update acceptance and unsigned rejection.
- Verify redacted logs do not contain tokens or TURN credentials.
- Verify legal hold prevents retention deletion.
- Verify role-restricted dashboard pages stay hidden.
- Verify API routes are authenticated.
- Verify background jobs stop on AbortSignal.
