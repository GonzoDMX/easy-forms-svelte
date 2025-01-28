// src/lib/utils/country-default.ts
import type { CountryData } from '$lib/utils/country-types.js';
import { countryMaps } from '$lib/utils/country-list.js';

export function getDefaultCountryData(): CountryData[] {
    return countryMaps.getAllCountries();
}

export function defaultStandardizeCountry(input: string): string | null {
    const sanitizedInput = input.trim();
    
    // Try exact match with country code
    const byCode = countryMaps.getByCode(sanitizedInput.toUpperCase());
    if (byCode) return byCode.code;
    
    // Try exact match with country name
    const byName = countryMaps.getByName(sanitizedInput);
    if (byName) return byName.code;
    
    return null;
}