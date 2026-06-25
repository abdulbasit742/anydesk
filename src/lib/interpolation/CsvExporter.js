// CsvExporter.js — Exports completed prompt configurations to structured CSV
import { sanitizeForExport } from '../data/store/ExportSanitizer.js';

export function exportToCSV(rows, headers, options = {}) {
  const { sanitize = true, delimiter = ',', includeTimestamp = true } = options;

  const processedRows = sanitize ? rows.map(r => JSON.parse(sanitizeForExport(r))) : rows;

  const allHeaders = includeTimestamp ? [...headers, 'exportedAt'] : headers;
  const csvLines = [
    allHeaders.join(delimiter),
    ...processedRows.map(row => {
      const values = allHeaders.map(h => {
        if (h === 'exportedAt') return new Date().toISOString();
        const val = row[h];
        if (val === undefined || val === null) return '';
        const str = String(val);
        return str.includes(delimiter) || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      });
      return values.join(delimiter);
    }),
  ];

  return csvLines.join('\n');
}

export function downloadCSV(csvContent, filename = 'export.csv') {
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function parseCSV(csvText, delimiter = ',') {
  const lines = csvText.split('\n').filter(l => l.trim());
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
  });
}
