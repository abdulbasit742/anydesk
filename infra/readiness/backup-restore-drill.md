# Backup restore drill

Run monthly:
1. Restore latest backup to isolated environment.
2. Verify schema migration version.
3. Run integrity checks on users, teams, devices, sessions and audit logs.
4. Verify support ticket attachments metadata.
5. Destroy isolated environment.
