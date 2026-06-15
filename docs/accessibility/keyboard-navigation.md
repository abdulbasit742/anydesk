# Keyboard Navigation Guide

## Global Shortcuts
| Key | Action |
|-----|--------|
| Tab | Move focus forward |
| Shift+Tab | Move focus backward |
| Enter/Space | Activate focused element |
| Escape | Close modal/dropdown/menu |
| Ctrl+K | Open command palette |
| ? | Show keyboard shortcuts help |

## Session Shortcuts
| Key | Action |
|-----|--------|
| Ctrl+Alt+F | Toggle full screen |
| Ctrl+Alt+C | Connect/disconnect |
| Ctrl+Alt+M | Mute/unmute audio |
| Ctrl+Alt+S | Take screenshot |
| Ctrl+Alt+R | Toggle recording |

## Focus Management
- Focus trap in modals
- Return focus on modal close
- Skip links for main content
- Focus indicators visible (2px outline)

## Focus Order
```
Header -> Navigation -> Main Content -> Footer
Within components: Left to right, top to bottom
```

## Implementation
```tsx
// Focus trap for modals
function FocusTrap({ children, isActive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;
    
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    
    first?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);
  
  return <div ref={containerRef}>{children}</div>;
}
```
