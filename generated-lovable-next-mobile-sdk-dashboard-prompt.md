You are continuing the RemoteDesk web dashboard on Lovable/Supabase. Do not rewrite the app. Keep the existing AppShell, sidebar, role-aware navigation, theme tokens, route style, and Supabase backend. First inspect the current schema/routes/components and skip anything already implemented.

Goal: make the web dashboard match the new RemoteDesk mobile/client-SDK direction and remove the remaining mock fallbacks.

Build only real Supabase-backed features, no placeholder pages.

1. Database/schema work
- If missing, add support_tickets with id, user_id, team_id nullable, subject, body, status open/in_progress/resolved/closed, priority low/normal/high/urgent, category, assigned_to nullable, created_at, updated_at, resolved_at nullable.
- If missing, add device_contacts with id, user_id, remote_desk_id, display_name, alias nullable, os nullable, tags text[], is_favorite boolean, notes nullable, last_connected_at nullable, created_at, updated_at.
- If missing, add mobile_devices with id, user_id, device_name, platform ios/android, app_version nullable, push_token nullable, trusted boolean, last_seen_at nullable, created_at, updated_at.
- If missing, add audit_logs or extend existing audit table for contact_created, contact_updated, ticket_created, mobile_device_registered, sdk_docs_viewed.
- Add strict RLS so users can only see their own rows; team admins can see team rows if team membership exists in the current schema. Do not weaken existing RLS.

2. Support page
- Replace any mock support tickets with live support_tickets queries.
- Add create-ticket form, status/priority filters, empty state, loading state, and optimistic mutation.
- Show fallback/demo banner only if Supabase query fails or table is absent.

3. Contacts page
- Add a real Contacts/Address Book dashboard page backed by device_contacts.
- Include search, favorite toggle, tag filter, create/edit/delete contact, and quick Connect CTA using remote_desk_id.
- Reuse existing StatusBadge/MetricCard/table patterns. No marketing layout.

4. Mobile access page
- Add a Mobile Access page backed by mobile_devices.
- Show registered mobile devices, trusted status, platform, app version, last seen, revoke trust action, and setup QR/config panel.
- Include copyable API base URL and socket URL fields from env/config.

5. Developer SDK page
- Add a Developer / SDK page for RemoteDesk Client SDK docs.
- Show install snippet, initialization snippet, auth/login snippet, sessions history snippet, and device lookup snippet.
- Wire the page to real config values where available. Do not expose secrets.

6. Navigation and permissions
- Add nav links only for roles that should see them.
- Admin/support roles can see support triage. Normal users can see their own tickets, contacts, mobile access, and SDK docs.

7. Quality requirements
- Keep the existing responsive dashboard layout.
- Add clear loading, empty, and error states.
- Add CSV export only where data is visible.
- Keep dark/light theme working.
- Do not add fake mock rows if Supabase has no data; show real empty states.

Expected output:
- List changed files.
- List SQL migrations/schema changes.
- List Supabase tables used.
- List remaining mock fallbacks after this turn.
- Tell me what to ask Codex to wire next in the local monorepo.

