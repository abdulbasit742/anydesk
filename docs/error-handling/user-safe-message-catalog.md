# RemoteDesk User-Safe Message Catalog

## Principle: Never expose internal details to users

### Error Mapping
| Error Code | Internal Detail | User-Safe Message | Action |
|------------|----------------|-------------------|--------|
| RD_A001 | SQL constraint violation | "Something went wrong. Please try again." | Retry |
| RD_X001 | NullReferenceException in SessionService | "We're having trouble. Our team has been notified." | Support |
| RD_X002 | Redis connection timeout | "Service temporarily unavailable. Please try again in a moment." | Retry |
| RD_N004 | TLS 1.0 rejected | "Your connection is not secure. Please update your browser." | Update |

### Categories

#### Can Retry
- Network errors
- Rate limits
- Temporary unavailability
- Lock conflicts

#### Need Action
- Invalid input
- Authentication required
- Permission denied
- Feature unavailable

#### Contact Support
- Internal errors
- Data inconsistency
- Unknown errors
- Persistent failures

### Localization
User-safe messages must be localized:
```typescript
const userMessages: Record<string, LocalizedMessage> = {
  retry: {
    en: "Something went wrong. Please try again.",
    ur: "Kuch ghalat ho gaya. Dobara koshish karein.",
    ar: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    es: "Algo salió mal. Por favor, inténtalo de nuevo.",
  },
  support: {
    en: "We're having trouble. Please contact support.",
    ur: "Mushkil aa rahi hai. Support se rabta karein.",
    ar: "نواجه مشكلة. يرجى الاتصال بالدعم.",
    es: "Tenemos problemas. Por favor, contacta con soporte.",
  },
};
```
