# Desktop Application Build Guide

This guide provides instructions for building and packaging the RemoteDesk desktop application for various operating systems.

## Prerequisites

- Node.js (LTS version)
- Yarn or npm
- Git
- Development tools for your target platform (e.g., Xcode for macOS, Visual Studio for Windows)

## Build Steps

1.  **Navigate to the desktop application directory:**
    ```bash
    cd remotedesk/apps/desktop
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    # or npm install
    ```

3.  **Build for development (optional):**
    To run the application in development mode:
    ```bash
    yarn electron:serve
    # or npm run electron:serve
    ```

4.  **Build for production:**
    To create distributable packages, use the following commands:

    -   **For all platforms (macOS, Windows, Linux):**
        ```bash
        yarn electron:build
        # or npm run electron:build
        ```

    -   **For a specific platform:**
        -   **macOS:** `yarn electron:build --mac`
        -   **Windows:** `yarn electron:build --win`
        -   **Linux:** `yarn electron:build --linux`

    The build artifacts will be located in the `dist_electron` directory.

## Code Signing

It is highly recommended to code sign your application for production releases to ensure trust and avoid security warnings on user machines.

-   **macOS:** Configure `electron-builder` with your Apple Developer ID and signing certificates.
-   **Windows:** Configure `electron-builder` with your EV Code Signing Certificate.

Refer to the `electron-builder` documentation for detailed code signing instructions.

## Auto-Updates

RemoteDesk desktop application should support auto-updates. Ensure the auto-update mechanism is configured and tested before release.

-   **Configuration:** Set up `electron-updater` with your update server URL.
-   **Release Workflow:** Integrate auto-update publishing into your CI/CD pipeline.

## Troubleshooting

-   **Build failures:** Check Node.js version, dependency installation, and platform-specific build tools.
-   **Code signing issues:** Verify certificate validity and `electron-builder` configuration.
-   **Application startup errors:** Check console logs for Electron main process errors.
