interface QueueJob { id: string; type: string; payload: any; priority: number; attempts: number; maxAttempts: number; createdAt: Date; processAfter?: Date; }
const queues: Map<string, QueueJob[]> = new Map();
export const queueService = {
  async enqueue(queueName: string, type: string, payload: any, options?: { priority?: number; delay?: number; maxAttempts?: number }) {
    const job: QueueJob = { id: `job_${Date.now()}_${Math.random().toString(36).slice(2)}`, type, payload, priority: options?.priority || 0, attempts: 0, maxAttempts: options?.maxAttempts || 3, createdAt: new Date(), processAfter: options?.delay ? new Date(Date.now() + options.delay * 1000) : undefined };
    const queue = queues.get(queueName) || [];
    queue.push(job);
    queue.sort((a, b) => b.priority - a.priority);
    queues.set(queueName, queue);
    return job;
  },
  async dequeue(queueName: string): Promise<QueueJob | null> {
    const queue = queues.get(queueName) || [];
    const now = new Date();
    const idx = queue.findIndex(j => !j.processAfter || j.processAfter <= now);
    if (idx === -1) return null;
    return queue.splice(idx, 1)[0];
  },
  async getQueueSize(queueName: string): Promise<number> { return (queues.get(queueName) || []).length; },
  async getQueues(): Promise<Array<{ name: string; size: number }>> { return Array.from(queues.entries()).map(([name, jobs]) => ({ name, size: jobs.length })); },
  async purgeQueue(queueName: string) { queues.delete(queueName); },
};
