// src/lib/utils/country.ts
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';
import type { CountryData, CountryUtils } from '$lib/utils/country-types.js';
import { getDefaultCountryData, defaultStandardizeCountry } from '$lib/utils/country-default.js';

let i18nCountries: typeof import('i18n-iso-countries') | undefined;
let svelteI18n: typeof import('svelte-i18n') | undefined;

function initI18n() {
   Promise.all([
       import('i18n-iso-countries'),
       import('svelte-i18n')
   ]).then(([countries, i18n]) => {
       i18nCountries = countries.default;
       svelteI18n = i18n;
   }).catch(() => {
       console.warn('Running in simple mode - only English supported');
   });
}

initI18n();

export const countryUtils: CountryUtils = {
   // Rest of the implementation stays the same
   getCountryData(language = 'en'): CountryData[] {
       if (!i18nCountries) return getDefaultCountryData();
       return Object.entries(i18nCountries.getNames(language)).map(([code, name]) => ({
           name,
           code,
       }));
   },

   standardizeCountry(input: string, language = 'en'): string | null {
       if (!i18nCountries) return defaultStandardizeCountry(input);
       const sanitizedInput = input.trim();
       const countryCodeByName = i18nCountries.getAlpha2Code(sanitizedInput, language);
       if (countryCodeByName) return countryCodeByName;
       if (i18nCountries.isValid(sanitizedInput.toUpperCase())) {
           return sanitizedInput.toUpperCase();
       }
       return null;
   },

   getLocale(): string {
       if (!svelteI18n) return 'en';
       return get(locale) || 'en';
   }
};