# Git Branching Strategy for RemoteDesk

This document outlines the recommended Git branching strategy for the RemoteDesk monorepo, aiming to facilitate collaborative development, streamline releases, and maintain a clean and stable codebase.

## 1. Main Branches

### 1.1. `main` Branch

*   **Purpose**: Represents the production-ready state of the application. All code in `main` should be stable, fully tested, and deployable.
*   **Protection**: Protected branch; direct commits are forbidden. All changes must come through pull requests from `develop` or release branches.
*   **CI/CD**: Pushing to `main` triggers a full CI/CD pipeline, including deployment to production environments.

### 1.2. `develop` Branch

*   **Purpose**: Integrates all new features and bug fixes from feature branches. It represents the latest development state.
*   **Protection**: Protected branch; direct commits are forbidden. All changes must come through pull requests from feature branches.
*   **CI/CD**: Pushing to `develop` triggers a full CI/CD pipeline, including deployment to staging/testing environments.

## 2. Supporting Branches

### 2.1. Feature Branches (`feature/<feature-name>`)

*   **Purpose**: Used for developing new features. Each feature should have its own branch.
*   **Origin**: Branch off `develop`.
*   **Merge Target**: Merge back into `develop` via a pull request once the feature is complete and reviewed.
*   **Naming Convention**: `feature/add-clipboard-sync`, `feature/implement-chat`.

### 2.2. Release Branches (`release/<version-number>`)

*   **Purpose**: Used for preparing a new production release. This branch allows for final bug fixes, testing, and documentation updates without disrupting ongoing development in `develop`.
*   **Origin**: Branch off `develop` when `develop` has enough features for a new release.
*   **Merge Target**: Merge into `main` and `develop` (to ensure release fixes are carried back to development) via pull requests.
*   **Naming Convention**: `release/1.0.0`, `release/1.1.0`.

### 2.3. Hotfix Branches (`hotfix/<issue-description>`)

*   **Purpose**: Used for quickly addressing critical bugs in production (`main` branch) that cannot wait for the next planned release.
*   **Origin**: Branch off `main`.
*   **Merge Target**: Merge back into `main` and `develop` (to ensure the hotfix is included in future releases) via pull requests.
*   **Naming Convention**: `hotfix/fix-login-bug`, `hotfix/patch-security-vulnerability`.

## 3. Workflow Summary

1.  **Start a new feature**: Branch `feature/<feature-name>` from `develop`.
2.  **Develop and commit**: Work on the feature, committing regularly to the feature branch.
3.  **Pull Request**: When the feature is complete, open a pull request from `feature/<feature-name>` to `develop` for review and merging.
4.  **Prepare for release**: When `develop` is ready for a new release, branch `release/<version-number>` from `develop`.
5.  **Final testing and bug fixes**: Perform final testing and apply any last-minute bug fixes directly to the `release` branch.
6.  **Release**: Once stable, merge `release/<version-number>` into `main` and `develop`. Tag the `main` branch with the version number.
7.  **Hotfix**: If a critical bug is found in production, branch `hotfix/<issue-description>` from `main`.
8.  **Fix and merge**: Apply the fix to the `hotfix` branch, then merge it into `main` and `develop`. Tag `main` with a new patch version.

This strategy, inspired by GitFlow, provides a clear, structured approach to managing the RemoteDesk codebase, promoting stability and efficient collaboration.
