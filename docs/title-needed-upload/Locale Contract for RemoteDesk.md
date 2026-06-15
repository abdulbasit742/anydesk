# Locale Contract for RemoteDesk

This document defines the contract for all localization efforts within the RemoteDesk project. It specifies the structure, naming conventions, and expected content for locale files, ensuring consistency and ease of integration across all applications (Web, Desktop, API messages).

## 1. File Structure and Naming

All locale files will reside in `packages/shared/locales/` and follow a specific naming convention.

*   **Directory:** `packages/shared/locales/`
*   **Filename:** `[language_code].json` (e.g., `en.json`, `ur-PK.json`, `es.json`, `ar.json`)
    *   `language_code` should follow [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) for language and optionally [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) for region (e.g., `en` for English, `en-US` for US English).

## 2. JSON Format

Locale files will be standard JSON objects. Keys should be descriptive, use `camelCase`, and represent the context of the string. Values will be the translated strings.

```json
// packages/shared/locales/en.json
{
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "close": "Close",
    "settings": "Settings",
    "dashboard": "Dashboard",
    "connect": "Connect",
    "disconnect": "Disconnect",
    "viewOnly": "View Only",
    "fullControl": "Full Control"
  },
  "auth": {
    "login": {
      "title": "Login to RemoteDesk",
      "emailLabel": "Email Address",
      "passwordLabel": "Password",
      "forgotPassword": "Forgot Password?",
      "loginButton": "Login",
      "signupPrompt": "Don't have an account? Sign Up"
    },
    "errors": {
      "invalidCredentials": "Incorrect email or password.",
      "accountLocked": "Your account is locked. Please contact support."
    }
  },
  "session": {
    "remoteId": "Remote ID",
    "enterRemoteId": "Enter Remote ID",
    "connectionStatus": {
      "connecting": "Connecting...",
      "connected": "Connected",
      "disconnected": "Disconnected",
      "failed": "Connection Failed"
    },
    "toolbar": {
      "fileTransfer": "File Transfer",
      "clipboard": "Clipboard",
      "chat": "Chat",
      "remoteInput": "Remote Input",
      "screenSelection": "Screen Selection"
    }
  },
  "notifications": {
    "fileTransferComplete": "File transfer complete: {fileName}",
    "fileTransferFailed": "File transfer failed: {fileName}",
    "clipboardSyncEnabled": "Clipboard synchronization enabled.",
    "clipboardSyncDisabled": "Clipboard synchronization disabled."
  }
}
```

## 3. Key Naming Conventions

*   **Hierarchical Structure:** Group related strings under logical namespaces (e.g., `auth.login.title`).
*   **`camelCase`:** All keys should be in `camelCase`.
*   **Descriptive:** Keys should clearly indicate the purpose of the string.
*   **No Duplication:** Avoid duplicating keys. If a string is used in multiple places, try to find a common, generic key under `common` or a relevant shared namespace.

## 4. Placeholders and Interpolation

For dynamic content, use placeholders enclosed in curly braces `{}`. The translation system will replace these placeholders with actual values at runtime.

```json
{
  "welcomeMessage": "Welcome, {userName}!",
  "itemsCount": "You have {count} items in your cart."
}
```

## 5. Pluralization

For languages that require different forms for pluralization, we will use a specific convention (e.g., `i18next` pluralization rules) or provide separate keys for singular and plural forms if the translation library does not handle it automatically.

```json
{
  "item": "item",
  "items": "items",
  "items_plural": "items"
}
```

Or using `i18next` style:

```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

## 6. Context and Comments

Translators often need context to provide accurate translations. While JSON doesn't natively support comments, we can use a separate documentation file or a specific key prefix for context.

```json
{
  "auth": {
    "login": {
      "title": "Login to RemoteDesk",
      "title_context": "This is the title displayed on the login page."
    }
  }
}
```

## 7. Adding New Locales

To add a new locale:

1.  Create a new JSON file in `packages/shared/locales/` named `[language_code].json`.
2.  Copy the `en.json` content as a starting point.
3.  Translate all string values into the target language.
4.  Ensure all keys are present and correctly mapped.
5.  Update the `locale-switcher-docs.md` to include the new locale.

## 8. Review and Quality Assurance

*   **Linguistic Review:** All translations must be reviewed by a native speaker to ensure accuracy, naturalness, and cultural appropriateness.
*   **Technical Review:** Ensure that placeholders are correctly used and that the JSON structure remains valid.
*   **UI Testing:** Test the application with the new locale to verify that all strings are displayed correctly and fit within the UI elements.

By adhering to this locale contract, we aim to build a robust and scalable localization system for RemoteDesk.
