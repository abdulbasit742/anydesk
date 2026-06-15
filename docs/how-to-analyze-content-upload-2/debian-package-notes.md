# Debian Package Notes for RemoteDesk

This document outlines considerations for creating Debian packages (`.deb`) for RemoteDesk on Linux, targeting Debian-based distributions like Ubuntu and Mint.

## Overview
Debian packages are the standard way to distribute software on Debian, Ubuntu, and other derivative distributions. They provide a robust system for installation, upgrades, and uninstallation, integrating well with the system's package management tools (`apt`, `dpkg`).

## Benefits of Debian Packages
- **System Integration**: Seamlessly integrates with the operating system, including menu entries, icons, and proper dependency management.
- **Dependency Resolution**: `apt` automatically handles dependencies, ensuring all required libraries are installed.
- **Standardized Installation**: Follows established conventions for file placement (`/usr/bin`, `/usr/share`, `/etc`, etc.).
- **Easy Updates**: Users can update the application using standard system update mechanisms (`apt upgrade`).
- **Clean Uninstallation**: Ensures all installed files are removed cleanly.

## Structure of a Debian Package
A `.deb` package is essentially an `ar` archive containing three main components:
1.  **`debian-binary`**: Specifies the Debian package format version.
2.  **`control.tar.gz`**: Contains metadata about the package, including:
    -   `control`: Package name, version, architecture, dependencies, description.
    -   `preinst`, `postinst`, `prerm`, `postrm`: Maintainer scripts that run before/after installation/removal.
    -   `conffiles`: List of configuration files.
3.  **`data.tar.gz`**: Contains the actual application files, organized according to the Filesystem Hierarchy Standard (FHS).

## Creating a Debian Package (Conceptual Workflow)
Creating a Debian package typically involves using tools like `dpkg-buildpackage`, `debuild`, or `fpm`.

### 1. Prepare Source Directory
Organize your application's source code and build artifacts in a way that can be easily packaged.

### 2. Create `debian/` Directory
This directory contains all the files necessary for building the Debian package.

-   **`debian/control`**: Defines package metadata.
    ```
    Source: remotedesk
    Section: net
    Priority: optional
    Maintainer: Your Name <your.email@example.com>
    Build-Depends: debhelper-compat (= 13), # other build dependencies
    Standards-Version: 4.6.0
    Homepage: https://www.remotedesk.com
    #Vcs-Browser: https://salsa.debian.org/yourteam/remotedesk
    #Vcs-Git: https://salsa.debian.org/yourteam/remotedesk.git

    Package: remotedesk
    Architecture: amd64
    Depends: ${shlibs:Depends}, ${misc:Depends}, # other runtime dependencies
    Description: RemoteDesk - Remote Desktop Application
     RemoteDesk is a full-stack SaaS remote desktop application for secure and efficient remote access.
    ```

-   **`debian/changelog`**: Records changes for each package version.
-   **`debian/copyright`**: License information.
-   **`debian/rules`**: The build script (often a Makefile) that orchestrates the build and installation into the `debian/install` directory.
-   **`debian/install`**: Lists files to be installed and their destination paths.
    ```
    usr/bin/remotedesk
    usr/share/applications/remotedesk.desktop
    usr/share/icons/hicolor/scalable/apps/remotedesk.svg
    ```

-   **`debian/postinst`, `debian/prerm`**: Maintainer scripts for specific actions (e.g., updating icon caches, starting/stopping services).

### 3. Build the Package
Navigate to the root of your project and run:
```bash
debuild -us -uc
```
This will generate the `.deb` file in the parent directory.

## Installation
Users can install the `.deb` package using `dpkg` or `apt`:

```bash
sudo dpkg -i remotedesk_1.0.0_amd64.deb
sudo apt install ./remotedesk_1.0.0_amd64.deb # Recommended, handles dependencies
```

## Testing
- Verify installation on various Debian-based distributions (e.g., Ubuntu LTS, Debian Stable).
- Test installation, upgrade, and uninstallation processes.
- Ensure all application files are placed in correct FHS locations.
- Verify desktop integration (menu entry, icon, file associations).
- Check for proper dependency resolution.
- Ensure the application runs correctly after installation.
