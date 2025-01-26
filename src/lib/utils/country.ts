// src/lib/utils/country.ts
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';
import type { CountryData, CountryUtils } from '$lib/utils/country-types.js';
import { getDefaultCountryData, defaultStandardizeCountry } from '$lib/utils/country-default.js';

let i18nCountries: typeof import('i18n-iso-countries') | undefined;
let svelteI18n: typeof import('svelte-i18n') | undefined;

try {
    i18nCountries = await import('i18n-iso-countries');
    svelteI18n = await import('svelte-i18n');
} catch {
    console.warn('Running in simple mode - only English supported');
}

export const countryUtils: CountryUtils = {
    getCountryData(language = 'en'): CountryData[] {
    if (!i18nCountries) return getDefaultCountryData();
        return Object.entries(i18nCountries.getNames(language)).map(([code, name]) => ({
            name,
            code,
        }));
    },

    standardizeCountry(input: string, language = 'en'): string | null {
        if (!i18nCountries) {
            return defaultStandardizeCountry(input);
        }
        const sanitizedInput = input.trim();
        const countryCodeByName = i18nCountries.getAlpha2Code(sanitizedInput, language);
        if (countryCodeByName) {
            return countryCodeByName;
        }
        if (i18nCountries.isValid(sanitizedInput.toUpperCase())) {
            return sanitizedInput.toUpperCase();
        }
        return null;
    },

    getLocale(): string {
        if (!svelteI18n) {
            return 'en';
        }
        return get(locale) || 'en';
    }
};