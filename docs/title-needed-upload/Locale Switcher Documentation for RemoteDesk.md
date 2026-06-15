# Locale Switcher Documentation for RemoteDesk

This document outlines the implementation and usage of the locale switcher within the RemoteDesk applications (Web and Desktop). The locale switcher allows users to change the application's language, providing a localized experience.

## 1. Overview

The RemoteDesk application supports multiple languages, with all translatable strings managed in JSON files located in `packages/shared/locales/`. The locale switcher provides a mechanism for users to select their preferred language, which then dynamically updates the application's UI.

## 2. Implementation Details

### 2.1. Locale Files

As defined in `locale-contract.md`, all language strings are stored in `packages/shared/locales/[language_code].json` files. These files are loaded by the application at runtime.

### 2.2. Context/State Management

For both Web (React) and Desktop (Electron/React) applications, the currently selected locale will be managed using a global context or state management solution (e.g., React Context, Redux, Zustand).

```typescript
// packages/shared/context/LocaleContext.ts (Conceptual Example)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
// Dynamically import other locales as needed or load them based on user preference

type Locale = typeof en; // Assuming 'en' is the base structure
type LanguageCode = 'en' | 'ur-PK' | 'es' | 'ar'; // Extend as more languages are added

interface LocaleContextType {
  locale: Locale;
  languageCode: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const [languageCode, setLanguageCode] = useState<LanguageCode>(() => {
    // Load initial language from localStorage or user settings
    return (localStorage.getItem('remotedesk_language') as LanguageCode) || 'en';
  });
  const [locale, setLocale] = useState<Locale>(en); // Default to English

  useEffect(() => {
    const loadLocale = async () => {
      let loadedLocale: Locale;
      switch (languageCode) {
        case 'ur-PK':
          loadedLocale = (await import('../locales/ur-PK.json')).default as Locale;
          break;
        case 'es':
          loadedLocale = (await import('../locales/es.json')).default as Locale;
          break;
        case 'ar':
          loadedLocale = (await import('../locales/ar.json')).default as Locale;
          break;
        case 'en':
        default:
          loadedLocale = en;
          break;
      }
      setLocale(loadedLocale);
      localStorage.setItem('remotedesk_language', languageCode);
    };
    loadLocale();
  }, [languageCode]);

  const setLanguage = (code: LanguageCode) => {
    setLanguageCode(code);
  };

  return (
    <LocaleContext.Provider value={{ locale, languageCode, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
```

### 2.3. Translation Function/Hook

A utility function or React hook will be provided to access translated strings from the loaded locale.

```typescript
// packages/shared/hooks/useTranslation.ts (Conceptual Example)

import { useLocale } from '../context/LocaleContext';

// A simple utility to get nested properties from a JSON object
const getNested = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const useTranslation = () => {
  const { locale } = useLocale();

  const t = (key: string, variables?: Record<string, string | number>) => {
    let translatedString = getNested(locale, key) || key; // Fallback to key if not found

    if (variables) {
      for (const [varKey, varValue] of Object.entries(variables)) {
        translatedString = translatedString.replace(new RegExp(`\\{\\s*${varKey}\\s*\\}`, 'g'), String(varValue));
      }
    }
    return translatedString;
  };

  return { t };
};
```

### 2.4. UI Component for Language Selection

A reusable UI component will allow users to select their preferred language from a dropdown or list.

```typescript
// apps/web/components/LanguageSwitcher.tsx (Conceptual Example)

import React from 'react';
import { useLocale } from '@remotedesk/shared/context/LocaleContext';

const LanguageSwitcher = () => {
  const { languageCode, setLanguage } = useLocale();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as any); // Cast to any for simplicity, proper type checking needed
  };

  return (
    <select value={languageCode} onChange={handleChange}>
      <option value="en">English</option>
      <option value="ur-PK">اردو (Roman Urdu)</option>
      <option value="es">Español</option>
      <option value="ar">العربية</option>
      {/* Add more languages as they are supported */}
    </select>
  );
};

export default LanguageSwitcher;
```

## 3. Usage in Applications

### 3.1. Web Application (`apps/web`)

Integrate the `LocaleProvider` at the root of the React application and use the `useTranslation` hook in components.

```typescript
// apps/web/pages/_app.tsx (Conceptual Example)

import type { AppProps } from 'next/app';
import { LocaleProvider } from '@remotedesk/shared/context/LocaleContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <Component {...pageProps} />
    </LocaleProvider>
  );
}

export default MyApp;
```

```typescript
// apps/web/pages/dashboard.tsx (Conceptual Example)

import { useTranslation } from '@remotedesk/shared/hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      <p>{t('welcomeMessage', { userName: 'John Doe' })}</p>
      <LanguageSwitcher />
      {/* ... other dashboard content */}
    </div>
  );
};

export default DashboardPage;
```

### 3.2. Desktop Application (`apps/desktop`)

The Electron main process can load the initial locale, and the renderer process (which is a web view) will follow a similar pattern to the web application.

```typescript
// apps/desktop/main.ts (Conceptual Example - Main Process)

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

// Function to load locale based on user preference or OS setting
const loadInitialLocale = () => {
  const userLanguage = app.getLocale(); // Get OS locale
  const savedLanguage = localStorage.getItem('remotedesk_language');
  const languageToLoad = savedLanguage || userLanguage.split('-')[0] || 'en';

  try {
    const localePath = path.join(__dirname, '..', '..', 'packages', 'shared', 'locales', `${languageToLoad}.json`);
    if (fs.existsSync(localePath)) {
      return JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    } else {
      return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'packages', 'shared', 'locales', 'en.json'), 'utf-8'));
    }
  } catch (error) {
    console.error('Failed to load locale:', error);
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'packages', 'shared', 'locales', 'en.json'), 'utf-8'));
  }
};

// In main process, send initial locale to renderer
ipcMain.handle('get-initial-locale', () => {
  return loadInitialLocale();
});

// ... rest of main process code
```

The renderer process (`dashboard.html` loading a React app) would then use the `LocaleProvider` and `useTranslation` hook similar to the web app.

## 4. Adding New Languages

To add a new language, follow the steps outlined in `locale-contract.md`:

1.  Create a new `[language_code].json` file in `packages/shared/locales/`.
2.  Translate all strings.
3.  Update the `LanguageCode` type in `LocaleContext.ts`.
4.  Add a new `<option>` to the `LanguageSwitcher` component.
5.  Ensure the new locale is handled in the `loadLocale` function within `LocaleContext.ts`.

## 5. Testing and Quality Assurance

*   **Unit Tests:** Test the `useTranslation` hook and `LocaleProvider` to ensure correct string retrieval and language switching.
*   **UI Tests:** Verify that all UI elements update correctly when the language is changed.
*   **Linguistic Review:** Have native speakers review the translated UI for accuracy and naturalness.
*   **Regression Testing:** Ensure that adding new languages does not break existing functionality or display issues in other locales.
