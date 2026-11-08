'use client';
import { createContext, useContext, useEffect, useState } from 'react';
const CartCtx = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('tos-cart') || '[]')); } catch {} setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem('tos-cart', JSON.stringify(items)); }, [items, loaded]);
  function add(product, qty = 1, color = '') {
    setItems(prev => {
      const key = product.slug + '|' + (color || product.colors?.[0] || '');
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: Math.min(i.qty + qty, 99) } : i);
      return [...prev, { key, slug: product.slug, name: product.name, price: product.price, image: product.image, color: color || product.colors?.[0] || '', qty }];
    });
  }
  function setQty(key, qty) { setItems(prev => qty <= 0 ? prev.filter(i => i.key !== key) : prev.map(i => i.key === key ? { ...i, qty } : i)); }
  function remove(key) { setItems(prev => prev.filter(i => i.key !== key)); }
  function clear() { setItems([]); }
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>{children}</CartCtx.Provider>;
}
export function useCart() { return useContext(CartCtx); }
