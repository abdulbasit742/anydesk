# Permission Gate QA Checklist

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** QA Testing Checklist for Permission System

---

## Default Deny

- [ ] New session starts with all permissions denied
- [ ] Mouse move denied by default
- [ ] Mouse click denied by default
- [ ] Mouse wheel denied by default
- [ ] Keyboard denied by default

## Permission Grant

- [ ] Host grants mouse move -> viewer can move mouse
- [ ] Host grants mouse click -> viewer can click
- [ ] Host grants mouse wheel -> viewer can scroll
- [ ] Host grants keyboard -> viewer can type
- [ ] Host grants all -> all input types work

## Permission Revoke

- [ ] Host revokes mouse move -> viewer mouse moves blocked
- [ ] Host revokes mouse click -> viewer clicks blocked
- [ ] Host revokes keyboard -> viewer keystrokes blocked
- [ ] Host revokes all -> all input blocked
- [ ] Revoke takes effect within 1 IPC round-trip

## Granularity

- [ ] Grant mouse move only -> clicks blocked
- [ ] Grant keyboard only -> mouse blocked
- [ ] Grant mouse click only -> moves blocked
- [ ] Each permission is independent

## Persistence

- [ ] Permissions persist during session
- [ ] Permissions reset on new session
- [ ] Permission changes synced to viewer
- [ ] Host UI reflects current permissions

---

## Permission UI

- [ ] Host sees permission toggle controls
- [ ] Toggles reflect current state
- [ ] Toggle changes update immediately
- [ ] Viewer sees current permission state
- [ ] Viewer UI disables input for denied types
