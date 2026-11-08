import fs from 'fs';
import path from 'path';
export function dataPath(name) { return path.join(process.cwd(), 'data', name); }
export function readJson(name, fallback = []) {
  try { return JSON.parse(fs.readFileSync(dataPath(name), 'utf8')); } catch { return fallback; }
}
export function writeJson(name, data) { fs.writeFileSync(dataPath(name), JSON.stringify(data, null, 2)); }
export function formatBDT(n) { return '৳' + Number(n || 0).toLocaleString('en-US'); }
export function shippingFor(area, subtotal) {
  if (subtotal >= 3000) return 0;
  if (area === 'outside') return 120;
  return 60;
}
