// Left navigation (0.12 "Fusion"): models and variants, camera views, part tree and look in one collapsible side panel.
// The panel only builds DOM and calls back; main.js owns the scene. Hidden with ?ui=0 (headless checks) or collapsed by the
// user (remembered per browser), in both cases the viewport takes the full width (CSS variable --nav).
const el = (tag, props = {}, ...children) => {
  const e = Object.assign(document.createElement(tag), props);
  for (const c of children.flat()) if (c != null) e.append(c);
  return e;
};

export function createNavigation({ onToggle }) {
  const nav = el('nav', { id: 'nav' });
  const head = el('header', {}, el('b', { textContent: 'Roboter-Viewer' }), el('button', { className: 'nav-close', title: 'Navigation einklappen', textContent: '«', onclick: () => toggle(false) }));
  const body = el('div', { className: 'nav-body' });
  const foot = el('footer');
  nav.append(head, body, foot);
  const opener = el('button', { id: 'nav-open', title: 'Navigation ausklappen', textContent: '☰', onclick: () => toggle(true) });
  document.body.append(nav, opener);
  const remembered = (() => { try { return localStorage.getItem('critic.nav') !== 'closed'; } catch { return true; } })();
  function toggle(open) {
    document.body.classList.toggle('nav-closed', !open);
    try { localStorage.setItem('critic.nav', open ? 'open' : 'closed'); } catch { /* private window */ }
    onToggle?.();
  }
  document.body.classList.toggle('nav-closed', !remembered);
  if (!remembered) queueMicrotask(() => onToggle?.()); // viewport was sized with the panel open

  return {
    footer: foot,
    section(title, open = true) {
      const d = el('details', { className: 'nav-section', open }, el('summary', { textContent: title }));
      body.append(d);
      return d;
    },
    // List of links: [{ group, items: [{ label, hint, href, active }] }]
    links(parent, groups) {
      for (const g of groups) {
        parent.append(el('div', { className: 'nav-group', textContent: g.group }));
        for (const it of g.items) parent.append(el('a', { className: 'nav-link' + (it.active ? ' on' : ''), href: it.href, title: it.hint ?? '' },
          el('span', { textContent: it.label }), it.hint ? el('small', { textContent: it.hint }) : null));
      }
    },
    // Segmented choice: options [{ value, label }]
    choice(parent, label, options, value, onChange) {
      const row = el('div', { className: 'nav-row' }, el('label', { textContent: label }));
      const seg = el('div', { className: 'nav-seg' });
      const buttons = options.map(o => el('button', { textContent: o.label, title: o.title ?? '', className: o.value === value ? 'on' : '',
        onclick: () => { buttons.forEach(b => b.classList.remove('on')); btn(o).classList.add('on'); onChange(o.value); } }));
      const btn = o => buttons[options.indexOf(o)];
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
    toggle(parent, label, checked, onChange) {
      const input = el('input', { type: 'checkbox', checked, onchange: () => onChange(input.checked) });
      parent.append(el('label', { className: 'nav-check' }, input, el('span', { textContent: label })));
      return input;
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
