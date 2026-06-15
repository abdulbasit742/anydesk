# RTL Implementation Guide

## Supported RTL Locales
- Arabic (ar)
- Hebrew (he)
- Persian/Farsi (fa)
- Urdu (ur)

## Implementation

### CSS
```css
[dir='rtl'] .sidebar {
  right: 0;
  left: auto;
}

[dir='rtl'] .icon-arrow {
  transform: scaleX(-1);
}
```

### React
```tsx
const { direction } = useLocale();
return <div dir={direction}>...</div>;
```
