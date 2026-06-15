/**
 * Focus Management Helpers
 */

/** Focusable selector */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(", ");

/** Get all focusable elements within container */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

/** Trap focus within container */
export function trapFocus(container: HTMLElement): () => void {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];
  
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };
  
  container.addEventListener("keydown", handler);
  first?.focus();
  
  return () => container.removeEventListener("keydown", handler);
}

/** Restore focus to previously focused element */
export function saveFocus(): () => void {
  const previous = document.activeElement as HTMLElement | null;
  return () => previous?.focus();
}

/** Focus first invalid input in form */
export function focusFirstInvalid(form: HTMLFormElement): void {
  const invalid = form.querySelector(":invalid") as HTMLElement | null;
  invalid?.focus();
}

/** Skip to main content link */
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(targetId)?.focus();
      }}
    >
      Skip to main content
    </a>
  );
}
