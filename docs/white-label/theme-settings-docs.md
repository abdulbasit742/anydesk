# RemoteDesk Theme Settings Documentation

## Available Themes

### Light Theme (Default)
```css
:root {
  --rd-bg: #FFFFFF;
  --rd-surface: #F8F9FA;
  --rd-primary: #0A2540;
  --rd-text: #1A1A2E;
  --rd-border: #E5E7EB;
}
```

### Dark Theme
```css
[data-theme="dark"] {
  --rd-bg: #0F0F1A;
  --rd-surface: #1A1A2E;
  --rd-primary: #00D4AA;
  --rd-text: #E5E7EB;
  --rd-border: #2D2D44;
}
```

### Custom Theme
Override CSS variables or provide full theme object:
```typescript
const customTheme = {
  colors: {
    primary: "#FF6B35",
    background: "#FDF8F5",
    surface: "#FFFFFF",
    text: "#2D2D2D",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  }
};
```

## Theme Application
- Web: CSS variables in :root
- Desktop: Injected into Electron window
- Mobile: ThemeProvider (React Native)

## Preview
Changes previewed in admin dashboard before applying.

## Overrides
Priority order (highest first):
1. User preference (if enabled)
2. Organization theme
3. System preference
4. Default theme
