export interface TaxRegionInput {
  countryCode: string;
  stateOrProvince?: string;
}

export function normalizeTaxRegion(input: TaxRegionInput): string {
  return [input.countryCode.trim().toUpperCase(), input.stateOrProvince?.trim().toUpperCase()].filter(Boolean).join("-");
}
