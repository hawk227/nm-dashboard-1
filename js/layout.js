// App shell: sidebar + header. Rendered once; page modules only ever touch
// #content after this mounts.

import { icon, inlineMiniIcons } from './icons.js';
import { sidebarNav, customerSubmenu } from './data.js';

function renderNavLink(item, index) {
  if (item.expandable) {
    return `
      <a href="#" class="expandable" id="customers-toggle">
        ${icon(item.icon)}<span>${item.label}</span><b class="chevron">⌄</b>
      </a>
      <div class="submenu" id="customers-submenu" hidden>
        ${customerSubmenu.map((sub) => `<a href="#">${icon(sub.icon, 18)}<span>${sub.label}</span></a>`).join('')}
      </div>`;
  }
  return `<a href="#" class="${index === 0 ? 'active' : ''}">${icon(item.icon)}<span>${item.label}</span>${item.hasChevron ? '<b>⌄</b>' : ''}</a>`;
}

const shellHTML = `
<div class="dashboard">
  <aside class="sidebar">
    <img src="/assets/03af2b9b7a10d803.svg" class="logo" alt="Net Manager">
    <div class="nav-label">DASHBOARD</div>
    <nav>${sidebarNav.slice(0, 5).map(renderNavLink).join('')}</nav>
    <div class="nav-label second">ISP MANAGER</div>
    <nav>${sidebarNav.slice(5).map(renderNavLink).join('')}</nav>
    <div class="user">
      <div class="avatar">${icon('user')}</div>
      <div><strong>admin</strong><small>Administrator</small></div>
      <button>${icon('power')}</button>
    </div>
  </aside>
  <main>
    <header>
      <button class="menu" id="sidebar-toggle">${icon('menu')}</button>
      <div class="search">${icon('search', 16)} <span>Search anything…</span></div>
      <div class="header-spacer"></div>
      <div class="outstanding">${icon('credit-card', 16)} Outstanding: ৳5,560</div>
      <button class="bell">${icon('bell')}<i>3</i></button>
      <button class="moon">${icon('moon')}</button>
      <div class="header-avatar">${icon('user')}</div>
    </header>
    <div class="content" id="content"></div>
  </main>
</div>`;

/**
 * Mounts the sidebar/header shell into #app and wires up navigation.
 * @param {(label: string) => void} onNavigate called with the clicked nav
 *   item's label whenever the user picks a top-level or submenu link.
 * @returns {HTMLElement} the #content element pages should render into.
 */
export function renderShell(onNavigate) {
  document.querySelector('#app').innerHTML = shellHTML;
  inlineMiniIcons();

  const dashboardRoot = document.querySelector('.dashboard');
  document.querySelector('#sidebar-toggle').onclick = () => dashboardRoot.classList.toggle('collapsed');

  const customersToggle = document.querySelector('#customers-toggle');
  customersToggle.onclick = (event) => {
    event.preventDefault();
    const submenu = document.querySelector('#customers-submenu');
    submenu.hidden = !submenu.hidden;
    customersToggle.classList.toggle('open', !submenu.hidden);
  };

  const selectableLinks = document.querySelectorAll('.sidebar nav > a, .submenu a');
  selectableLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    selectableLinks.forEach((other) => other.classList.remove('active'));
    link.classList.add('active');
    onNavigate(link.querySelector('span:not(.mini-icon)').textContent);
  }));

  return document.querySelector('#content');
}
