'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart';
import { LogoLight } from '../../components/Logo';
import { IconUser } from '../../components/Icons';
export default function LoginPage() {
  const { setUser } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const r = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', ...form }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) { setErr(d.error || 'Login failed.'); return; }
    setUser(d); router.push('/account');
  }
  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="flex justify-center"><LogoLight size={52} /></div>
      <h1 className="font-serif text-3xl font-bold text-center mt-4">Welcome Back</h1>
      <p className="text-center text-sm text-gray-500 mt-1">Log in to see your favourites, bag and orders.</p>
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 mt-6 space-y-3">
        <div><label className="text-sm font-semibold">Email</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
        <div><label className="text-sm font-semibold">Password</label><input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
        {err && <p className="text-red-600 text-sm font-semibold">{err}</p>}
        <button disabled={busy} className="w-full bg-maroon text-white font-bold py-3 rounded-full disabled:bg-gray-300 flex items-center justify-center gap-2"><IconUser size={18} /> {busy ? 'Logging in...' : 'Login'}</button>
        <p className="text-xs text-gray-400 text-center">Demo customer: demo@touchofsabrina.local / demo123</p>
        <p className="text-sm text-center">No account yet? <Link href="/signup" className="text-maroon font-semibold underline">Create one — it takes 1 minute</Link></p>
      </form>
    </div>
  );
}
