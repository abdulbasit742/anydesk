// export.js — data export service for various formats

export const exportToJSON = (data, filename = 'export', pretty = true) => {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  downloadBlob(content, `${filename}.json`, 'application/json');
};

export const exportToCSV = (rows, headers, filename = 'export') => {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines  = [headers.map(h => escape(h.label || h)).join(',')];
  rows.forEach(row => lines.push(headers.map(h => escape(row[h.key || h])).join(',')));
  downloadBlob(lines.join('\n'), `${filename}.csv`, 'text/csv');
};

export const exportToMarkdown = (data, filename = 'export') => {
  let md = `# Export — ${new Date().toLocaleString()}\n\n`;
  if (Array.isArray(data)) {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      md += `| ${keys.join(' | ')} |\n`;
      md += `| ${keys.map(() => '---').join(' | ')} |\n`;
      data.forEach(row => { md += `| ${keys.map(k => row[k] ?? '—').join(' | ')} |\n`; });
    }
  } else {
    md += '```json\n' + JSON.stringify(data, null, 2) + '\n```';
  }
  downloadBlob(md, `${filename}.md`, 'text/markdown');
};

export const downloadBlob = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportAccounts = (accounts) => {
  const rows = accounts.map(a => ({ name: a.name, platform: a.platform, status: a.status, email: a.email, broadcasts: a.broadcastCount || 0 }));
  exportToCSV(rows, ['name','platform','status','email','broadcasts'].map(k => ({ key: k, label: k })), 'accounts');
};

export const exportBroadcasts = (broadcasts) => {
  exportToJSON(broadcasts.map(b => ({ id: b.id, prompt: b.prompt, createdAt: b.createdAt, successCount: b.successCount, failureCount: b.failureCount })), 'broadcasts');
};

export const generateReport = (type, data) => {
  const ts = new Date().toLocaleString();
  let content = `# Bolt Studio Pro — ${type} Report\nGenerated: ${ts}\n\n`;
  if (type === 'accounts') {
    content += `## Accounts (${data.accounts.length})\n`;
    data.accounts.forEach(a => { content += `- **${a.name}** — ${a.platform} — ${a.status}\n`; });
  }
  downloadBlob(content, `report-${type}-${Date.now()}.md`, 'text/markdown');
};
