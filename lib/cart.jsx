'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getUser } from './auth';
const CartCtx = createContext(null);
function syncActivity(user, cartItems, favItems) {
  if (!user?.id) return;
  fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, cart: cartItems, favorites: favItems }) }).catch(() => {});
}
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [favs, setFavs] = useState([]);
  const [user, setUserState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const syncRef = useRef({ cart: false, fav: false });
  useEffect(() => {
    const u = getUser(); setUserState(u);
    try { setItems(JSON.parse(localStorage.getItem('tos-cart') || '[]')); } catch {}
    try { setFavs(JSON.parse(localStorage.getItem('tos-fav') || '[]')); } catch {}
    if (u?.id) {
      fetch('/api/activity?userId=' + encodeURIComponent(u.id)).then(r => r.json()).then(a => {
        if (a.cart?.length) setItems(a.cart.map(c => ({ ...c, key: c.slug + '|' + (c.color || '') })));
        if (a.favorites?.length) setFavs(a.favorites);
      }).catch(() => {});
    }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem('tos-cart', JSON.stringify(items)); }, [items, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem('tos-fav', JSON.stringify(favs)); }, [favs, loaded]);
  // Sync to server whenever a logged-in user changes cart/favorites (debounced lightly by effect timing)
  useEffect(() => { if (loaded && user?.id) syncActivity(user, items, favs); }, [items, favs, loaded, user]);
  function setUser(u) { setUserState(u); if (u) { saveUserLocal(u); } }
  function saveUserLocal(u) { try { localStorage.setItem('tos-user', JSON.stringify(u)); } catch {} }
  function logoutUser() { setUserState(null); try { localStorage.removeItem('tos-user'); } catch {} }
  function add(product, qty = 1, color = '') {
    setItems(prev => {
      const key = product.slug + '|' + (color || product.colors?.[0] || '');
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: Math.min(i.qty + qty, 99) } : i);
      return [...prev, { key, slug: product.slug, name: product.name, price: product.price, image: product.image, color: color || product.colors?.[0] || '', qty, addedAt: new Date().toISOString() }];
    });
  }
  function setQty(key, qty) { setItems(prev => qty <= 0 ? prev.filter(i => i.key !== key) : prev.map(i => i.key === key ? { ...i, qty } : i)); }
  function remove(key) { setItems(prev => prev.filter(i => i.key !== key)); }
  function clear() { setItems([]); }
  function toggleFav(product) {
    setFavs(prev => {
      if (prev.find(f => f.slug === product.slug)) return prev.filter(f => f.slug !== product.slug);
      return [...prev, { slug: product.slug, name: product.name, price: product.price, image: product.image, color: product.colors?.[0] || '', qty: 1, addedAt: new Date().toISOString() }];
    });
  }
  function isFav(slug) { return favs.some(f => f.slug === slug); }
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal, favs, toggleFav, isFav, user, setUser, logoutUser }}>{children}</CartCtx.Provider>;
}
export function useCart() { return useContext(CartCtx); }
