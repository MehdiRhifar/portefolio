import {translations, type Translations} from './translations';

export function getLocaleFromUrl(url: URL): string {
    const [, locale] = url.pathname.split('/');
    if (locale === 'fr' || locale === 'en') {
        return locale;
    }
    return 'fr'; // default locale
}

export function useTranslations(locale: string): Translations {
    return translations[locale] || translations.fr;
}

export function getAlternateLinks(currentPath: string, locale: string) {
    // Remove locale prefix from current path
    const pathWithoutLocale = currentPath.replace(/^\/(fr|en)/, '') || '/';

    const alternates = {
        fr: `/fr${pathWithoutLocale}`,
        en: `/en${pathWithoutLocale}`,
    };

    return {
        current: alternates[locale as 'fr' | 'en'] || alternates.fr,
        alternates,
    };
}
