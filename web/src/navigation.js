// Navigation (0.12 "Fusion", rebuilt in 0.20 "Livery"): a bar on top with the shown model, the camera views as icons and the switches
// of the two side panels; left panel "Modell" (body and head as picture tiles, variants, close-ups, parts), right panel "Look" (paint,
// display, helmet geometry, export). Both panels fold away on their own (remembered per browser, keys [ and ]); the viewport takes the free
// space (CSS variables --top, --left, --right). The navigation only builds DOM and calls back; main.js owns the scene. ?ui=0 hides it.
// The frame stays when the page changes: links call onLink instead of loading a new page, clear() empties the content and keeps the
// scroll positions and which sections are open. Preview images: web/src/navThumbs (tools/nav_thumbs.mjs).
const THUMBS = import.meta.glob('./navThumbs/*.jpg', { eager: true, query: '?url', import: 'default' });
export const thumb = name => THUMBS[`./navThumbs/${name}.jpg`] ?? null;

const el = (tag, props = {}, ...children) => {
  const e = Object.assign(document.createElement(tag), props);
  for (const c of children.flat()) if (c != null) e.append(c);
  return e;
};
// Line icons, 20 × 20, stroke = currentColor
const svg = body => {
  const t = document.createElement('template');
  t.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  return t.content.firstChild;
};
// camera views: the model seen from above (circle, nose = front) and the camera's direction
const view = deg => `<circle cx="10" cy="10" r="3.6"/><path d="M10 6.4v1.4"/><g transform="rotate(${deg} 10 10)"><path d="M10 18.5v-4.6M7.8 16l2.2-2.2 2.2 2.2"/></g>`;
export const ICONS = {
  front: view(0), left: view(64), back: view(180), right: view(298),
  assembly: '<path d="M10 2.5l6.5 3.7v7.6L10 17.5l-6.5-3.7V6.2z"/><path d="M3.5 6.2L10 10l6.5-3.8M10 10v7.5"/>',
  turntable: '<path d="M16 10a6 6 0 1 1-2-4.5"/><path d="M14.3 2.6l-.3 2.9 2.9.3"/><ellipse cx="10" cy="16.6" rx="4" ry="1"/>',
  leftPanel: '<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="M7.5 3.5v13"/>',
  rightPanel: '<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="M12.5 3.5v13"/>',
  // no body: a dashed torso under a helmet
  noBody: '<circle cx="10" cy="5.5" r="3"/><path stroke-dasharray="2 2" d="M5 18v-5.5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3V18"/>',
};

export function createNavigation({ onToggle, onLink }) {
  const panelButton = (side, title) => el('button', { className: 'nav-panel-btn', title, onclick: () => toggle(side) }, svg(side === 'left' ? ICONS.leftPanel : ICONS.rightPanel));
  const btnLeft = panelButton('left', 'Modell-Leiste ein-/ausblenden (Taste [)'), btnRight = panelButton('right', 'Look-Leiste ein-/ausblenden (Taste ])');
  const title = el('span', { className: 'nav-title' }), views = el('div', { className: 'nav-views' });
  const bar = el('header', { id: 'navbar' }, btnLeft, el('b', { className: 'nav-brand', textContent: 'Roboter-Viewer' }), title, views, btnRight);
  const panel = (side, title) => {
    const body = el('div', { className: 'nav-body' }), foot = el('footer');
    const root = el('nav', { id: `nav-${side}`, className: 'nav-panel' }, el('header', {}, el('b', { textContent: title }),
      el('button', { className: 'nav-close', title: 'Leiste ausblenden', textContent: side === 'left' ? '«' : '»', onclick: () => toggle(side) })), body, foot);
    return { root, body, foot };
  };
  const left = panel('left', 'Modell'), right = panel('right', 'Look');
  document.body.append(bar, left.root, right.root);
  const stored = side => { try { return localStorage.getItem(`critic.nav.${side}`) !== 'closed'; } catch { return true; } };
  const open = { left: stored('left'), right: stored('right') };
  function apply() {
    document.body.classList.toggle('left-closed', !open.left);
    document.body.classList.toggle('right-closed', !open.right);
    btnLeft.classList.toggle('on', open.left);
    btnRight.classList.toggle('on', open.right);
  }
  function toggle(side, value = !open[side]) {
    open[side] = value;
    try { localStorage.setItem(`critic.nav.${side}`, value ? 'open' : 'closed'); } catch { /* private window */ }
    apply();
    onToggle?.();
  }
  apply();
  if (!open.left || !open.right) queueMicrotask(() => onToggle?.()); // viewport was sized with both panels open
  addEventListener('keydown', e => {
    if (e.target.closest?.('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '[') toggle('left');
    if (e.key === ']') toggle('right');
  });
  // plain clicks on a model link stay in the page; a new tab (middle click, Ctrl/Cmd) still opens the link
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a.nav-link');
    if (!a || !onLink || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    for (const other of document.querySelectorAll('a.nav-link.on')) other.classList.remove('on');
    a.classList.add('on');
    onLink(a.search);
  });
  const opened = new Map(); // section title → open, kept across pages

  return {
    left: left.foot, right: right.foot, // footers
    clear() {
      const scroll = [left.body.scrollTop, right.body.scrollTop];
      for (const e of [left.body, right.body, left.foot, right.foot, title, views]) e.replaceChildren();
      queueMicrotask(() => { [left.body.scrollTop, right.body.scrollTop] = scroll; });
    },
    section(side, title, isOpen = true) {
      const d = el('details', { className: 'nav-section', open: opened.get(title) ?? isOpen }, el('summary', { textContent: title }));
      d.addEventListener('toggle', () => opened.set(title, d.open));
      (side === 'left' ? left : right).body.append(d);
      return d;
    },
    // the shown model in the bar
    title(text) { title.textContent = text; },
    // Camera views in the bar: [{ view, label, onClick }], icons from ICONS
    views(items) {
      return items.map(it => {
        const b = el('button', { className: 'nav-icon-btn', title: it.label, onclick: it.onClick }, svg(ICONS[it.view]));
        b.dataset.view = it.view;
        views.append(b);
        return b;
      });
    },
    heading(parent, text) { parent.append(el('div', { className: 'nav-group', textContent: text })); },
    // Picture tiles: items [{ value, label, title?, img?, icon?, swatch?: [c, c], badge?, href? }], one chosen (value) or none; columns 2–4.
    // An item with href is a link to another page (onLink), the others call onChange.
    tiles(parent, items, value, onChange, { columns = 3, prefix = '' } = {}) {
      const grid = el('div', { className: 'nav-tiles', style: `--cols:${columns}` });
      const buttons = items.map(it => el(it.href ? 'a' : 'button', { className: (it.href ? 'nav-link ' : '') + 'nav-tile' + (it.value === value ? ' on' : ''),
        title: `${prefix}${it.title ?? it.label}`, ...(it.href ? { href: it.href } : { onclick: () => { set(it.value); onChange(it.value); } }) },
        it.img ? el('img', { src: it.img, alt: '', loading: 'lazy' }) : el('i', { className: 'nav-tile-fill', style: it.swatch ? `background: linear-gradient(135deg, ${it.swatch[0]} 50%, ${it.swatch[1]} 50%)` : '' },
          it.icon ? svg(ICONS[it.icon]) : null),
        it.badge ? el('b', { textContent: it.badge }) : null,
        el('span', {}, it.swatch && it.img ? el('i', { className: 'nav-swatch', style: `background: linear-gradient(135deg, ${it.swatch[0]} 50%, ${it.swatch[1]} 50%)` }) : null, it.label)));
      const set = v => buttons.forEach((b, i) => b.classList.toggle('on', items[i].value === v));
      grid.append(...buttons);
      parent.append(grid);
      return { set, elements: buttons };
    },
    // Segmented choice: options [{ value, label, title? }]
    choice(parent, label, options, value, onChange) {
      const row = el('div', { className: 'nav-row' }, el('label', { textContent: label }));
      const seg = el('div', { className: 'nav-seg' });
      const buttons = options.map(o => el('button', { title: o.title ?? '', className: o.value === value ? 'on' : '', textContent: o.label,
        onclick: () => { buttons.forEach(b => b.classList.remove('on')); buttons[options.indexOf(o)].classList.add('on'); onChange(o.value); } }));
      seg.append(...buttons);
      row.append(seg);
      parent.append(row);
      return { set: v => buttons.forEach((b, i) => b.classList.toggle('on', options[i].value === v)) };
    },
    buttons(parent, items) {
      const row = el('div', { className: 'nav-buttons' });
      const out = items.map(it => el('button', { textContent: it.label, title: it.title ?? '', onclick: it.onClick }));
      row.append(...out);
      parent.append(row);
      return out;
    },
    // live: call back on every movement; otherwise once on release (expensive rebuilds)
    slider(parent, label, { min, max, step, value, format = v => v, live = true }, onInput) {
      const out = el('output', { textContent: format(value) });
      const input = el('input', { type: 'range', min, max, step, value,
        oninput: () => { out.textContent = format(+input.value); if (live) onInput(+input.value); },
        onchange: () => { if (!live) onInput(+input.value); } });
      parent.append(el('div', { className: 'nav-row' }, el('label', { textContent: label }), input, out));
      return { set: v => { input.value = v; out.textContent = format(v); } };
    },
    // switch with a label (checkbox styled as toggle)
    toggle(parent, label, checked, onChange, title = '') {
      const input = el('input', { type: 'checkbox', checked, onchange: () => onChange(input.checked) });
      parent.append(el('label', { className: 'nav-check', title }, input, el('span', { textContent: label })));
      return { set: v => { input.checked = v; } };
    },
    note(parent, text) { parent.append(el('p', { className: 'nav-note', textContent: text })); },
    // Part tree: groups [{ id, label, meshes, children?: [{ id, label, meshes }] }]; actions: select, setVisible, isolate, frame.
    tree(parent, groups, actions) {
      parent.querySelector('.nav-tree')?.remove();
      const wrap = el('div', { className: 'nav-tree' });
      const filter = el('input', { type: 'search', placeholder: 'Teil suchen …', className: 'nav-filter' });
      const tools = el('div', { className: 'nav-buttons' },
        el('button', { textContent: 'Alle zeigen', onclick: () => { actions.showAll(); sync(); } }),
        el('button', { textContent: 'Auswahl aufheben', onclick: () => { actions.select(null); mark(null); } }));
      const list = el('ul');
      const rows = [];
      let selected = null;
      const mark = node => { selected = node; for (const r of rows) r.li.classList.toggle('sel', r.node === node); };
      const sync = () => { for (const r of rows) r.box.checked = r.node.meshes.some(m => m.visible); };
      const row = (node, depth) => {
        const box = el('input', { type: 'checkbox', checked: node.meshes.some(m => m.visible), title: 'Ein-/ausblenden',
          onchange: () => { actions.setVisible(node, box.checked); sync(); } });
        const name = el('button', { className: 'nav-part', title: `${node.meshes.length} Meshes – Klick hebt hervor`,
          onclick: () => { const n = selected === node ? null : node; actions.select(n); mark(n); } },
          node.id ? el('b', { textContent: node.id }) : null, el('span', { textContent: node.label }));
        const iso = el('button', { className: 'nav-icon', textContent: '◎', title: 'Isolieren (nur dieses Teil zeigen)', onclick: () => { actions.isolate(node); sync(); } });
        const zoom = el('button', { className: 'nav-icon', textContent: '⌖', title: 'Heranzoomen', onclick: () => actions.frame(node) });
        const li = el('li', { style: `--depth:${depth}` }, box, name, iso, zoom);
        rows.push({ li, node, box, text: `${node.id ?? ''} ${node.label}`.toLowerCase() });
        if (!node.children?.length) return li;
        const sub = el('ul', { hidden: true });
        const caret = el('button', { className: 'nav-caret', textContent: '▸', title: 'Aufklappen',
          onclick: () => { sub.hidden = !sub.hidden; caret.textContent = sub.hidden ? '▸' : '▾'; } });
        li.prepend(caret);
        for (const c of node.children) sub.append(row(c, depth + 1));
        return el('div', {}, li, sub);
      };
      for (const g of groups) list.append(row(g, 0));
      filter.oninput = () => {
        const q = filter.value.trim().toLowerCase();
        for (const r of rows) r.li.classList.toggle('dim', !!q && !r.text.includes(q));
        if (q) for (const u of list.querySelectorAll('ul')) u.hidden = false;
      };
      wrap.append(filter, tools, list);
      parent.append(wrap);
      return { sync };
    },
  };
}
