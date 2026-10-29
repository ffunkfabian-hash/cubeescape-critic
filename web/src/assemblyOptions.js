export function resolveAssemblyOptions({ headset = 'on', body = 'none', exploded = '0' } = {}) {
  if (!['on', 'off'].includes(headset)) throw new Error(`Unknown headset ${JSON.stringify(headset)}`);
  if (!['none', 'shoulders', 'full', 'legacy', '1'].includes(body)) throw new Error(`Unknown body ${JSON.stringify(body)}`);
  const amount = Number(exploded);
  if (String(exploded).trim() === '' || !Number.isFinite(amount) || amount < 0 || amount > 1) throw new Error('Exploded amount must be between 0 and 1');
  return { headset, body: body === '1' ? 'legacy' : body, exploded: amount };
}
