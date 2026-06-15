# Accessibility Audit Checklist

## Perceivable
- [ ] All images have alt text
- [ ] Decorative images have alt=""
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] Color is not sole means of conveying info
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Large text contrast meets WCAG AA (3:1)
- [ ] UI component contrast meets 3:1
- [ ] Text can be resized to 200%
- [ ] Content reflows at 400% zoom

## Operable
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Focus order is logical
- [ ] Focus indicators visible
- [ ] Skip links present
- [ ] No auto-play media
- [ ] Users can pause/stop/hide moving content
- [ ] No flashing content (> 3 per second)
- [ ] Page titles descriptive
- [ ] Links have descriptive text

## Understandable
- [ ] Page language specified
- [ ] Language changes marked
- [ ] Form labels present
- [ ] Form errors identified and described
- [ ] Suggestions for error correction
- [ ] Consistent navigation
- [ ] Consistent component behavior

## Robust
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Name, role, value for components
- [ ] Works with assistive technologies
- [ ] Responsive design

## Testing
- [ ] Automated: axe-core passes
- [ ] Keyboard-only navigation test
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Color blindness simulation
- [ ] Zoom 200% test
- [ ] Reduced motion test
