import { readJson } from './store';
// Delivered-order count for a user: match by userId, email or phone.
export function deliveredCountFor(userId, email, phone) {
  const orders = readJson('orders.json');
  return orders.filter(o => o.status === 'Delivered' && (
    (userId && o.userId === userId) ||
    (email && o.customer && o.customer.email && o.customer.email.toLowerCase() === String(email).toLowerCase()) ||
    (phone && o.customer && o.customer.phone === phone)
  )).length;
}
export function validateCoupon(code, user) {
  const c = readJson('coupons.json').find(x => x.code === String(code || '').trim().toUpperCase() && x.active);
  if (!c) return { ok: false, error: 'Invalid coupon code.' };
  const target = c.target || 'all';
  if (target === 'regular') {
    const n = deliveredCountFor(user?.id, user?.email, user?.phone);
    if (!user || n < 2) return { ok: false, error: 'This coupon is only for regular buyers (2 or more Delivered orders). You have ' + n + ' Delivered order(s).' };
  }
  if (target === 'customer') {
    if (!user || user.id !== c.targetUserId) return { ok: false, error: 'This coupon is only for ' + (c.targetUserName || 'one specific customer') + '.' };
  }
  return { ok: true, coupon: c };
}
