# Contrast and Visual Accessibility

## WCAG Requirements
| Level | Normal Text | Large Text | UI Components |
|-------|:-----------:|:----------:|:-------------:|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | 3:1 |

## Color Palette
| Token | Hex | On White | On Dark |
|-------|-----|:--------:|:-------:|
| Primary | #0A2540 | 15.8:1 (AAA) | 1.1:1 |
| Primary Light | #4A6B8A | 5.9:1 (AA) | 2.9:1 |
| Accent | #00D4AA | 2.5:1 | 8.5:1 (AAA) |
| Text | #1A1A2E | 15.2:1 (AAA) | 1.1:1 |
| Text Secondary | #6B7280 | 5.4:1 (AA) | 3.2:1 |
| Error | #DC2626 | 5.2:1 (AA) | 3.3:1 |
| Warning | #D97706 | 3.2:1 | 5.4:1 (AA) |
| Success | #16A34A | 4.8:1 (AA) | 3.6:1 |

## Testing Tools
- axe DevTools
- WAVE
- Lighthouse
- Color Contrast Analyzer

## Don't Rely on Color Alone
```tsx
// Bad: Only color indicates status
<div style={{ color: status === "error" ? "red" : "green" }}>
  {status}
</div>

// Good: Color + icon + text
<div>
  {status === "error" ? <ErrorIcon /> : <SuccessIcon />}
  <span className={status === "error" ? "text-red" : "text-green"}>
    {status === "error" ? "Error: " : "Success: "}
    {message}
  </span>
</div>
```

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
