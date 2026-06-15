export type DataClassification = "public" | "internal" | "confidential" | "restricted";
export function maxClassification(values: readonly DataClassification[]): DataClassification {
  const rank: Record<DataClassification, number> = { public: 0, internal: 1, confidential: 2, restricted: 3 };
  return values.reduce((max, value) => rank[value] > rank[max] ? value : max, "public" as DataClassification);
}
