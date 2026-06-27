export const getOptimizationRecommendations = (metrics: { cpu: number; ram: number; disk: number; uptime: number }): Array<{ category: string; priority: string; recommendation: string; impact: string }> => {
  const recs: Array<{ category: string; priority: string; recommendation: string; impact: string }> = [];
  if (metrics.cpu > 80) recs.push({ category: "CPU", priority: "high", recommendation: "Identify and optimize CPU-heavy processes", impact: "Reduce CPU usage by 20-30%" });
  if (metrics.ram > 85) recs.push({ category: "Memory", priority: "high", recommendation: "Increase swap or add RAM", impact: "Prevent OOM kills" });
  if (metrics.disk > 80) recs.push({ category: "Disk", priority: "medium", recommendation: "Clean up old files and logs", impact: "Free up disk space" });
  if (metrics.uptime > 30 * 86400) recs.push({ category: "System", priority: "low", recommendation: "Schedule a reboot", impact: "Clear memory leaks, apply kernel updates" });
  return recs;
};
