// src/lib/forms/utils/country.ts
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json' assert { type: 'json' };
import fr from 'i18n-iso-countries/langs/fr.json' assert { type: 'json' };

export function getLocale(): string {
    return get(locale) || 'en';
}

// Register supported languages
countries.registerLocale(en);
countries.registerLocale(fr);

export const supportedLanguages = ['en', 'fr']; // Add more languages as needed

// Get all valid country names and codes for a language
export function getCountryData(language: string): { name: string; code: string }[] {
    return Object.entries(countries.getNames(language)).map(([code, name]) => ({
        name,
        code,
    }));
}

// Validate and standardize user input
export function standardizeCountry(input: string, language: string): string | null {
    const sanitizedInput = input.trim();

    // Try to resolve the input as a country name
    const countryCodeByName = countries.getAlpha2Code(sanitizedInput, language);
    if (countryCodeByName) return countryCodeByName;

    // Try to resolve the input as an ISO Alpha-2 code
    if (countries.isValid(sanitizedInput.toUpperCase())) {
        return sanitizedInput.toUpperCase();
    }

    return null; // Invalid input
}

// Get a localized country name for display
export function getLocalizedCountryName(code: string, language: string): string | null {
    return countries.getName(code, language) || null;
}
