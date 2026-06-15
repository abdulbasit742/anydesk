# Advanced Module Governance: Module Versioning Strategy

This document defines the module versioning strategy for the RemoteDesk project, ensuring consistency, clarity, and manageability across all internal and external modules. A well-defined versioning strategy is crucial for dependency management, release planning, and communicating changes effectively.

## 1. Overview

RemoteDesk will adopt a strict [Semantic Versioning 2.0.0](https://semver.org/) (`MAJOR.MINOR.PATCH`) approach for all its published packages and internal modules. This standard provides a clear way to communicate the nature of changes in each release.

## 2. Semantic Versioning (SemVer)

Given a version number `MAJOR.MINOR.PATCH`, increment the:

*   **MAJOR** version when you make incompatible API changes.
*   **MINOR** version when you add functionality in a backward-compatible manner.
*   **PATCH** version when you make backward-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

### 2.1. Pre-release Versions

Pre-release versions can be denoted by appending a hyphen and a series of dot-separated identifiers immediately following the patch version. Examples: `1.0.0-alpha`, `1.0.0-alpha.1`, `1.0.0-0.3.7`, `1.0.0-x.7.z.92`.

### 2.2. Build Metadata

Build metadata can be denoted by appending a plus sign and a series of dot-separated identifiers immediately following the patch or pre-release version. Examples: `1.0.0+build.11`, `1.0.0-alpha.1+001`.

## 3. Application to RemoteDesk Modules

### 3.1. Public Packages (`packages/shared`, `packages/ui`)

All packages intended for external consumption or used across multiple distinct applications (e.g., `remotedesk/packages/shared`, `remotedesk/packages/ui`) will strictly adhere to SemVer. Changes to these packages will trigger appropriate version increments.

### 3.2. Internal Application Modules (`apps/api`, `apps/web`, `apps/desktop`)

While these applications themselves might follow a broader release version, their internal modules (e.g., a specific feature module within `apps/api`) will also be versioned using SemVer. This helps in managing internal dependencies and understanding the impact of changes within the monorepo.

## 4. Versioning Workflow

1.  **Feature Development:** New features or significant changes are developed on feature branches.
2.  **Pull Request (PR) Review:** During PR review, the impact of changes on existing APIs and functionality is assessed to determine the appropriate version increment (MAJOR, MINOR, PATCH).
3.  **Automated Version Bumping:** Tools like `lerna` or `changesets` will be used in the monorepo to automate version bumping based on conventional commits or explicit change declarations.
4.  **Release:** When a new version of a package or application is ready for release, the version is finalized, and release notes are generated.

## 5. Communicating Changes

*   **Changelogs:** Each versioned module will maintain a `CHANGELOG.md` file detailing all changes.
*   **Release Notes:** Comprehensive release notes will be generated for major application releases, summarizing changes across all included modules.
*   **Deprecation Policy:** (Refer to `advanced-module-governance-deprecation.md`) Clearly communicate deprecated features and provide migration paths.

## 6. Related Documents

*   `advanced-module-governance-dynamic-loading.md`
*   `advanced-module-governance-cross-communication.md`
*   `advanced-module-governance-deprecation.md`
*   `pr-review-checklist.md`
*   `release-process-documentation.md`
