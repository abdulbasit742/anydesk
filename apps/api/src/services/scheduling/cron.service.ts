export interface CronJob { id: string; name: string; schedule: string; handler: () => Promise<void>; enabled: boolean; lastRun?: Date; nextRun?: Date; }
const jobs: Map<string, CronJob> = new Map();
export const cronService = {
  registerJob(job: CronJob) { jobs.set(job.id, job); console.log(`[Cron] Registered job: ${job.name} (${job.schedule})`); },
  unregisterJob(jobId: string) { jobs.delete(jobId); },
  getJobs(): CronJob[] { return Array.from(jobs.values()); },
  async executeJob(jobId: string) {
    const job = jobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);
    job.lastRun = new Date();
    await job.handler();
  },
  parseSchedule(cron: string): { minute: number; hour: number; dayOfMonth: number; month: number; dayOfWeek: number } {
    const parts = cron.split(" ");
    return { minute: parseInt(parts[0]) || 0, hour: parseInt(parts[1]) || 0, dayOfMonth: parseInt(parts[2]) || 1, month: parseInt(parts[3]) || 1, dayOfWeek: parseInt(parts[4]) || 0 };
  },
};
