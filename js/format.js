// Formatting + derived-state helpers shared by the customer list and detail
// views, so both always describe an account the same way.

import { TODAY } from './data.js';
import { icon } from './icons.js';

const MS_PER_DAY = 86_400_000;
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Whole calendar days from `now` until `date` (negative = in the past). */
export function daysUntil(date, now = TODAY) {
  return Math.round((startOfDay(date) - startOfDay(now)) / MS_PER_DAY);
}

/**
 * Derives an account's lifecycle state from its expiry date.
 * @returns {{key: string, label: string, tone: string, days: number, detail: string, icon: string}}
 */
export function customerStatus(customer, now = TODAY) {
  const days = daysUntil(customer.expiresAt, now);

  if (days < 0) {
    const ago = Math.abs(days);
    return {
      key: 'expired',
      label: 'Expired',
      tone: 'danger',
      days,
      detail: ago === 1 ? 'Expired yesterday' : `Expired ${ago} days ago`,
      icon: 'circle-alert',
    };
  }
  if (days === 0) {
    return { key: 'expiring', label: 'Expires today', tone: 'warning', days, detail: 'Expires today', icon: 'triangle-alert' };
  }
  if (days <= 7) {
    return {
      key: 'expiring',
      label: 'Expiring soon',
      tone: 'warning',
      days,
      detail: days === 1 ? 'Expires tomorrow' : `Expires in ${days} days`,
      icon: 'triangle-alert',
    };
  }
  return { key: 'active', label: 'Active', tone: 'success', days, detail: `${days} days remaining`, icon: 'circle-check' };
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

export const formatDateTime = (date) => (date ? DATE_FORMAT.format(date) : null);

export const formatCurrency = (amount) => `৳${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Relative "x minutes/hours/days ago", for last-seen style timestamps. */
export function timeAgo(date, now = TODAY) {
  if (!date) return null;
  const minutes = Math.round((now - date) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

/**
 * Renders a value that may be unset. Missing data is visually recessed so a
 * screen full of blanks doesn't compete with the fields that carry real data.
 */
export const orNotSet = (value) => (value === null || value === undefined || value === '' ? '<span class="not-set">Not set</span>' : value);

/** A value with a click-to-copy affordance. */
export const copyable = (value, srLabel = 'value') => `
  <span class="copy-field">
    <span class="copy-field__value">${value}</span>
    <button type="button" class="copy-btn" data-copy="${String(value).replace(/"/g, '&quot;')}" aria-label="Copy ${srLabel}" title="Copy ${srLabel}">
      ${icon('copy', 13)}
    </button>
  </span>`;

/** A secret rendered masked, with a reveal toggle plus copy. */
export const secretField = (value, srLabel = 'password') => `
  <span class="copy-field">
    <span class="copy-field__value secret" data-secret="${String(value).replace(/"/g, '&quot;')}">${'•'.repeat(10)}</span>
    <button type="button" class="copy-btn reveal-btn" aria-label="Show ${srLabel}" title="Show ${srLabel}">${icon('eye', 13)}</button>
    <button type="button" class="copy-btn" data-copy="${String(value).replace(/"/g, '&quot;')}" aria-label="Copy ${srLabel}" title="Copy ${srLabel}">${icon('copy', 13)}</button>
  </span>`;

/**
 * Wires copy buttons, secret reveal toggles, and transient "Copied" feedback
 * for a rendered subtree.
 */
export function bindFieldInteractions(root) {
  root.querySelectorAll('.copy-btn[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
      } catch {
        return; // Clipboard blocked (e.g. insecure context) — fail quietly.
      }
      button.classList.add('is-copied');
      setTimeout(() => button.classList.remove('is-copied'), 1200);
    });
  });

  root.querySelectorAll('.reveal-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const field = button.parentElement.querySelector('.secret');
      const revealed = field.classList.toggle('is-revealed');
      field.textContent = revealed ? field.dataset.secret : '•'.repeat(10);
      button.setAttribute('aria-label', revealed ? 'Hide password' : 'Show password');
    });
  });
}
