# i18n QA Checklist

## General
- [ ] All user-facing strings are externalized
- [ ] No hardcoded English in UI
- [ ] No concatenation of translated strings
- [ ] ICU placeholders preserved in translations
- [ ] No missing translations for active locales

## Layout
- [ ] UI accommodates longer translations (German, Finnish)
- [ ] RTL layout works correctly (Arabic, Hebrew)
- [ ] Text truncation handled gracefully
- [ ] No text overflow in buttons/cards
- [ ] Font supports all character sets

## Functionality
- [ ] Date formatting follows locale conventions
- [ ] Number formatting uses locale separators
- [ ] Currency formatting correct
- [ ] Sorting uses locale-aware comparison
- [ ] Search works with accented characters
- [ ] Input validation accepts locale-specific formats

## RTL Specific
- [ ] Layout direction is RTL for Arabic/Hebrew
- [ ] Icons with directional meaning are mirrored
- [ ] Timeline/progress flows right-to-left
- [ ] Text alignment is right-aligned
- [ ] Scroll direction is correct

## Specific Locales
- [ ] English (en): Source strings correct
- [ ] Urdu (ur-PK): Roman script used
- [ ] Arabic (ar): RTL, proper verb forms
- [ ] Spanish (es): Formal vs informal correct

## Technical
- [ ] locale files are valid JSON
- [ ] No duplicate keys
- [ ] All referenced keys exist
- [ ] Placeholder variables match source
- [ ] File encoding is UTF-8
- [ ] BOM not present
