import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function GET() { return NextResponse.json(readJson('products.json')); }
export async function POST(req) {
  const body = await req.json();
  if (!body.name || !body.price || !body.slug) return NextResponse.json({ error: 'Name, slug and price are required.' }, { status: 400 });
  const list = readJson('products.json');
  if (list.find(p => p.slug === body.slug)) return NextResponse.json({ error: 'Slug already exists.' }, { status: 400 });
  const p = { id: 'p' + Date.now(), slug: body.slug, name: body.name, category: body.category || 'Handbag', price: Number(body.price), oldPrice: body.oldPrice ? Number(body.oldPrice) : null, stock: Number(body.stock ?? 0), rating: 4.5, reviewsCount: 0, description: body.description || '', colors: body.colors || ['Black'], image: body.image || '', createdAt: new Date().toISOString().slice(0, 10), featured: !!body.featured };
  list.push(p); writeJson('products.json', list);
  return NextResponse.json(p, { status: 201 });
}
export async function PUT(req) {
  const body = await req.json();
  const list = readJson('products.json');
  const i = list.findIndex(p => p.id === body.id || p.slug === body.slug);
  if (i < 0) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  list[i] = { ...list[i], ...body, price: Number(body.price ?? list[i].price), oldPrice: body.oldPrice === '' ? null : (body.oldPrice != null ? Number(body.oldPrice) : list[i].oldPrice), stock: Number(body.stock ?? list[i].stock) };
  writeJson('products.json', list);
  return NextResponse.json(list[i]);
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const list = readJson('products.json').filter(p => p.id !== id && p.slug !== id);
  writeJson('products.json', list);
  return NextResponse.json({ ok: true });
}
