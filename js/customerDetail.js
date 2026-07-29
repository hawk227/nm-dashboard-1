// Customer Details page.
//
// Layout intent: the page answers "is this account OK?" before it offers any
// controls. A status banner leads, tabs keep each job (billing vs. debugging a
// link vs. reading history) on its own screen, and only the two everyday
// actions are promoted — everything rarer or destructive sits behind "More".

import { icon, inlineMiniIcons } from './icons.js';
import { primaryActions, actionGroups } from './data.js';
import {
  customerStatus, formatDateTime, formatCurrency, timeAgo,
  orNotSet, copyable, secretField, bindFieldInteractions,
} from './format.js';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'layout-grid' },
  { id: 'connection', label: 'Connection', icon: 'wifi' },
  { id: 'billing', label: 'Billing', icon: 'wallet' },
  { id: 'history', label: 'History', icon: 'clock' },
];

/** Tab selection survives in-page re-renders (e.g. toggling a setting). */
let activeTab = 'overview';

// ---------------------------------------------------------------------------
// Small render helpers
// ---------------------------------------------------------------------------

const field = (label, value, { wide = false } = {}) =>
  `<div class="field-box${wide ? ' span-2' : ''}"><span>${label}</span><b>${orNotSet(value)}</b></div>`;

/** A definition row inside a connection group. */
const row = (label, value) => `<div class="info-row"><span>${label}</span><b>${orNotSet(value)}</b></div>`;

/**
 * A promoted action. Anything that cannot succeed right now is disabled with
 * the reason in its tooltip, rather than failing after the click.
 */
function primaryButton(action, customer) {
  const shortOnWallet = action.requiresWalletCover && customer.wallet < customer.price;
  const reason = shortOnWallet
    ? `Wallet balance (${formatCurrency(customer.wallet)}) does not cover the ${formatCurrency(customer.price)} renewal price`
    : '';
  return `${action.startsGroup ? '<span class="action-bar__sep" aria-hidden="true"></span>' : ''}
  <button class="btn btn--${action.variant}" data-action="${action.id}"
    ${shortOnWallet ? 'disabled' : ''}${reason ? ` title="${reason}"` : ''}>
    ${icon(action.icon, 15)} ${action.label}
  </button>`;
}

function statusBanner(status, customer) {
  if (status.key === 'active') return '';
  const action = status.key === 'expired' ? 'Renew now' : 'Renew early';
  return `
    <div class="status-banner status-banner--${status.tone}" role="status">
      <span class="status-banner__icon">${icon(status.icon, 20)}</span>
      <div class="status-banner__text">
        <strong>${status.detail}</strong>
        <span>Expired on ${formatDateTime(customer.expiresAt)}${customer.due > 0 ? ` · ${formatCurrency(customer.due)} outstanding` : ''}</span>
      </div>
      <button class="btn btn--primary" data-action="cash-renew">${icon('refresh-cw', 15)} ${action}</button>
    </div>`;
}

/** KPI tiles. `tone` drives emphasis so ৳0 due never looks like ৳1,200 due. */
function summaryTiles(customer, status) {
  const tiles = [
    {
      label: 'Status', value: status.label, sub: status.detail,
      tone: status.tone, iconName: status.icon,
    },
    {
      label: 'Outstanding due',
      value: formatCurrency(customer.due),
      sub: customer.due > 0 ? 'Collection required' : 'Nothing to collect',
      tone: customer.due > 0 ? 'danger' : 'muted',
      iconName: 'file-text',
    },
    {
      label: 'Wallet balance',
      value: formatCurrency(customer.wallet),
      sub: customer.wallet > 0 ? 'Available to apply' : 'Empty',
      tone: customer.wallet > 0 ? 'success' : 'muted',
      iconName: 'wallet',
    },
    {
      label: 'Monthly price', value: formatCurrency(customer.price),
      sub: `${customer.durationDays}-day cycle`, tone: 'neutral', iconName: 'credit-card',
    },
  ];

  return `<div class="summary-grid">${tiles.map((tile) => `
    <div class="summary-tile summary-tile--${tile.tone}">
      <span class="summary-tile__icon">${icon(tile.iconName, 18)}</span>
      <div>
        <span class="summary-tile__label">${tile.label}</span>
        <b class="summary-tile__value">${tile.value}</b>
        <small class="summary-tile__sub">${tile.sub}</small>
      </div>
    </div>`).join('')}</div>`;
}

function overviewTab(customer, status) {
  const mapsHref = customer.lat !== null && customer.lng !== null
    ? `https://www.google.com/maps?q=${customer.lat},${customer.lng}`
    : null;

  return `
    ${summaryTiles(customer, status)}

    <section class="card panel">
      <h2 class="panel__title">${icon('id-card', 18)} Customer information</h2>
      <div class="field-grid">
        ${field('Customer name', customer.name)}
        ${field('Mobile', `<a class="link" href="tel:${customer.mobile}">${customer.mobile}</a>`)}
        ${field('Address', customer.address, { wide: true })}
        ${field('Location', mapsHref
          ? `<a class="link" href="${mapsHref}" target="_blank" rel="noopener">${customer.lat}, ${customer.lng} ${icon('map-pin', 13)}</a>`
          : null)}
        ${field('Package', customer.profile)}
        ${field('Expires', `${formatDateTime(customer.expiresAt)} <span class="pill pill--${status.tone}">${status.detail}</span>`)}
        ${field('Last online', customer.lastOnline
          ? `${formatDateTime(customer.lastOnline)} <span class="muted-inline">(${timeAgo(customer.lastOnline)})</span>`
          : null)}
      </div>
    </section>

    <section class="card panel">
      <h2 class="panel__title">${icon('settings', 18)} Settings</h2>
      <div class="setting-row">
        <div>
          <b>Fixed billing cycle</b>
          <small>Keep the same renewal date every month regardless of when payment lands. Saves immediately.</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="fixed-billing" ${customer.fixedBillingCycle ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </section>`;
}

function connectionTab(customer) {
  const groups = [
    ['Credentials', 'id-card', [
      ['PPPoE username', copyable(customer.pppoe, 'username')],
      ['Password', secretField(customer.password)],
      ['Connection type', customer.connectionType],
    ]],
    ['Network', 'wifi', [
      ['IP address', copyable(customer.ip, 'IP address')],
      ['Gateway', copyable(customer.gateway, 'gateway')],
      ['Subnet mask', customer.subnet],
      ['Bandwidth type', customer.bandwidthType],
      ['Zone', customer.zone],
      ['Connected NAS', customer.connectedNas],
    ]],
    ['Hardware', 'server', [
      ['ONU MAC address', copyable(customer.onuMac, 'MAC address')],
      ['Initial fiber power', customer.initialFiberPower],
      ['Recent dB', customer.recentDb],
      ['Cable length', `${customer.cableLength} m`],
      ['Cable ID', customer.cableId],
      ['WiFi router username', customer.wifiRouterUsername],
      ['WiFi router password', customer.wifiRouterPassword],
      ['IP phone no.', customer.ipPhoneNo],
    ]],
    ['Ownership', 'user', [
      ['Manager', customer.manager],
      ['Manager email', `<a class="link" href="mailto:${customer.managerEmail}">${customer.managerEmail}</a>`],
      ['Joined', formatDateTime(customer.joinedAt)],
      ['Last updated', formatDateTime(customer.updatedAt)],
    ]],
  ];

  const passwordWarning = customer.password === customer.pppoe
    ? `<div class="inline-warning">${icon('triangle-alert', 16)} <span>Password is identical to the username. Change it to secure this account.</span></div>`
    : '';

  return `
    ${passwordWarning}
    ${groups.map(([title, groupIcon, rows]) => `
      <section class="card panel">
        <h2 class="panel__title">${icon(groupIcon, 18)} ${title}</h2>
        <div class="info-grid">${rows.map(([label, value]) => row(label, value)).join('')}</div>
      </section>`).join('')}

    <section class="card panel">
      <h2 class="panel__title">${icon('package', 18)} Profile &amp; package</h2>
      <div class="info-grid">
        ${row('Profile name', customer.profile)}
        ${row('Customer price', formatCurrency(customer.price))}
        ${row('Duration', `${customer.durationDays} days`)}
        ${row('Pool name', customer.pool)}
        ${row('Download speed', customer.downloadMbps ? `${customer.downloadMbps} Mbps` : null)}
        ${row('Upload speed', customer.uploadMbps ? `${customer.uploadMbps} Mbps` : null)}
      </div>
    </section>

    <section class="card panel">
      <h2 class="panel__title">${icon('map-pin', 18)} POC / splitter</h2>
      <div class="info-grid">
        ${row('Name', customer.poc.name)}
        ${row('Address', customer.poc.address)}
        ${row('Latitude', customer.poc.lat)}
        ${row('Longitude', customer.poc.lng)}
        ${row('Created', formatDateTime(customer.poc.createdAt))}
      </div>
    </section>`;
}

/**
 * Collapsible history section. The count sits in the header so an operator can
 * see there's nothing inside without opening it.
 */
function historySection(title, sectionIcon, count, emptyText) {
  const isEmpty = count === 0;
  return `
    <section class="card accordion${isEmpty ? ' accordion--empty' : ''}">
      <button type="button" class="accordion-head" ${isEmpty ? 'disabled' : ''}>
        <span>${icon(sectionIcon, 18)} ${title}</span>
        <span class="accordion-head__meta">
          <span class="count-badge${isEmpty ? ' count-badge--zero' : ''}">${count}</span>
          ${isEmpty ? '' : `<b class="chevron">${icon('chevron-down', 16)}</b>`}
        </span>
      </button>
      <div class="accordion-body" hidden>
        <p class="empty-note">${emptyText}</p>
      </div>
    </section>`;
}

const billingTab = (customer) => `
  <section class="card panel">
    <h2 class="panel__title">${icon('wallet', 18)} Balances</h2>
    <div class="info-grid">
      ${row('Outstanding due', `<b class="${customer.due > 0 ? 'amount-danger' : ''}">${formatCurrency(customer.due)}</b>`)}
      ${row('Wallet balance', formatCurrency(customer.wallet))}
      ${row('Monthly price', formatCurrency(customer.price))}
      ${row('Billing cycle', customer.fixedBillingCycle ? 'Fixed date' : 'Rolling from payment')}
    </div>
  </section>
  ${historySection('Invoice history', 'list', customer.history.invoices, 'No invoices have been issued yet.')}
  ${historySection('Renewal history', 'refresh-cw', customer.history.renewals, 'This account has never been renewed.')}
  ${historySection('Wallet withdraw history', 'wallet', customer.history.withdrawals, 'No withdrawals recorded.')}
  ${historySection('Expire date extensions', 'calendar', customer.history.extensions, 'No manual extensions granted.')}`;

const historyTab = (customer) => `
  ${historySection('Bandwidth usage history', 'chart-column', customer.history.bandwidth, 'No usage data collected yet.')}
  ${historySection('ONU history', 'wifi', customer.history.onu, 'No ONU events recorded.')}
  ${historySection('User analytics', 'shuffle', customer.history.analytics, 'Not enough activity to build analytics.')}`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * @param {HTMLElement} content
 * @param {object} customer
 * @param {(label: string) => void} onNavigate lets in-page links (breadcrumb,
 *   back button) drive the same router the sidebar uses.
 */
export function renderCustomerDetailPage(content, customer, onNavigate) {
  const status = customerStatus(customer);

  const tabPanels = {
    overview: () => overviewTab(customer, status),
    connection: () => connectionTab(customer),
    billing: () => billingTab(customer),
    history: () => historyTab(customer),
  };

  content.innerHTML = `
    <div class="detail-head">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="#" data-nav="Dashboard Analytics">Dashboard</a>
        <span aria-hidden="true">›</span>
        <a href="#" data-nav="Customers">Customers</a>
        <span aria-hidden="true">›</span>
        <span aria-current="page">${customer.name}</span>
      </nav>

      <div class="detail-head__main">
        <button class="btn btn--ghost btn--icon" data-nav="Customers" aria-label="Back to customers">${icon('arrow-left', 18)}</button>
        <div class="identity">
          <div class="identity__avatar">${icon('user', 26)}</div>
          <div>
            <h1>${customer.name}</h1>
            <p class="identity__meta">
              ${copyable(customer.pppoe, 'PPPoE username')}
              <span class="dot">·</span> Client ID ${customer.clientId}
            </p>
            <div class="identity__status">
              <span class="pill pill--${status.tone}">${icon(status.icon, 13)} ${status.label}</span>
              <span class="pill pill--muted" id="link-state">${icon('circle', 10)} Offline</span>
            </div>
          </div>
        </div>

        <div class="detail-head__aside">
          <button class="btn btn--ghost" data-action="send-sms">${icon('message-square', 15)} Send SMS</button>
          <button class="btn btn--ghost" data-action="edit">${icon('pencil', 15)} Edit User</button>
        </div>
      </div>

      <div class="diag-row">
        <button class="btn btn--ghost btn--sm" data-diagnostic="refresh">${icon('refresh-cw', 14)} Refresh</button>
        <button class="btn btn--ghost btn--sm" data-diagnostic="live">${icon('zap', 14)} Go Live</button>
        <button class="btn btn--ghost btn--sm" data-diagnostic="power">${icon('zap', 14)} Check Power</button>
        <span class="diag-row__stamp" id="diag-stamp">Not checked yet</span>
      </div>

      <div class="action-bar">
        ${primaryActions.map((action) => primaryButton(action, customer)).join('')}
        <div class="action-menu-wrap">
          <button class="btn btn--ghost" id="more-toggle" aria-haspopup="true" aria-expanded="false">${icon('ellipsis', 16)} More</button>
          <div class="action-menu" id="more-menu" hidden>
            ${actionGroups.map((group) => `
              <div class="action-menu__group${group.danger ? ' action-menu__group--danger' : ''}">
                <p class="action-menu__title">${group.title}</p>
                ${group.actions.map((a) => `
                  <button class="action-menu__item action-menu__item--${a.variant}" data-action="${a.id}">
                    ${icon(a.icon, 15)} ${a.label}
                  </button>`).join('')}
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map((tab) => `
          <button role="tab" class="tab${tab.id === activeTab ? ' is-active' : ''}"
                  data-tab="${tab.id}" aria-selected="${tab.id === activeTab}">
            ${icon(tab.icon, 15)} ${tab.label}
          </button>`).join('')}
      </div>
    </div>

    ${statusBanner(status, customer)}
    <div class="tab-panel" id="tab-panel">${tabPanels[activeTab]()}</div>
    <div class="toast" id="detail-toast" hidden></div>`;

  inlineMiniIcons(content);
  bindFieldInteractions(content);
  bindPageInteractions(content, customer, tabPanels, onNavigate);
}

function bindPageInteractions(content, customer, tabPanels, onNavigate) {
  const toast = content.querySelector('#detail-toast');
  let toastTimer;
  const notify = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
  };

  // Breadcrumb + back button route through the app's normal navigation.
  content.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', (event) => {
    event.preventDefault();
    onNavigate(el.dataset.nav);
  }));

  // Tabs swap only the panel, so page scroll and header stay put.
  const panel = content.querySelector('#tab-panel');
  content.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    activeTab = tab.dataset.tab;
    content.querySelectorAll('.tab').forEach((other) => {
      const selected = other === tab;
      other.classList.toggle('is-active', selected);
      other.setAttribute('aria-selected', String(selected));
    });
    panel.innerHTML = tabPanels[activeTab]();
    inlineMiniIcons(panel);
    bindFieldInteractions(panel);
    bindPanelInteractions(panel, customer, notify);
  }));

  bindPanelInteractions(panel, customer, notify);

  // Overflow menu.
  const moreToggle = content.querySelector('#more-toggle');
  const moreMenu = content.querySelector('#more-menu');
  moreToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = moreMenu.hidden;
    moreMenu.hidden = !open;
    moreToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', () => {
    moreMenu.hidden = true;
    moreToggle.setAttribute('aria-expanded', 'false');
  });

  content.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    notify(`${button.textContent.trim()} — not wired up in this prototype.`);
  }));

  // Diagnostics report progress and stamp when they last ran, so "Offline"
  // is never shown without saying how fresh it is.
  const stamp = content.querySelector('#diag-stamp');
  content.querySelectorAll('[data-diagnostic]').forEach((button) => button.addEventListener('click', () => {
    if (button.classList.contains('is-busy')) return;
    const label = button.textContent.trim();
    button.classList.add('is-busy');
    button.disabled = true;
    stamp.textContent = `${label}…`;
    setTimeout(() => {
      button.classList.remove('is-busy');
      button.disabled = false;
      stamp.textContent = `Last checked just now · ${label}`;
    }, 900);
  }));
}

function bindPanelInteractions(panel, customer, notify) {
  panel.querySelectorAll('.accordion-head:not([disabled])').forEach((head) => head.addEventListener('click', () => {
    const section = head.parentElement;
    const body = section.querySelector('.accordion-body');
    body.hidden = !body.hidden;
    section.classList.toggle('open', !body.hidden);
  }));

  const billingToggle = panel.querySelector('#fixed-billing');
  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      customer.fixedBillingCycle = billingToggle.checked;
      notify(`Fixed billing cycle ${billingToggle.checked ? 'enabled' : 'disabled'}.`);
    });
  }

  panel.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    notify(`${button.textContent.trim()} — not wired up in this prototype.`);
  }));
}
