export const weeklyDigestJob = { name: "weekly-digest", schedule: "0 9 * * 1", async handler() { console.log("[Job] Sending weekly digest..."); /* Send weekly summary email to all admins */ } };
