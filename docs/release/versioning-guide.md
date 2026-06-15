# RemoteDesk Versioning Guide

## Semantic Versioning
```
MAJOR.MINOR.PATCH-HOTFIX

Example: 2.3.1-hotfix.2
```

### MAJOR (X.0.0)
- Breaking API changes
- Database schema changes requiring migration
- Removed features
- New architecture

### MINOR (x.X.0)
- New features
- Non-breaking API additions
- Performance improvements
- Deprecations (not removals)

### PATCH (x.x.X)
- Bug fixes
- Security patches
- Documentation updates
- Dependency updates

### HOTFIX (x.x.x-hotfix.X)
- Emergency fixes
- Post-release patches

## Branching
```
main (v2.x.x)
├── release/v2.3.0
│   ├── rc/v2.3.0-rc.1
│   └── v2.3.0 (tag)
├── hotfix/security-fix
│   └── v2.3.1-hotfix.1 (tag)
└── feature/new-dashboard
    └── merge to main -> v2.4.0
```

## Pre-release Tags
- `alpha`: Internal testing
- `beta`: External testing
- `rc`: Release candidate

## API Versioning
```
/api/v1/sessions     # Current stable
/api/v2/sessions     # Next version (preview)
```

## Desktop App Versioning
- Auto-updater checks for newer versions
- Supports delta updates
- Shows changelog before update
- User can skip versions

## Database Migrations
- Migrations tied to version
- Down migrations for rollback
- Version compatibility matrix
