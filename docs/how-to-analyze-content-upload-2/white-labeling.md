# RemoteDesk White-labeling Capabilities

This document describes the White-labeling capabilities within RemoteDesk, allowing organizations to customize the branding of the RemoteDesk platform to align with their corporate identity.

## Overview
White-labeling is a crucial feature for enterprise clients who wish to integrate RemoteDesk seamlessly into their existing ecosystem and present it as their own branded solution. This capability allows for extensive customization of the user interface, including logos, colors, domains, and support information, across both web and desktop clients.

## Features
- **Custom Domain Support**: Use a custom domain (e.g., `support.yourcompany.com`) for the RemoteDesk web portal.
- **Branded Logos & Favicons**: Replace RemoteDesk logos and favicons with corporate branding.
- **Custom Color Schemes**: Adjust primary and secondary colors to match brand guidelines.
- **Custom Support Information**: Display company-specific support email and phone numbers.
- **Custom CSS/JavaScript Injection**: Inject custom CSS for advanced styling and custom JavaScript for additional client-side functionality.
- **Desktop Client Branding**: Extend white-labeling to the desktop client, including custom application names and logos.
- **Live Preview**: Generate a live preview of the white-labeled experience before deployment.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`WhiteLabelingConfig`**: Defines the configuration settings for white-labeling, including `enabled`, `organizationId`, `customDomain`, `logoUrl`, `faviconUrl`, `primaryColor`, `secondaryColor`, `supportEmail`, `supportPhone`, `customCss`, `customJs`, and specific fields for `desktopClientBrandingEnabled`, `desktopClientLogoUrl`, and `desktopClientAppName`.
- **`WhiteLabelingPreview`**: Represents a preview of the white-labeled experience, containing generated `html`, `css`, `js`, and an optional `desktopClientPreviewImage`.
- **Location**: `remotedesk/packages/shared/src/customization/white-labeling.dto.ts`

### API Service Logic
- **`WhiteLabelingService.ts`**: Manages white-labeling configurations and generates previews on the API server.
  - **Configuration Management**: Loads and updates `WhiteLabelingConfig` for specific organizations.
  - **Preview Generation**: The `generatePreview` method constructs an HTML, CSS, and JavaScript snippet that reflects the configured branding. It also simulates a desktop client preview.
  - **Dynamic Asset Serving**: (Implicit) The web and desktop clients would dynamically fetch and apply these configurations and assets at runtime.
- **Location**: `remotedesk/apps/api/src/customization/WhiteLabelingService.ts`

### API Routes
- **`/api/customization/white-labeling/config/:organizationId` (POST)**: Update white-labeling configuration for an organization.
- **`/api/customization/white-labeling/config/:organizationId` (GET)**: Retrieve white-labeling configuration for an organization.
- **`/api/customization/white-labeling/preview/:organizationId` (GET)**: Generate a preview of the white-labeled experience.
- **Location**: `remotedesk/apps/api/src/customization/customization.routes.ts`

### Web Client Integration
- The RemoteDesk web application will fetch the `WhiteLabelingConfig` for the logged-in organization.
- It will dynamically apply the custom domain, logos, colors, and inject custom CSS/JS to rebrand the UI.

### Desktop Client Integration
- The RemoteDesk desktop client will also fetch its specific branding configurations.
- It will apply the `desktopClientAppName` and `desktopClientLogoUrl` to customize the application's appearance.

## Usage

### Configuration
1. **Enable White-labeling**: In the RemoteDesk admin panel, enable white-labeling for a specific organization.
2. **Upload Assets**: Provide URLs for custom logos and favicons.
3. **Define Colors**: Specify primary and secondary brand colors using hex codes.
4. **Custom Code**: Optionally, inject custom CSS and JavaScript for advanced styling or functionality.
5. **Desktop Branding**: Configure desktop client-specific branding elements.
6. **Preview**: Use the preview feature to visualize the changes before applying them globally.

### Deployment
- For custom domains, DNS records (e.g., CNAME) will need to be configured to point to RemoteDesk servers.
- Desktop client builds might require specific branding assets to be bundled during the build process, or fetched dynamically at runtime.

## Technical Considerations
- **Security of Custom Code**: Injected custom JavaScript must be carefully vetted to prevent XSS vulnerabilities.
- **CSS/JS Conflicts**: Custom CSS/JS should be designed to avoid conflicts with the core application's styles and scripts.
- **Asset Hosting**: Custom assets (logos, favicons) need to be hosted on a reliable and secure CDN.
- **Desktop Client Updates**: Ensuring that desktop client branding updates can be deployed efficiently, potentially through the auto-update system.
- **Multi-tenancy**: The system must correctly apply branding configurations per organization, ensuring isolation between tenants.

## Future Enhancements
- **Theme Builder UI**: A visual theme builder to simplify color and style customization.
- **Advanced Customization Options**: More granular control over specific UI elements.
- **Internationalization (i18n) for Branding**: Support for localized branding elements.
- **Version Control for Customizations**: Allow organizations to manage different versions of their white-labeling configurations.
