// Client-side user session (demo-only auth — see README). Stored as tos-user in localStorage.
export function getUser() { try { return JSON.parse(localStorage.getItem('tos-user') || 'null'); } catch { return null; } }
export function saveUser(u) { localStorage.setItem('tos-user', JSON.stringify(u)); }
export function clearUser() { localStorage.removeItem('tos-user'); }
