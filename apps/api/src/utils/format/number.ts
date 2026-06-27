export const formatNumber = (n: number): string => n.toLocaleString("en-US");
export const formatCurrency = (amount: number, currency: string = "USD"): string => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
export const formatPercentage = (value: number, decimals: number = 1): string => `${value.toFixed(decimals)}%`;
export const abbreviateNumber = (n: number): string => { if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`; return String(n); };
