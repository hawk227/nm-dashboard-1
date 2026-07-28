// Customer Details page.

import { icon, inlineMiniIcons } from './icons.js';
import { customerDetailFiller as filler, quickActionGroups } from './data.js';

// Each entry: [title, headerIcon, openByDefault, (customer) => bodyHTML]
const accordionSections = [
  ['Connection Details', 'wifi', true, (c) => `
    <div class="conn-grid">
      <div><b>PPPoE Username:</b> ${c[0]}</div>
      <div><b>Password:</b> ${c[0]}</div>
      <div><b>Connection Type:</b> STATIC_IP</div>
      <div><b>Bandwidth Type:</b> Shared</div>
      <div><b>IP Address:</b> ${filler.ip}</div>
      <div><b>Subnet Mask:</b> ${filler.subnet}</div>
      <div><b>Gateway:</b> ${filler.gateway}</div>
      <div><b>Profile:</b> ${c[3]}</div>
      <div><b>Zone:</b> ${filler.zone}</div>
      <div class="conn-expire"><span class="orange">Expire Date: ${c[6]}</span></div>
      <div><b>Initial Fiber Power:</b> N/A</div>
      <div><b>ONU MAC Address:</b> ${filler.onuMac}</div>
      <div><b>Cable Length:</b> 0</div>
      <div><b>Cable ID:</b> N/A</div>
      <div><b>WiFi Router Username:</b> N/A</div>
      <div><b>WiFi Router Password:</b> N/A</div>
      <div><b>IP Phone No:</b> N/A</div>
      <div><b>Connected NAS:</b> N/A</div>
      <div><b>Manager:</b> ISP Manager</div>
      <div><b>Manager Email:</b> admin@gmail.com</div>
      <div><b>Joined At:</b> ${c[6]}</div>
      <div><b>Updated At:</b> ${c[6]}</div>
    </div>`],

  ['Profile & Package Details', 'package', true, (c) => `
    <div class="pkg-grid">
      <div class="pkg-box"><span class="blue">Profile Name</span><b class="blue">${c[3]}</b></div>
      <div class="pkg-box"><span class="green">Customer Price</span><b class="green">1000</b></div>
      <div><b>Pool Name:</b> ${filler.pool}</div>
      <div><b>Download Speed:</b> ${filler.download} Mbps</div>
      <div><b>Upload Speed:</b> ${filler.upload} Mbps</div>
      <div><b>Duration:</b> ${filler.duration}</div>
      <div><b>Initial Expiration:</b> N/A days</div>
    </div>`],

  ['POC Information', 'map-pin', true, () => `
    <div class="poc-grid">
      <div><span>POC/Splitter Name</span><b>${filler.pocName}</b></div>
      <div><span>Created At</span><b>${filler.pocCreated}</b></div>
      <div><span>POC/Splitter Address</span><b>${filler.pocAddr}</b></div>
      <div><span>POC/Splitter Latitude</span><b>${filler.pocLat}</b></div>
      <div><span>POC/Splitter Longitude</span><b>${filler.pocLng}</b></div>
    </div>`],

  ['Expire Date Extensions', 'calendar', false, () => `<p class="empty-note">No extension history yet.</p>`],
  ['Invoice History', 'list', false, () => `<p class="empty-note">No invoices yet.</p>`],
  ['Renewal History', 'clock', false, () => `<p class="empty-note">No renewal history yet.</p>`],
  ['Wallet Withdraw History', 'wallet', false, () => `<p class="empty-note">No withdrawals yet.</p>`],
  ['Bandwidth Usage History', 'bar-chart-3', false, () => `<p class="empty-note">No usage data yet.</p>`],
  ['ONU History', 'wifi', false, () => `<p class="empty-note">No ONU events yet.</p>`],
  ['User Analytics', 'shuffle', false, () => `<p class="empty-note">No analytics yet.</p>`],
];

function renderQuickActions() {
  return quickActionGroups.map(([title, groupIcon, actions]) => `
    <div class="action-group">
      <div class="action-group-title">${icon(groupIcon, 18)} ${title}</div>
      <div class="action-grid">
        ${actions.map(([actionIcon, label, tone]) => `<button class="action-btn ${tone}">${icon(actionIcon, 16)} ${label}</button>`).join('')}
      </div>
    </div>`).join('');
}

function renderAccountSummary() {
  return `
    <div class="summary-row">
      <div class="summary-card"><span class="summary-circle navy">${icon('credit-card')}</span><div><b>৳0</b><small>Wallet Balance</small></div></div>
      <div class="summary-card"><span class="summary-circle green">${icon('file-text')}</span><div><b>৳0</b><small>Due Amount</small></div></div>
      <div class="summary-card"><span class="summary-circle green">${icon('circle-check')}</span><div><b>Active</b><small>Status</small></div></div>
    </div>`;
}

function renderHighlightInformation(customer) {
  const [, , name, profile, mobile, , expireDate] = customer;
  return `
    <section class="card">
      <h2 class="section-icon-title">${icon('id-card', 18)} Highlight Information</h2>
      <div class="field-grid">
        <div class="field-box"><span>Customer Name</span><b>${name.replace('_', ' ')}</b></div>
        <div class="field-box"><span>Mobile</span><b>${mobile}</b></div>
        <div class="field-box span-2"><span>Address</span><b>${filler.address}</b></div>
        <div class="field-box"><span>Lat, Long</span><b>${filler.lat}</b></div>
        <div class="field-box"><span>Profile</span><b>${profile}</b></div>
        <div class="field-box"><span>Price</span><b>৳1000.00</b></div>
        <div class="field-box"><span>Bandwidth</span><b>${filler.bandwidth}</b></div>
        <div class="field-box"><span>ONU MAC</span><b>${filler.onuMac}</b></div>
        <div class="field-box"><span>Recent dB</span><b>${filler.recentDb}</b></div>
        <div class="field-box"><span>Expire Date</span><b>${expireDate}</b></div>
        <div class="field-box toggle-box">
          <span>Fixed Billing Cycle</span>
          <label class="switch"><input type="checkbox"><span class="slider"></span></label>
        </div>
      </div>
    </section>`;
}

function renderAccordions(customer) {
  return accordionSections.map(([title, sectionIcon, openByDefault, buildBody], index) => `
    <section class="card accordion${openByDefault ? ' open' : ''}" data-idx="${index}">
      <div class="accordion-head"><span>${icon(sectionIcon, 18)} ${title}</span><b class="chevron">⌄</b></div>
      <div class="accordion-body" ${openByDefault ? '' : 'hidden'}>${buildBody(customer)}</div>
    </section>`).join('');
}

export function renderCustomerDetailPage(content, customer) {
  const [pppoeUsername, clientId] = customer;

  content.innerHTML = `
    <div class="page-banner detail-banner">
      <div><h1>Customer Details – ${pppoeUsername}</h1><p class="crumb">Dashboard <b>•</b> Customers <b>•</b> Customer Details</p></div>
      <input class="detail-search" placeholder="Search customer by username or...">
    </div>

    <div class="detail-columns">
      <section class="card detail-left">
        <h2 class="section-icon-title">${icon('briefcase', 18)} Account Summary</h2>
        ${renderAccountSummary()}
        <h2 class="section-icon-title">${icon('zap', 18)} Quick Actions</h2>
        ${renderQuickActions()}
      </section>

      <section class="detail-right">
        <div class="card profile-card">
          <div class="profile-avatar">${icon('user', 44)}</div>
          <div class="profile-info">
            <h2>${pppoeUsername}</h2>
            <p class="client-id">Client ID: ${clientId}</p>
            <div class="profile-btn-row">
              <span class="status-pill">● Offline</span>
              <button class="btn-refresh">${icon('refresh-cw', 14)} Refresh</button>
              <button class="btn-golive">${icon('zap', 14)} Go Live</button>
            </div>
            <button class="btn-checkpower">${icon('zap', 14)} Check Power</button>
          </div>
        </div>

        ${renderHighlightInformation(customer)}
        ${renderAccordions(customer)}
      </section>
    </div>`;

  inlineMiniIcons(content);

  content.querySelectorAll('.accordion-head').forEach((head) => head.onclick = () => {
    const section = head.parentElement;
    const body = section.querySelector('.accordion-body');
    body.hidden = !body.hidden;
    section.classList.toggle('open', !body.hidden);
  });
}
