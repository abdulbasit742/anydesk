# RemoteDesk Plugin System

This document describes the RemoteDesk Plugin System, which allows for extending the platform's functionality through custom-developed plugins.

## Overview
The Plugin System provides a flexible and extensible architecture, enabling organizations and third-party developers to integrate new features, automate tasks, and customize RemoteDesk to meet specific operational needs. Plugins can range from simple automation scripts to complex desktop or web extensions, all managed and sandboxed for security and stability.

## Features
- **Modular Extensions**: Develop and deploy modular components that extend core RemoteDesk capabilities.
- **Multiple Plugin Types**: Support for various plugin types, including desktop extensions, web extensions, API integrations, and automation scripts.
- **Secure Sandboxing**: Plugins run in isolated environments to prevent interference with the core application and enhance security.
- **Permission Management**: Granular control over the permissions granted to each plugin, ensuring secure operation.
- **Configuration Management**: Plugins can define their own configuration schemas, allowing for easy management through the RemoteDesk admin interface.
- **Lifecycle Management**: Tools for installing, enabling, disabling, and uninstalling plugins.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`PluginType`**: An enum defining the categories of plugins (e.g., `DESKTOP_EXTENSION`, `WEB_EXTENSION`, `API_INTEGRATION`, `AUTOMATION_SCRIPT`).
- **`PluginStatus`**: An enum representing the operational status of an installed plugin (`ENABLED`, `DISABLED`, `ERROR`).
- **`PluginManifest`**: Describes a plugin's metadata, including `id`, `name`, `version`, `description`, `author`, `type`, `entryPoint`, `configSchema`, `permissions`, `dependencies`, and `supportedPlatforms`.
- **`InstalledPlugin`**: Represents an instance of an installed plugin within an organization, including its `manifest`, `status`, `configuration`, and installation timestamps.
- **`PluginSystemConfig`**: Configuration settings for the entire plugin system, such as `enabled`, `allowThirdPartyPlugins`, `pluginStoragePath`, and `sandboxPlugins`.
- **Location**: `remotedesk/packages/shared/src/customization/plugin-system.dto.ts`

### API Service Logic
- **`PluginManagementService.ts`**: Manages the lifecycle of plugins on the API server.
  - **Configuration Management**: Loads and updates plugin system settings.
  - **Installation**: Handles the installation process, including validation of the `PluginManifest` and storage of plugin files.
  - **Enable/Disable**: Manages the activation and deactivation of installed plugins, updating their `PluginStatus`.
  - **Audit Logging**: Logs all significant plugin actions (install, enable, disable) to the Advanced Audit system.
  - **Plugin Storage**: Manages the storage of plugin files in a designated `pluginStoragePath`.
- **Location**: `remotedesk/apps/api/src/customization/PluginManagementService.ts`

### API Routes
- **`/api/customization/plugins/install` (POST)**: Install a new plugin for an organization.
- **`/api/customization/plugins/:id/enable` (POST)**: Enable an installed plugin.
- **`/api/customization/plugins/:id/disable` (POST)**: Disable an installed plugin.
- **`/api/customization/plugins/organization/:organizationId` (GET)**: Retrieve all installed plugins for a given organization.
- **`/api/customization/plugins/config` (POST/GET)**: Manage the global configuration for the plugin system.
- **Location**: `remotedesk/apps/api/src/customization/customization.routes.ts`

## Usage

### Configuration
1. **Enable Plugin System**: In the RemoteDesk admin panel, enable the plugin system.
2. **Allow Third-Party Plugins**: Decide whether to allow plugins from external developers or restrict to official RemoteDesk plugins.
3. **Plugin Storage**: Configure the `pluginStoragePath` for storing plugin files.

### Plugin Development
1. **Create Manifest**: Developers define their plugin's capabilities and requirements in a `PluginManifest`.
2. **Implement Logic**: Develop the plugin's core logic according to its `PluginType` (e.g., a desktop extension would interact with the desktop client API).

### Plugin Management
1. **Installation**: Administrators upload the plugin manifest and files via the admin interface or API.
2. **Configuration**: Configure plugin-specific settings through the generated UI based on the `configSchema`.
3. **Activation**: Enable the plugin to make it active within the RemoteDesk environment.

## Technical Considerations
- **Security Model**: The sandboxing mechanism is critical to prevent malicious plugins from compromising the system. This involves process isolation, strict permission enforcement, and code signing.
- **API for Plugins**: A well-defined and stable API for plugins to interact with RemoteDesk core functionalities is essential.
- **Versioning**: Managing plugin versions and ensuring compatibility with the core application.
- **Performance Impact**: Plugins should be designed to have minimal impact on the performance of the core application.
- **Debugging**: Providing tools and logs for developers to debug their plugins.

## Future Enhancements
- **Plugin Marketplace**: A public marketplace for discovering and installing third-party plugins.
- **Automated Testing**: Tools for automated testing of plugins during development and deployment.
- **Hot-reloading**: Ability to update plugins without restarting the core application.
- **Advanced Sandboxing**: Utilize technologies like WebAssembly or containerization for more robust isolation.
