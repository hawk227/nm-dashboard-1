// Customers list page.

import { icon, inlineMiniIcons } from './icons.js';
import { customers } from './data.js';
import { customerStatus, formatDateTime, formatCurrency, timeAgo } from './format.js';

const statusFilters = ['All Customers', 'Active', 'Online', 'Offline', 'Deactivated', 'Expiring Soon', 'Expired', 'Left', 'Blocked'];

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
        <b>${formatCurrency(customer.wallet)}</b>
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

/**
 * @param {HTMLElement} content
 * @param {(customer: Array) => void} onOpenCustomer called with the full
 *   customer record when a row's View button or username link is clicked.
 */
export function renderCustomersPage(content, onOpenCustomer) {
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
        ${statusFilters.map((label, i) => `<button class="pill${i === 0 ? ' active' : ''}">${label}</button>`).join('')}
        <button class="pill pill-advanced">${icon('sliders-horizontal', 15)} Advanced ⌄</button>
      </div>
    </section>

    <section class="card table-toolbar">
      <input class="table-search" placeholder="Search…">
      <div class="toolbar-right">
        <span class="show-label">Show:</span>
        <select class="show-select"><option>10</option><option>25</option><option>50</option></select>
        <span class="show-label">entries</span>
        <button class="btn-outline">Columns ⌄</button>
        <button class="btn-outline">${icon('filter', 15)} Filters</button>
      </div>
    </section>

    <section class="card table-card">
      <div class="table-scroll">
        <table class="customer-table">
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
          </thead>
          <tbody>${customers.map(renderCustomerRow).join('')}</tbody>
        </table>
      </div>
      <div class="table-footer">
        <span>Showing 1 to ${customers.length} of ${customers.length} entries</span>
        <div>
          <button class="page-btn" disabled>Prev</button>
          <button class="page-btn active">1</button>
          <button class="page-btn" disabled>Next</button>
        </div>
      </div>
    </section>`;

  inlineMiniIcons(content);

  content.querySelectorAll('.pill').forEach((pill) => pill.onclick = () => {
    content.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
  });

  content.querySelectorAll('.seg-btn').forEach((seg) => seg.onclick = () => {
    content.querySelectorAll('.seg-btn').forEach((s) => s.classList.remove('active'));
    seg.classList.add('active');
  });

  content.querySelectorAll('.btn-view, .cust-cell__name').forEach((el) => el.onclick = (event) => {
    event.preventDefault();
    const row = el.closest('tr');
    const rowIndex = [...row.parentNode.children].indexOf(row);
    onOpenCustomer(customers[rowIndex]);
  });
}
