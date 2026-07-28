// Dashboard Analytics page.
//
// Ordering intent: what needs doing comes first, then the figures that
// summarise the day, then the financial detail. Any figure that describes a
// set of customers links straight to that set rather than leaving the
// operator to reproduce the filter by hand.

import { icon, inlineMiniIcons } from './icons.js';
import {
  topStats, clientSegments, attentionGroups, financialOverview,
  collectionProfit, profitBreakdown, topBandwidthCustomers, peakHoursChart, chipIcons,
} from './data.js';

const chip = (key, size = 20) => icon(chipIcons[key], size);

/** Money figures that are zero carry no news, so they recede. */
const zeroClass = (value) => (/^৳?0(\.00)?$/.test(String(value).trim()) ? ' is-zero' : '');

// ---------------------------------------------------------------------------
// Needs Attention — the only section that says "do something", so it leads.
// ---------------------------------------------------------------------------

/** Collapse state persists across re-renders within the session. */
let attentionOpen = false;

function renderNeedsAttention() {
  const total = attentionGroups.reduce((sum, [, , , rows]) => sum + rows.length, 0);
  // The summary stays in the header, so a collapsed panel still says whether
  // it is worth opening.
  const summary = attentionGroups
    .map(([title, , , rows]) => `${rows.length} ${title.toLowerCase()}`)
    .join(' · ');

  const columns = attentionGroups.map(([title, tone, filter, rows]) => `
    <div class="attn-col">
      <div class="attn-col__head">
        <span class="pill pill--${tone}">${title}</span>
        <span class="attn-col__count">${rows.length}</span>
      </div>
      ${rows.map(([id, detail, action]) => `
        <div class="attn-item">
          <div>
            <b>${id}</b>
            <small>${detail}</small>
          </div>
          <button class="btn btn--sm btn--${tone === 'danger' ? 'danger' : 'neutral'}" data-action="${action}" data-id="${id}">${action}</button>
        </div>`).join('')}
      ${filter ? `<button class="attn-col__all" data-filter="${filter}">View all ${title.toLowerCase()} ${icon('arrow-right', 13)}</button>` : ''}
    </div>`).join('');

  return `
    <section class="card attn-panel${attentionOpen ? ' is-open' : ''}">
      <button class="attn-panel__head" id="attn-toggle" aria-expanded="${attentionOpen}" aria-controls="attn-grid">
        <div>
          <h2>${icon('triangle-alert', 18)} Needs attention</h2>
          <p>${summary}</p>
        </div>
        <span class="attn-panel__meta">
          <span class="pill pill--danger">${total} items</span>
          <b class="chevron">${icon('chevron-down', 18)}</b>
        </span>
      </button>
      <div class="attn-grid" id="attn-grid" ${attentionOpen ? '' : 'hidden'}>${columns}</div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Summary figures
// ---------------------------------------------------------------------------

function renderTopStats() {
  return `<div class="stat-grid">${topStats.map(([label, value, delta, tone, footnote, filter]) => {
    const Tag = filter ? 'button' : 'div';
    return `
    <${Tag} class="card stat${filter ? ' stat--link' : ''}"${filter ? ` data-filter="${filter}"` : ''}>
      <span>${label}</span>
      <div><strong class="${zeroClass(value).trim()}">${value}</strong><em class="${tone}">${delta}</em></div>
      <small>${footnote}${filter ? ` ${icon('arrow-right', 12)}` : ''}</small>
    </${Tag}>`;
  }).join('')}</div>`;
}

function renderClientInformation() {
  const stats = clientSegments.map(([label, value, inlineTone, inlineText, footTone, footText, filter]) => {
    const Tag = filter ? 'button' : 'div';
    return `
    <${Tag} class="client-stat${filter ? ' client-stat--link' : ''}"${filter ? ` data-filter="${filter}"` : ''}>
      <span>${label}</span>
      <strong class="${value === '0' ? 'is-zero' : ''}">${value}</strong>
      ${inlineText ? `<em class="${inlineTone}">${inlineText}</em>` : ''}
      <div class="client-divider"></div>
      <small class="${footTone}">${footText}</small>
    </${Tag}>`;
  }).join('');

  return `
    <section class="card client-card">
      <div class="section-top">
        <div><h2>Client information</h2><p>July 2026 · all segments</p></div>
        <div class="totals">Total <b>495</b>　 Upcoming <b class="yellow">53</b>　 Left <b class="red">1</b>　 Blocked <b class="red">0</b></div>
      </div>
      <div class="client-grid">${stats}</div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Financial detail
// ---------------------------------------------------------------------------

function renderFinancialOverview() {
  const overviewCards = financialOverview.map(([label, value, tone]) => `
    <div class="overview-card ${tone}"><span>${label}</span><b class="${zeroClass(value).trim()}">${value}</b></div>`).join('');

  const profitChips = collectionProfit.map(([iconKey, label, value, footnote, tone]) => `
    <div class="profit-chip ${tone}">
      <span class="chip-icon">${chip(iconKey)}</span>
      <span class="chip-label">${label}</span>
      <b class="${zeroClass(value).trim()}">${value}</b>
      <small>${footnote}</small>
    </div>`).join('');

  // One table instead of four cards each computing `X − 0 = X`; the same
  // eight figures compare far more easily down a column.
  const breakdownRows = profitBreakdown.map(([title, lineLabel, lineValue, totalLabel, totalValue, tone, iconKey]) => `
    <tr>
      <td class="breakdown__source"><span class="breakdown__icon ${tone}">${chip(iconKey, 16)}</span> ${title}</td>
      <td class="muted">${lineLabel}</td>
      <td class="num${zeroClass(lineValue)}">${lineValue}</td>
      <td class="num is-zero">৳0.00</td>
      <td class="num num--total${zeroClass(totalValue)}">${totalValue}</td>
    </tr>`).join('');

  const maxBandwidth = Math.max(...topBandwidthCustomers.map(([, , , percent]) => percent));
  const bandRows = topBandwidthCustomers.map(([id, size, , percent]) => `
    <div class="band-row">
      <span>${id}</span>
      <div class="bar-track">
        <div class="bar" style="width:${percent}%;opacity:${(0.45 + 0.55 * (percent / maxBandwidth)).toFixed(2)}">${size}</div>
      </div>
    </div>`).join('');

  return `
    <section class="financial-screen">
      <div class="screen-title">Manager financial overview</div>
      <div class="overview-grid">${overviewCards}</div>

      <div class="screen-title">Collection profit</div>
      <div class="profit-row">${profitChips}</div>

      <div class="screen-title">Profit breakdown</div>
      <section class="card breakdown-table-wrap">
        <table class="breakdown-table">
          <thead>
            <tr><th>Source</th><th>Received from</th><th class="num">Amount</th><th class="num">Buying cost</th><th class="num">Net profit</th></tr>
          </thead>
          <tbody>${breakdownRows}</tbody>
        </table>
      </section>

      <div class="screen-title">Bandwidth detail</div>
      <div class="bandwidth-grid">
        <div class="band-card">
          <h2>Top bandwidth customers</h2>
          <p>Current billing period</p>
          <div class="band-total">Total<b>12,212.79 GB</b></div>
          ${bandRows}
        </div>
        <div class="band-card">
          <h2>Peak hours analysis</h2>
          <p>Last 7 days · hourly distribution</p>
          <div class="peak">${icon('trending-up', 14)} Peak: 10:00</div>
          <div class="legend">
            <b><span class="legend__swatch legend__swatch--download"></span> Download (GB)</b>
            <b><span class="legend__swatch legend__swatch--upload"></span> Upload (GB)</b>
            <b><span class="legend__swatch legend__swatch--sessions"></span> Sessions</b>
          </div>
          <div class="peak-chart">
            <canvas id="peak-hours-chart" aria-label="Peak hours analysis chart"></canvas>
            <div class="chart-tooltip" id="chart-tooltip" hidden></div>
          </div>
        </div>
      </div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * @param {HTMLElement} content
 * @param {(filterKey: string) => void} [onOpenCustomers] opens the Customers
 *   list already filtered to the set a figure describes.
 */
export function renderDashboardPage(content, onOpenCustomers = () => {}) {
  const updated = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());

  content.innerHTML = `
    <div class="title-row">
      <div>
        <h1>Dashboard analytics</h1>
        <p>ISP control center <span class="dot">·</span> updated ${updated}</p>
      </div>
      <div class="month-wrap">
        <button class="month" id="month-toggle">${icon('calendar', 15)} July 2026　⌄</button>
        <div class="month-menu" id="month-menu" hidden>June 2026<br>July 2026<br>August 2026</div>
      </div>
    </div>
    <div id="toast" class="toast" hidden></div>
    ${renderNeedsAttention()}
    ${renderTopStats()}
    ${renderClientInformation()}
    ${renderFinancialOverview()}`;

  inlineMiniIcons(content);

  const attnToggle = content.querySelector('#attn-toggle');
  const attnGrid = content.querySelector('#attn-grid');
  attnToggle.onclick = () => {
    attentionOpen = !attentionOpen;
    attnGrid.hidden = !attentionOpen;
    attnToggle.setAttribute('aria-expanded', String(attentionOpen));
    attnToggle.closest('.attn-panel').classList.toggle('is-open', attentionOpen);
  };

  content.querySelector('#month-toggle').onclick = () => {
    const menu = content.querySelector('#month-menu');
    menu.hidden = !menu.hidden;
  };

  // Every figure that names a set of customers opens that set.
  content.querySelectorAll('[data-filter]').forEach((el) => el.addEventListener('click', () => {
    onOpenCustomers(el.dataset.filter);
  }));

  content.querySelectorAll('[data-action]').forEach((button) => button.onclick = () => {
    const toast = content.querySelector('#toast');
    toast.textContent = `${button.dataset.action} action opened for ${button.dataset.id}`;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 2200);
  });

  drawPeakHoursChart(content.querySelector('#peak-hours-chart'), content.querySelector('#chart-tooltip'));
}

/**
 * Renders the peak-hours chart and wires a hover readout, so values can be
 * read rather than only estimated from the shape.
 */
function drawPeakHoursChart(canvas, tooltip) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);

  const left = 62;
  const right = width - 12;
  const top = 30;
  const bottom = height - 42;
  const plotWidth = right - left;
  const plotHeight = bottom - top;

  const { download: bars, upload: uploadOnTop, sessions: line } = peakHoursChart;
  const maxValue = 3000;
  const step = plotWidth / bars.length;
  const barWidth = step * 0.72;

  ctx.clearRect(0, 0, width, height);

  // Gridlines + left axis (volume).
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
    ctx.fillText(`${i * 500}GB`, left - 8, y + 4);
  }

  ctx.strokeStyle = '#c9d2de';
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  // Stacked download/upload bars.
  bars.forEach((value, i) => {
    const x = left + i * step + (step - barWidth) / 2;
    const base = bottom - (value / maxValue) * plotHeight;
    const mid = bottom - ((value - uploadOnTop[i]) / maxValue) * plotHeight;
    ctx.fillStyle = 'rgba(110,142,241,.24)';
    ctx.fillRect(x, base, barWidth, bottom - base);
    ctx.fillStyle = 'rgba(67,204,183,.34)';
    ctx.fillRect(x, base, barWidth, mid - base);
  });

  // Sessions line, smoothed through each point.
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

  // X-axis hour labels (every third hour).
  ctx.textAlign = 'center';
  ctx.fillStyle = '#99a7b9';
  ['00', '03', '06', '09', '12', '15', '18', '21'].forEach((label, i) => {
    ctx.fillText(label, left + step * (i * 3 + 0.5), bottom + 31);
  });

  // Hover readout.
  canvas.onmousemove = (event) => {
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    if (x < left || x > right) { tooltip.hidden = true; return; }

    const index = Math.min(bars.length - 1, Math.max(0, Math.floor((x - left) / step)));
    tooltip.hidden = false;
    tooltip.innerHTML = `
      <b>${String(index).padStart(2, '0')}:00</b>
      <span><i class="legend__swatch legend__swatch--download"></i> Download ${bars[index] - uploadOnTop[index]} GB</span>
      <span><i class="legend__swatch legend__swatch--upload"></i> Upload ${uploadOnTop[index]} GB</span>
      <span><i class="legend__swatch legend__swatch--sessions"></i> Sessions ${line[index]}</span>`;

    const anchor = left + index * step + step / 2;
    tooltip.style.left = `${Math.min(Math.max(anchor, 70), width - 70)}px`;
    tooltip.style.top = `${top}px`;
  };
  canvas.onmouseleave = () => { tooltip.hidden = true; };
}
