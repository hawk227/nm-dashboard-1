// Customers list page.

import { icon, inlineMiniIcons } from './icons.js';
import { customers } from './data.js';
import { customerStatus, formatDateTime, formatCurrency } from './format.js';

const statusFilters = ['All Customers', 'Active', 'Online', 'Offline', 'Deactivated', 'Expiring Soon', 'Expired', 'Left', 'Blocked'];

function renderToolbarButtons() {
  return `
    <button class="btn-outline">${icon('download', 15)} Export</button>
    <button class="btn-outline">${icon('file-text', 15)} DIS Report</button>
    <button class="btn-outline">${icon('arrow-left-right', 15)} Import Customers</button>`;
}

function renderCustomerRow(customer, index) {
  const status = customerStatus(customer);
  return `
    <tr>
      <td><input type="checkbox"></td>
      <td>${index + 1}</td>
      <td>
        <div class="pppoe-cell">
          <b class="dot-status dot-status--${status.tone}"></b>
          <div><a href="#" class="pppoe-link">${customer.pppoe}</a><small>Client ${customer.clientId}</small></div>
        </div>
      </td>
      <td>${customer.clientId}</td>
      <td>${customer.name}</td>
      <td>${customer.profile}</td>
      <td>${customer.mobile}</td>
      <td>${formatCurrency(customer.wallet)}</td>
      <td class="${status.key === 'active' ? '' : 'orange'}">${formatDateTime(customer.expiresAt)}</td>
      <td><span class="chip chip--${status.tone}">${status.detail}</span></td>
      <td class="muted">${customer.lastOnline ? formatDateTime(customer.lastOnline) : 'Never'}</td>
      <td>
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
              <th><input type="checkbox"></th>
              <th>SL</th>
              <th>PPPoE Username ⇅</th>
              <th>Client ID ⇅</th>
              <th>Customer Name ⇅</th>
              <th>Profile</th>
              <th>Mobile ⇅</th>
              <th>Wallet Balance ⇅</th>
              <th>Expire Date ⇅</th>
              <th>Remaining Days</th>
              <th>Last Online</th>
              <th>Remarks</th>
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

  content.querySelectorAll('.btn-view, .pppoe-link').forEach((el) => el.onclick = (event) => {
    event.preventDefault();
    const row = el.closest('tr');
    const rowIndex = [...row.parentNode.children].indexOf(row);
    onOpenCustomer(customers[rowIndex]);
  });
}
