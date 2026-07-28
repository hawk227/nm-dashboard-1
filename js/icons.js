// Icon helpers, backed by the Lucide icon library (https://lucide.dev),
// loaded globally via CDN in index.html. We never ship our own icon SVGs.

export const icon = (name, size = 20) =>
  `<i class="mini-icon" data-lucide="${name}" width="${size}" height="${size}"></i>`;

/** Replace every [data-lucide] placeholder in the DOM with its inline SVG. */
export function inlineMiniIcons() {
  window.lucide.createIcons();
}
