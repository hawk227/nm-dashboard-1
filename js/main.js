// Entry point: mounts the app shell and routes nav clicks to page renderers.
//
// This is a hand-rolled router (no framework) — good enough for a handful of
// screens. Each page module owns its own render() + event wiring and is only
// ever given the #content element to work with.

import { renderShell } from './layout.js';
import { renderDashboardPage } from './dashboard.js';
import { renderCustomersPage } from './customers.js';
import { renderCustomerDetailPage } from './customerDetail.js';

function navigate(label) {
  window.scrollTo(0, 0);

  if (label === 'Dashboard Analytics') {
    renderDashboardPage(content);
  } else if (label === 'Customers') {
    renderCustomersPage(content, openCustomer);
  }
  // Other sidebar items don't have a page implementation yet; the click
  // still updates the active nav state via renderShell's own handler.
}

function openCustomer(customer) {
  window.scrollTo(0, 0);
  renderCustomerDetailPage(content, customer, navigate);
}

const content = renderShell(navigate);
renderDashboardPage(content);
