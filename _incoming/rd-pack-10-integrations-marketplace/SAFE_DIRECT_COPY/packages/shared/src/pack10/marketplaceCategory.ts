export type MarketplaceCategory = "communication" | "support" | "security" | "storage" | "automation" | "developer";

export function categoryLabel(category: MarketplaceCategory): string {
  return category.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}
