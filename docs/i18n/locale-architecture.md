# RemoteDesk Locale Architecture

## Supported Locales
| Locale | Language | Status | Coverage |
|--------|----------|--------|----------|
| en | English | Complete | 100% |
| ur-PK | Urdu (Roman) | Active | 90% |
| ar | Arabic | In Progress | 60% |
| es | Spanish | Skeleton | 20% |
| fr | French | Planned | 0% |
| de | German | Planned | 0% |

## Architecture
```
apps/web/src/i18n/
├── index.ts          # i18n config
├── types.ts          # TypeScript types
└── messages/
    ├── en.json       # English source
    ├── ur-PK.json    # Roman Urdu
    ├── ar.json       # Arabic
    └── es.json       # Spanish
```

## Message Format (ICU)
```json
{
  "session.connecting": "Connecting to {deskId}...",
  "session.connected": "Connected! Session started at {time}.",
  "user.welcome": "Welcome, {name}! You have {count, plural, one {# session} other {# sessions}} active.",
  "error.required": "{field} is required"
}
```

## RTL Support
```typescript
const RTL_LOCALES = ["ar", "he", "fa"];

function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}

// Apply direction
document.dir = isRTL(locale) ? "rtl" : "ltr";
```

## Dynamic Loading
```typescript
async function loadMessages(locale: string) {
  const messages = await import(`./messages/${locale}.json`);
  return messages.default;
}
```

## Locale Detection
1. User preference (stored in localStorage)
2. URL parameter (?lang=ur-PK)
3. Browser Accept-Language header
4. Default (en)

## Date/Time Formatting
```typescript
const formatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "medium",
  timeStyle: "short",
});

formatter.format(new Date()); // locale-specific
```

## Number Formatting
```typescript
const formatter = new Intl.NumberFormat(locale, {
  style: "decimal",
});

formatter.format(1234567.89); // 1,234,567.89 or ۱۲۳۴۵۶۷٫۸۹
```
