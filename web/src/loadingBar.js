// Loading bar (0.20 "Livery"): a thin bar on top of the viewport while a model, helmet or skin loads. The first page load shows the
// bar from index.html already (#loading.on); the module adopts that element. The bar creeps towards 90 % while work runs (there is
// no byte count for cached GLBs or shader compiles), jumps to 100 % when the last job ends and fades out; a failed job turns it red
// with the message until the next job starts.
export function createLoadingBar() {
  let root = document.getElementById('loading');
  if (!root) {
    root = Object.assign(document.createElement('div'), { id: 'loading' });
    document.body.append(root);
  }
  if (!root.querySelector('.fill')) root.replaceChildren(Object.assign(document.createElement('div'), { className: 'fill' }), Object.assign(document.createElement('span'), { className: 'label' }));
  const fill = root.querySelector('.fill'), label = root.querySelector('.label');
  let jobs = root.classList.contains('on') ? 1 : 0, value = jobs ? 0.3 : 0, timer = null, hide = null;
  const set = v => { value = v; fill.style.transform = `scaleX(${v})`; };
  const creep = () => { set(value + (0.9 - value) * 0.08); };
  if (jobs) timer = setInterval(creep, 120);

  function start(text = 'Lädt …') {
    clearTimeout(hide);
    root.classList.remove('failed', 'done');
    if (!jobs++) {
      root.classList.add('on');
      set(0.08);
      timer = setInterval(creep, 120);
    }
    label.textContent = text;
  }
  function end() {
    if (jobs === 0 || --jobs) return;
    clearInterval(timer);
    set(1);
    root.classList.add('done');
    hide = setTimeout(() => { root.classList.remove('on', 'done'); set(0); }, 450);
  }
  function fail(message) {
    jobs = 0;
    clearInterval(timer);
    clearTimeout(hide);
    set(1);
    root.classList.add('on', 'failed');
    label.textContent = message;
    hide = setTimeout(() => { root.classList.remove('on', 'failed'); set(0); }, 6000);
  }
  // Runs work (a promise or async function) under the bar; errors are shown and passed on.
  async function track(work, text) {
    start(text);
    try {
      const out = await (typeof work === 'function' ? work() : work);
      end();
      return out;
    } catch (e) {
      fail(`Fehler: ${e.message ?? e}`);
      throw e;
    }
  }
  return { start, end, fail, track, get busy() { return jobs > 0; } };
}
