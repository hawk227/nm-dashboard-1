// Dashboard Analytics page.

import { icon, inlineMiniIcons } from './icons.js';
import {
  topStats, clientSegments, attentionGroups, financialOverview,
  collectionProfit, profitBreakdown, topBandwidthCustomers, peakHoursChart, chipIcons,
} from './data.js';

const chip = (key, size = 20) => icon(chipIcons[key], size);

function renderAttentionGroup(title, tone, rows) {
  const rowsHTML = rows.map(([id, detail, action]) => `
    <div class="attention-row">
      <div><b>${id}</b><small>${detail}</small></div>
      <button data-action="${action}" data-id="${id}">${action}</button>
    </div>`).join('');
  return `<div class="attention-group"><span class="${tone}">●　${title}</span>${rowsHTML}</div>`;
}

function renderTopStats() {
  return `<div class="stat-grid">${topStats.map(([label, value, delta, tone, footnote]) => `
    <section class="card stat">
      <span>${label}</span>
      <div><strong>${value}</strong><em class="${tone}">${delta}</em></div>
      <small>${footnote}</small>
    </section>`).join('')}</div>`;
}

function renderClientInformation() {
  const stats = clientSegments.map(([label, value, inlineTone, inlineText, footTone, footText]) => `
    <div class="client-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      ${inlineText ? `<em class="${inlineTone}">${inlineText}</em>` : ''}
      <div class="client-divider"></div>
      <small class="${footTone}">${footText}</small>
    </div>`).join('');

  return `
    <section class="card client-card">
      <div class="section-top">
        <div><h2>Client Information</h2><p>July 2026 · All segments</p></div>
        <div class="totals">Total <b>495</b>　 Upcoming <b class="yellow">53</b>　 Left <b class="red">1</b>　 Blocked <b class="red">0</b></div>
      </div>
      <div class="client-grid">${stats}</div>
    </section>`;
}

function renderNeedsAttention() {
  const groups = attentionGroups.map(([title, tone, rows]) => renderAttentionGroup(title, tone, rows)).join('');
  return `
    <section class="card attention">
      <div class="attention-title">
        <div><h2>Needs Attention</h2><p>Action required now</p></div>
        <b>6 items</b>
      </div>
      ${groups}
    </section>`;
}

function renderFinancialOverview() {
  const overviewCards = financialOverview.map(([label, value, tone]) => `
    <div class="overview-card ${tone}"><span>${label}</span><b>${value}</b></div>`).join('');

  const profitChips = collectionProfit.map(([iconKey, label, value, footnote, tone]) => `
    <div class="profit-chip ${tone}">
      <span class="chip-icon">${chip(iconKey)}</span>
      <span class="chip-label">${label}</span>
      <b>${value}</b>
      <small>${footnote}</small>
    </div>`).join('');

  const breakdownCards = profitBreakdown.map(([title, lineLabel, lineValue, totalLabel, totalValue, tone, iconKey]) => `
    <div class="detail-card ${tone}">
      <h2>${title}</h2>
      <span class="detail-icon">${chip(iconKey)}</span>
      <div class="detail-line"><span>${lineLabel}</span><b>${lineValue}</b></div>
      <div class="detail-line"><span>Manager Package Buying Cost</span><b>৳0.00</b></div>
      <div class="detail-rule"></div>
      <div class="detail-total"><span>${totalLabel}</span><b>${totalValue}</b></div>
    </div>`).join('');

  const bandRows = topBandwidthCustomers.map(([id, size, color, percent]) => `
    <div class="band-row">
      <span>${id}</span>
      <div class="bar-track"><div class="bar" style="width:${percent}%;background:${color}">${size}</div></div>
    </div>`).join('');

  return `
    <section class="financial-screen">
      <div class="screen-title">Manager Financial Overview</div>
      <div class="overview-grid">${overviewCards}</div>

      <div class="screen-title">Collection Profit</div>
      <div class="profit-row">${profitChips}</div>

      <div class="screen-title">Profit Breakdown</div>
      <div class="breakdown-grid">${breakdownCards}</div>

      <div class="screen-title" style="margin-top:26px">Bandwidth Detail</div>
      <div class="bandwidth-grid">
        <div class="band-card">
          <h2>Top Bandwidth Customers</h2>
          <p>Current billing period</p>
          <div class="band-total">Total<b>12,212.79 GB</b></div>
          ${bandRows}
        </div>
        <div class="band-card">
          <h2>Peak Hours Analysis</h2>
          <p>Last 7 days · hourly distribution</p>
          <div class="peak">${icon('trending-up', 14)} Peak: 10:00</div>
          <div class="legend"><b>● Download</b><b>● Upload</b><b>● Sessions</b></div>
          <div class="peak-chart"><canvas id="peak-hours-chart" aria-label="Peak hours analysis chart"></canvas></div>
        </div>
      </div>
    </section>`;
}

export function renderDashboardPage(content) {
  content.innerHTML = `
    <div class="title-row">
      <div><h1>Dashboard Analytics</h1><p>Saturday, 5 July 2026 · ISP Control Center</p></div>
      <div class="month-wrap">
        <button class="month" id="month-toggle">${icon('calendar', 15)} July 2026　⌄</button>
        <div class="month-menu" id="month-menu" hidden>June 2026<br>July 2026<br>August 2026</div>
      </div>
    </div>
    <div id="toast" class="toast" hidden></div>
    ${renderTopStats()}
    <div class="dashboard-grid">${renderClientInformation()}${renderNeedsAttention()}</div>
    ${renderFinancialOverview()}`;

  inlineMiniIcons(content);

  content.querySelector('#month-toggle').onclick = () => {
    const menu = content.querySelector('#month-menu');
    menu.hidden = !menu.hidden;
  };

  content.querySelectorAll('[data-action]').forEach((button) => button.onclick = () => {
    const toast = content.querySelector('#toast');
    toast.textContent = `${button.dataset.action} action opened for ${button.dataset.id}`;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 2200);
  });

  drawPeakHoursChart(content.querySelector('#peak-hours-chart'));
}

function drawPeakHoursChart(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);

  const left = 57;
  const right = width - 12;
  const top = 30;
  const bottom = height - 42;
  const plotWidth = right - left;
  const plotHeight = bottom - top;

  const { download: bars, upload: uploadOnTop, sessions: line } = peakHoursChart;
  const maxValue = 3000;

  // Horizontal gridlines + axis labels.
  ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 6; i++) {
    const y = bottom - (plotHeight * i) / 6;
    ctx.strokeStyle = '#e8edf3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.fillStyle = '#99a7b9';
    ctx.fillText(`${i * 500}GB`, left - 7, y + 4);
  }

  // Axis lines.
  ctx.strokeStyle = '#c9d2de';
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  // Stacked download/upload bars.
  const step = plotWidth / bars.length;
  const barWidth = step * 0.72;
  bars.forEach((value, i) => {
    const x = left + i * step + (step - barWidth) / 2;
    const base = bottom - (value / maxValue) * plotHeight;
    const mid = bottom - ((value - uploadOnTop[i]) / maxValue) * plotHeight;
    ctx.fillStyle = 'rgba(110,142,241,.24)';
    ctx.fillRect(x, base, barWidth, bottom - base);
    ctx.fillStyle = 'rgba(67,204,183,.34)';
    ctx.fillRect(x, base, barWidth, mid - base);
  });

  // Sessions line (smoothed with bezier curves through each point).
  ctx.strokeStyle = '#ff686b';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  line.forEach((value, i) => {
    const x = left + i * step + step / 2;
    const y = bottom - (value / maxValue) * plotHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevX = left + (i - 1) * step + step / 2;
      const prevY = bottom - (line[i - 1] / maxValue) * plotHeight;
      ctx.bezierCurveTo(prevX + step * 0.55, prevY, x - step * 0.55, y, x, y);
    }
  });
  ctx.stroke();

  // X-axis hour labels (every 3rd hour).
  ctx.textAlign = 'center';
  ctx.fillStyle = '#99a7b9';
  ['00', '03', '06', '09', '12', '15', '18', '21'].forEach((label, i) => {
    ctx.fillText(label, left + step * (i * 3 + 0.5), bottom + 31);
  });
}
