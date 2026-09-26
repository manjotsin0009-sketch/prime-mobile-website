import { useMemo } from 'react';

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function generateComplaintId() {
  return `PM-${Math.random().toString().slice(2, 8)}`;
}

export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function downloadLink() {
  return 'https://www.mediafire.com/file/gfq0qlc6e0zayn1/mobile-game-debug.apk/file';
}

export function discordLink() {
  return 'https://discord.gg/3j2BpN6pr';
}

export function makeSafeUrl(url: string) {
  return url.startsWith('http') ? url : `https://${url}`;
}

export function randomPillColor() {
  const colors = ['blue', 'silver', 'cyan', 'indigo'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function extractStatusTone(status: string) {
  if (status === 'Resolved') return 'resolved';
  if (status === 'Rejected') return 'rejected';
  if (status === 'Under Review') return 'review';
  return 'pending';
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const currency = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatCompactNumber(value: number) {
  return currency.format(value);
}
