import { createInstance, type ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

export type Locale = 'en' | 'zh';
export type TranslationKey = ParseKeys<'ui'>;

declare module 'i18next' {
  interface ResourceNamespaceMap {
    ui: typeof en;
  }
}

function createUiInstance(locale: Locale) {
  const instance = createInstance();
  // Resources are bundled, so SSR and hydration can translate synchronously.
  void instance.init({
    lng: locale,
    supportedLngs: ['en', 'zh'],
    fallbackLng: 'en',
    defaultNS: 'ui',
    ns: ['ui'],
    resources: { en: { ui: en }, zh: { ui: zh } },
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  return instance;
}

// Independent instances prevent concurrent static builds from changing each
// other's language. Starlight supplies the locale through each MDX island prop.
const instances = { en: createUiInstance('en'), zh: createUiInstance('zh') };

export function useUiTranslation(locale: Locale) {
  return useTranslation('ui', { i18n: instances[locale], useSuspense: false });
}
