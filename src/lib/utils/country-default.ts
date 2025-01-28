// src/lib/utils/country-default.ts
import type { CountryData } from '$lib/utils/country-types.js';

const DEFAULT_COUNTRIES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  FR: "France"
};

export function getDefaultCountryData(): CountryData[] {
  return Object.entries(DEFAULT_COUNTRIES).map(([code, name]) => ({ name, code }));
}

export function defaultStandardizeCountry(input: string): string | null {
  const uppercaseInput = input.trim().toUpperCase();
  if (DEFAULT_COUNTRIES[uppercaseInput]) return uppercaseInput;
  const entry = Object.entries(DEFAULT_COUNTRIES).find(
    ([_, name]) => name.toUpperCase() === uppercaseInput
  );
  return entry ? entry[0] : null;
}