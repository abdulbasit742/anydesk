# RemoteDesk Changelog Templates

## Format: Keep a Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- New feature description

### Changed
- Change description

### Deprecated
- Feature being deprecated

### Removed
- Feature removed

### Fixed
- Bug fix description

### Security
- Security fix description

## [2.3.1] - 2026-06-12

### Fixed
- Fixed connection timeout issue on slow networks
- Corrected desk ID validation for certain ranges

### Security
- Updated dependencies to patch vulnerabilities

## [2.3.0] - 2026-06-01

### Added
- Session recording feature
- Bulk device management
- New keyboard shortcuts

### Changed
- Improved connection quality on cellular networks
- Updated UI theme

### Fixed
- Fixed clipboard sync on macOS
- Resolved memory leak in long sessions
```

## Categories
| Category | Usage |
|----------|-------|
| Added | New features |
| Changed | Changes to existing functionality |
| Deprecated | Soon-to-be removed features |
| Removed | Removed features |
| Fixed | Bug fixes |
| Security | Security fixes |

## Entry Format
```
- [Scope]: Description (#issue)

Examples:
- [API]: Added session recording endpoint (#1234)
- [Web]: Fixed dark mode toggle (#1235)
- [Desktop]: Improved auto-updater reliability (#1236)
```
