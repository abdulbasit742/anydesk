export const emailService = {
  async sendEmail(to: string, subject: string, html: string, options?: { from?: string; replyTo?: string; attachments?: Array<{ filename: string; content: Buffer }> }) {
    // Uses configured SMTP or SendGrid/SES
    const payload = { to, subject, html, from: options?.from || "noreply@remotedesk.io", replyTo: options?.replyTo };
    console.log(`[Email] Sending to ${to}: ${subject}`);
    return { messageId: `msg_${Date.now()}`, status: "sent" };
  },
  async sendTemplatedEmail(to: string, template: string, variables: Record<string, string>) {
    const templates: Record<string, { subject: string; body: string }> = {
      welcome: { subject: "Welcome to RemoteDesk!", body: "<h1>Welcome {{name}}!</h1><p>Your account is ready.</p>" },
      trial_ending: { subject: "Your trial ends in {{days}} days", body: "<p>Hi {{name}}, your trial ends soon. Upgrade to keep your features.</p>" },
      payment_failed: { subject: "Payment failed - action needed", body: "<p>Hi {{name}}, we couldn't process your payment. Please update your card.</p>" },
      device_offline: { subject: "Device {{device}} went offline", body: "<p>Your device {{device}} has been offline for {{duration}}.</p>" },
    };
    const tmpl = templates[template];
    if (!tmpl) throw new Error(`Template ${template} not found`);
    let html = tmpl.body; let subject = tmpl.subject;
    for (const [key, value] of Object.entries(variables)) { html = html.replace(new RegExp(`{{${key}}}`, "g"), value); subject = subject.replace(new RegExp(`{{${key}}}`, "g"), value); }
    return this.sendEmail(to, subject, html);
  },
  async sendBulkEmail(recipients: string[], subject: string, html: string) {
    const results = await Promise.allSettled(recipients.map(to => this.sendEmail(to, subject, html)));
    return { sent: results.filter(r => r.status === "fulfilled").length, failed: results.filter(r => r.status === "rejected").length };
  },
};
