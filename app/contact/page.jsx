'use client';
import { useState } from 'react';
import { IconCheckCircle, IconPhone } from '../../components/Icons';
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) { setErr(d.error || 'Could not send your message.'); return; }
    setMsg('Thank you! Your message has been sent — we will get back to you soon.'); setForm({ name: '', email: '', phone: '', message: '' });
  }
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl font-bold text-center">Contact Us</h1>
      <p className="text-gray-500 text-center mt-2">Questions about a bag, an order or delivery? Write to us — we reply as soon as we can.</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold">Your name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className="border border-gray-200 rounded-xl px-3.5 py-2.5 w-full mt-1" /></div>
            <div><label className="text-sm font-semibold">Email *</label><input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className="border border-gray-200 rounded-xl px-3.5 py-2.5 w-full mt-1" /></div>
          </div>
          <div><label className="text-sm font-semibold">Phone — Optional</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" className="border border-gray-200 rounded-xl px-3.5 py-2.5 w-full mt-1" /></div>
          <div><label className="text-sm font-semibold">Message *</label><textarea required value={form.message} onChange={e => set('message', e.target.value)} placeholder="Write your message here..." rows={5} className="border border-gray-200 rounded-xl px-3.5 py-2.5 w-full mt-1" /></div>
          {err && <p className="text-red-600 text-sm font-semibold">{err}</p>}
          {msg && <p className="bg-green-50 text-green-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><IconCheckCircle size={18} /> {msg}</p>}
          <button disabled={busy} className="w-full bg-maroon text-white font-bold py-3 rounded-full disabled:bg-gray-300">{busy ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2"><IconPhone size={16} /> You can also reach us on Facebook: Touch of Sabrina.</p>
    </div>
  );
}
