// Loading / empty / error placeholders.
//
// With mock data everything is instant and always populated, so these paths
// are easy to leave unbuilt and painful to retrofit. They live here as shared
// components so every list and panel reports the same way.

import { icon } from './icons.js';

/**
 * Skeleton rows sized to the table they replace, so the layout does not jump
 * when real content arrives.
 */
export const loadingRows = (rows = 5, columns = 9) => `
  <tbody class="skeleton" aria-hidden="true">
    ${Array.from({ length: rows }, () => `
      <tr>${Array.from({ length: columns }, () => '<td><span class="skeleton-bar"></span></td>').join('')}</tr>
    `).join('')}
  </tbody>`;

export const emptyState = ({ iconName = 'inbox', title, message, actionLabel, actionId } = {}) => `
  <div class="state-panel">
    <span class="state-panel__icon">${icon(iconName, 26)}</span>
    <h3>${title}</h3>
    <p>${message}</p>
    ${actionLabel ? `<button class="btn btn--neutral" data-state-action="${actionId}">${actionLabel}</button>` : ''}
  </div>`;

export const errorState = ({ message = 'Something went wrong loading this data.', actionId = 'retry' } = {}) => `
  <div class="state-panel state-panel--error">
    <span class="state-panel__icon">${icon('circle-alert', 26)}</span>
    <h3>Could not load</h3>
    <p>${message}</p>
    <button class="btn btn--neutral" data-state-action="${actionId}">Try again</button>
  </div>`;
