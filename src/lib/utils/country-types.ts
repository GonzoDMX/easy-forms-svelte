// src/lib/utils/country-types.ts
export interface CountryData {
    name: string;
    code: string;
  }
  
  export interface CountryUtils {
    getCountryData: (language?: string) => CountryData[];
    standardizeCountry: (input: string, language?: string) => string | null;
    getLocale: () => string;
  }