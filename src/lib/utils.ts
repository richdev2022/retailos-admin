import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + '…';
}

export function initials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function downloadFile(filename: string, content: string, type = 'text/csv'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | Date | null | undefined, pattern = 'dd MMM yyyy'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, pattern);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'dd MMM yyyy, HH:mm');
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatMoney(value: unknown, currency = 'NGN'): string {
  const minor = typeof value === 'object' && value !== null && 'minor' in value
    ? Number((value as { minor: string }).minor)
    : typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : 0;
  const major = minor / 100;
  const symbols: Record<string, string> = { NGN: '\u20A6', USD: '$', GHS: '\u20B5', KES: 'KSh', ZAR: 'R' };
  const symbol = symbols[currency] ?? currency + ' ';
  return symbol + new Intl.NumberFormat('en-NG', { minimumFractionDigits: major % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(Math.abs(major));
}

export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return '';
  const cols = columns ?? Object.keys(rows[0]!);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.join(',');
  const body = rows.map((r) => cols.map((c) => escape(r[c])).join(',')).join('\r\n');
  return `${header}\r\n${body}`;
}
