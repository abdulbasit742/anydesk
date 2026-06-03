// src/lib/scheduler.js
// Handles scheduling prompts/workflows and triggers them based on system time

import { sendFleetPrompt } from './fleetPromptEngine';

const SCHEDULE_STORAGE_KEY = 'agentflow_scheduled_jobs';

/** Load jobs list from storage */
export function getScheduledJobs() {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save jobs list to storage */
function saveScheduledJobs(jobs) {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to save scheduled jobs:', err);
  }
}

/** Create and add a new scheduled job */
export function scheduleJob({ prompt, targetIds, scheduledAt }) {
  const jobs = getScheduledJobs();
  
  const newJob = {
    id: 'job_' + Math.random().toString(36).slice(2, 10),
    prompt: prompt.trim(),
    targetIds: targetIds || [],
    scheduledAt: new Date(scheduledAt).toISOString(),
    status: 'pending', // 'pending' | 'completed' | 'failed'
    createdAt: new Date().toISOString(),
    results: null
  };
  
  jobs.push(newJob);
  saveScheduledJobs(jobs);
  return newJob;
}

/** Cancel and delete a pending job */
export function cancelJob(id) {
  const jobs = getScheduledJobs();
  const next = jobs.filter(j => j.id !== id);
  saveScheduledJobs(next);
  return true;
}

/**
 * Initializes the background scheduler loop.
 * Sweeps for pending jobs and fires them if they are due.
 * 
 * @param {function} onJobTriggered - Optional callback notifying when a job starts
 */
let schedulerInterval = null;

export function startScheduler(onJobTriggered) {
  if (schedulerInterval) return; // already running

  schedulerInterval = setInterval(async () => {
    const jobs = getScheduledJobs();
    const now = new Date();
    let updated = false;

    for (const job of jobs) {
      if (job.status === 'pending' && new Date(job.scheduledAt) <= now) {
        job.status = 'running';
        saveScheduledJobs(jobs); // write intermediate state

        if (onJobTriggered) {
          onJobTriggered(job);
        }

        try {
          // Trigger the fleet dispatch
          const result = await sendFleetPrompt(job.prompt, job.targetIds);
          
          job.status = result.success ? 'completed' : 'failed';
          job.results = {
            successCount: result.successCount || 0,
            failureCount: result.failureCount || 0,
            total: result.total || 0,
            logs: result.results || []
          };
        } catch (err) {
          job.status = 'failed';
          job.results = { error: err.message || 'Unknown scheduler error' };
        }
        updated = true;
      }
    }

    if (updated) {
      saveScheduledJobs(jobs);
    }
  }, 3000); // Check every 3 seconds
}

/** Stop the background scheduler */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
