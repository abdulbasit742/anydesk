# RemoteDesk White-Label Branding Settings

## Configurable Elements

### Logo
```typescript
interface LogoConfig {
  url: string;           // HTTPS URL to logo image
  darkModeUrl?: string;  // Optional dark mode variant
  width?: number;        // Default: auto
  height?: number;       // Default: 40px
  favicon?: string;      // .ico or .png
}
```

### Colors
```typescript
interface ColorConfig {
  primary: string;       // Main brand color
  primaryHover: string;  // Hover state
  secondary: string;     // Accent color
  background: string;    // App background
  surface: string;       // Card/panel background
  text: string;          // Primary text
  textSecondary: string; // Secondary text
  success: string;       // Success states
  warning: string;       // Warning states
  error: string;         // Error states
}

### Typography
```typescript
interface TypographyConfig {
  headingFont: string;   // Google Fonts or custom URL
  bodyFont: string;
  codeFont?: string;
  baseSize?: number;     // Default: 16px
}

### Product Name
```typescript
interface ProductConfig {
  name: string;          // e.g., "Acme Remote"
  tagline?: string;      // e.g., "Secure remote access"
  supportEmail: string;
  supportUrl?: string;
  docsUrl?: string;
}
```

## Validation Rules
- Logo: PNG/SVG, max 500KB, transparent background preferred
- Colors: Valid hex codes, WCAG AA contrast required
- Fonts: Must support Latin, Cyrillic, Arabic character sets
- Name: 2-30 characters, no special characters

## API
```
GET  /v1/branding           - Get current branding
PUT  /v1/branding           - Update branding
POST /v1/branding/preview   - Preview changes
POST /v1/branding/reset     - Reset to defaults
```
