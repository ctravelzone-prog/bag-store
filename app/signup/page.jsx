'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart';
import { LogoLight } from '../../components/Logo';
export default function SignupPage() {
  const { setUser } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const r = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'signup', ...form }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) { setErr(d.error || 'Could not create your account.'); return; }
    setUser(d); router.push('/account');
  }
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="flex justify-center"><LogoLight size={52} /></div>
      <h1 className="font-serif text-3xl font-bold text-center mt-4">Create Your Account</h1>
      <p className="text-center text-sm text-gray-500 mt-1">Save favourites, keep your bag on any device, and track orders.</p>
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 mt-6 space-y-3">
        <div><label className="text-sm font-semibold">Full name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
        <div><label className="text-sm font-semibold">Email *</label><input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
        <div><label className="text-sm font-semibold">Phone *</label><input required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" className="border rounded-lg px-3 py-2.5 w-full mt-1" /><p className="text-xs text-gray-400 mt-1">Your 11-digit Bangladeshi mobile number.</p></div>
        <div><label className="text-sm font-semibold">Password *</label><input required type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 6 characters" className="border rounded-lg px-3 py-2.5 w-full mt-1" /></div>
        {err && <p className="text-red-600 text-sm font-semibold">{err}</p>}
        <button disabled={busy} className="w-full bg-maroon text-white font-bold py-3 rounded-full disabled:bg-gray-300">{busy ? 'Creating...' : 'Create Account'}</button>
        <p className="text-sm text-center">Already have an account? <Link href="/login" className="text-maroon font-semibold underline">Login</Link></p>
      </form>
    </div>
  );
}
