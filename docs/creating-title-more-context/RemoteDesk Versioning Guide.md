# RemoteDesk Versioning Guide

This guide outlines the versioning strategy for the RemoteDesk project, adhering to Semantic Versioning (SemVer) principles.

## Semantic Versioning (SemVer)

RemoteDesk follows the [Semantic Versioning 2.0.0](https://semver.org/) specification, which uses a three-component number system: `MAJOR.MINOR.PATCH`.

-   **MAJOR** version when you make incompatible API changes,
-   **MINOR** version when you add functionality in a backward-compatible manner, and
-   **PATCH** version when you make backward-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

## Application Components

Each major component of the RemoteDesk ecosystem will have its own version number, managed independently:

-   **Backend API (`apps/api`):** Follows SemVer for API changes.
-   **Web Application (`apps/web`):** Follows SemVer for new features and bug fixes.
-   **Desktop Application (`apps/desktop`):** Follows SemVer for new features, bug fixes, and Electron-specific updates.
-   **Shared Packages (`packages/shared`):** Follows SemVer for shared types, utilities, and common logic.

## Versioning Workflow

1.  **Development Branches:** Feature branches are typically based off `develop` or `main`.
2.  **Release Branches:** When preparing for a release, a release branch (e.g., `release/v1.2.0`) is created from `develop`.
3.  **Version Bumping:**
    -   **PATCH:** For bug fixes, hotfixes, or minor internal changes that don't affect public APIs.
    -   **MINOR:** For new features that are backward-compatible.
    -   **MAJOR:** For breaking changes, significant architectural shifts, or major new product versions.
4.  **Tagging:** Once a release branch is stable and ready, it is merged into `main`, and a version tag (e.g., `v1.2.0`) is applied to the `main` branch.
5.  **Changelog:** The `CHANGELOG.md` is updated with all changes included in the release.

## Pre-release Versions

For pre-release versions (e.g., alpha, beta, release candidates), append a hyphen and a series of dot-separated identifiers immediately following the patch version.

Example: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`.

## Build Metadata

Build metadata may be appended by a plus sign and a series of dot-separated identifiers immediately following the patch or pre-release version.

Example: `1.0.0-alpha.1+001`, `1.0.0+20130313144700`.

## Tools

Consider using tools like `lerna` or `changesets` for monorepo version management, especially for shared packages, to automate version bumping and changelog generation.
