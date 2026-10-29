export function resolveAssemblyOptions({ headset = 'on', exploded = '0' } = {}) {
  if (!['on', 'off'].includes(headset)) throw new Error(`Unknown headset ${JSON.stringify(headset)}`);
  const amount = Number(exploded);
  if (String(exploded).trim() === '' || !Number.isFinite(amount) || amount < 0 || amount > 1) throw new Error('Exploded amount must be between 0 and 1');
  return { headset, exploded: amount };
}
