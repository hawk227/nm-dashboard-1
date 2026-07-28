// Customers list page.

import { icon, inlineMiniIcons } from './icons.js';
import { customers } from './data.js';
import {
  customerStatus, formatDateTime, formatCurrency, timeAgo,
  matchesFilter, customerFilters,
} from './format.js';
import { loadingRows, emptyState, errorState } from './states.js';

/** Stands in for the API call this page will eventually make. */
function fetchCustomers() {
  return new Promise((resolve) => setTimeout(() => resolve(customers), 180));
}

function renderToolbarButtons() {
  return `
    <button class="btn-outline">${icon('download', 15)} Export</button>
    <button class="btn-outline">${icon('file-text', 15)} DIS Report</button>
    <button class="btn-outline">${icon('arrow-left-right', 15)} Import Customers</button>`;
}

/**
 * One row. Related fields share a cell rather than each claiming a column:
 * the identity cell carries name + PPPoE + client ID, and the expiry cell
 * carries the date + how long is left. Every value stays on screen — only
 * the column count drops, which is what keeps the table inside the viewport.
 */
function renderCustomerRow(customer, index) {
  const status = customerStatus(customer);
  return `
    <tr>
      <td class="col-check"><input type="checkbox" aria-label="Select ${customer.name}"></td>
      <td class="col-sl">${index + 1}</td>

      <td class="col-customer">
        <div class="cust-cell">
          <span class="dot-status dot-status--${status.tone}" title="${status.label}"></span>
          <div class="cust-cell__text">
            <a href="#" class="cust-cell__name">${customer.name}</a>
            <small class="cust-cell__ids">${customer.pppoe} <span class="dot">·</span> Client ${customer.clientId}</small>
          </div>
        </div>
      </td>

      <td>${customer.profile}</td>
      <td><a class="link-quiet" href="tel:${customer.mobile}">${customer.mobile}</a></td>

      <td class="col-money">
        <b class="${customer.wallet === 0 ? 'is-zero' : ''}">${formatCurrency(customer.wallet)}</b>
        ${customer.due > 0 ? `<small class="cell-due">Due ${formatCurrency(customer.due)}</small>` : ''}
      </td>

      <td class="col-expiry">
        <b>${formatDateTime(customer.expiresAt)}</b>
        <span class="chip chip--${status.tone}">${status.detail}</span>
      </td>

      <td class="muted">${customer.lastOnline
        ? `<span title="${formatDateTime(customer.lastOnline)}">${timeAgo(customer.lastOnline)}</span>`
        : 'Never'}</td>

      <td class="col-actions">
        <button class="btn-view">${icon('eye', 15)} View</button>
        <button class="btn-edit">${icon('pencil', 15)} Edit</button>
      </td>
    </tr>`;
}

const TABLE_HEAD = `
  <thead>
    <tr>
      <th class="col-check"><input type="checkbox" aria-label="Select all rows"></th>
      <th class="col-sl">SL</th>
      <th class="col-customer">Customer ⇅</th>
      <th>Profile</th>
      <th>Mobile ⇅</th>
      <th class="col-money">Wallet / Due ⇅</th>
      <th class="col-expiry">Expire Date ⇅</th>
      <th>Last Online</th>
      <th class="col-actions">Actions</th>
    </tr>
  </thead>`;

/**
 * @param {HTMLElement} content
 * @param {(customer: object) => void} onOpenCustomer
 * @param {string} [initialFilter] filter key to open with, so dashboard
 *   figures can link straight to the subset they describe.
 */
export function renderCustomersPage(content, onOpenCustomer, initialFilter = 'all') {
  let activeFilter = customerFilters.some((f) => f.key === initialFilter) ? initialFilter : 'all';
  let rows = [];

  content.innerHTML = `
    <div class="page-banner">
      <div><h1>Customers</h1><p class="crumb">Dashboard <b>•</b> Customers</p></div>
      <button class="btn-primary">+&nbsp; Add Customer</button>
    </div>

    <section class="card filter-card">
      <div class="filter-top">
        <h2>Customer Filter</h2>
        <div class="toolbar-actions">${renderToolbarButtons()}</div>
      </div>
      <div class="segmented">
        <button class="seg-btn active">${icon('users', 16)} My ISP Customers</button>
        <button class="seg-btn">${icon('globe', 16)} All Customers</button>
      </div>
      <div class="pill-row">
        ${customerFilters.map((f) => `<button class="pill${f.key === activeFilter ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>`).join('')}
        <button class="pill pill-advanced">${icon('sliders-horizontal', 15)} Advanced ⌄</button>
      </div>
    </section>

    <section class="card table-toolbar">
      <input class="table-search" placeholder="Search name, username, mobile…">
      <div class="toolbar-right">
        <span class="show-label">Show:</span>
        <select class="show-select"><option>10</option><option>25</option><option>50</option></select>
        <span class="show-label">entries</span>
        <button class="btn-outline">Columns ⌄</button>
        <button class="btn-outline">${icon('filter', 15)} Filters</button>
      </div>
    </section>

    <section class="card table-card">
      <div class="table-scroll"></div>
      <div class="table-footer" hidden></div>
    </section>`;

  inlineMiniIcons(content);

  const scroll = content.querySelector('.table-scroll');
  const footer = content.querySelector('.table-footer');
  const search = content.querySelector('.table-search');

  function visibleRows() {
    const term = search.value.trim().toLowerCase();
    return rows.filter((customer) => {
      if (!matchesFilter(customer, activeFilter)) return false;
      if (!term) return true;
      return [customer.name, customer.pppoe, customer.clientId, customer.mobile]
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }

  function bindStateActions() {
    scroll.querySelectorAll('[data-state-action="clear-filters"]').forEach((button) => button.onclick = () => {
      activeFilter = 'all';
      search.value = '';
      content.querySelectorAll('.pill[data-filter]').forEach((p) => p.classList.toggle('active', p.dataset.filter === 'all'));
      paint();
    });
    scroll.querySelectorAll('[data-state-action="retry"]').forEach((button) => button.onclick = load);
  }

  function bindRowActions() {
    const shown = visibleRows();
    scroll.querySelectorAll('.btn-view, .cust-cell__name').forEach((el) => el.onclick = (event) => {
      event.preventDefault();
      const row = el.closest('tr');
      onOpenCustomer(shown[[...row.parentNode.children].indexOf(row)]);
    });
  }

  function paint() {
    const shown = visibleRows();
    const narrowed = activeFilter !== 'all' || search.value.trim() !== '';

    if (!shown.length) {
      scroll.innerHTML = `<table class="customer-table">${TABLE_HEAD}</table>${emptyState({
        iconName: 'users',
        title: narrowed ? 'No customers match' : 'No customers yet',
        message: narrowed
          ? 'Nothing matches the current filter and search. Try widening either.'
          : 'Once customers are added they will appear here.',
        actionLabel: narrowed ? 'Clear filters' : null,
        actionId: 'clear-filters',
      })}`;
      footer.hidden = true;
      inlineMiniIcons(scroll);
      bindStateActions();
      return;
    }

    scroll.innerHTML = `<table class="customer-table">${TABLE_HEAD}<tbody>${shown.map(renderCustomerRow).join('')}</tbody></table>`;
    footer.hidden = false;
    footer.innerHTML = `
      <span>Showing 1 to ${shown.length} of ${shown.length} entries${shown.length !== rows.length ? ` — filtered from ${rows.length}` : ''}</span>
      <div>
        <button class="page-btn" disabled>Prev</button>
        <button class="page-btn active">1</button>
        <button class="page-btn" disabled>Next</button>
      </div>`;
    inlineMiniIcons(scroll);
    bindRowActions();
  }

  content.querySelectorAll('.pill[data-filter]').forEach((pill) => pill.onclick = () => {
    activeFilter = pill.dataset.filter;
    content.querySelectorAll('.pill[data-filter]').forEach((p) => p.classList.toggle('active', p === pill));
    paint();
  });

  content.querySelectorAll('.seg-btn').forEach((seg) => seg.onclick = () => {
    content.querySelectorAll('.seg-btn').forEach((s) => s.classList.remove('active'));
    seg.classList.add('active');
  });

  search.addEventListener('input', paint);

  async function load() {
    scroll.innerHTML = `<table class="customer-table">${TABLE_HEAD}${loadingRows()}</table>`;
    footer.hidden = true;
    try {
      rows = await fetchCustomers();
      paint();
    } catch {
      scroll.innerHTML = errorState({ message: 'The customer list could not be reached.' });
      inlineMiniIcons(scroll);
      bindStateActions();
    }
  }

  load();
}
