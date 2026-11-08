'use client';
import { useState } from 'react';
export default function ProductImage({ src, alt, className }) {
  const [err, setErr] = useState(false);
  const [cur, setCur] = useState(src);
  if (err) return <div className={(className || '') + ' flex items-center justify-center bg-gradient-to-br from-maroon to-black text-gold font-serif text-2xl'}>Touch of Sabrina</div>;
  return <img src={cur} alt={alt} className={className} loading="lazy" onError={() => setErr(true)} />;
}
