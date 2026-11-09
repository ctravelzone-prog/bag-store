import { NextResponse } from 'next/server';
import { readJson, writeJson } from '../../../lib/store';
export async function GET() { return NextResponse.json(readJson('categories.json')); }
export async function POST(req) {
  const b = await req.json();
  const name = String(b.name || '').trim();
  if (!name) return NextResponse.json({ error: 'Please enter a category name.' }, { status: 400 });
  const list = readJson('categories.json');
  if (list.find(c => c.name.toLowerCase() === name.toLowerCase())) return NextResponse.json({ error: 'This category already exists.' }, { status: 400 });
  const c = { id: 'cat-' + Date.now().toString(36), name, description: String(b.description || '').trim(), icon: String(b.icon || 'bag') };
  list.push(c); writeJson('categories.json', list);
  return NextResponse.json(c, { status: 201 });
}
export async function PUT(req) {
  const b = await req.json();
  const list = readJson('categories.json');
  const i = list.findIndex(c => c.id === b.id);
  if (i < 0) return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  const name = String(b.name || '').trim();
  if (!name) return NextResponse.json({ error: 'Please enter a category name.' }, { status: 400 });
  list[i] = { ...list[i], name, description: String(b.description || '').trim(), icon: String(b.icon || list[i].icon || 'bag') };
  writeJson('categories.json', list);
  return NextResponse.json(list[i]);
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const products = readJson('products.json');
  const cat = readJson('categories.json').find(c => c.id === id);
  const inUse = cat ? products.filter(p => p.category === cat.name) : [];
  if (inUse.length > 0) return NextResponse.json({ error: 'Cannot delete "' + cat.name + '" — ' + inUse.length + ' product(s) still use this category. Move or delete those products first.' }, { status: 400 });
  writeJson('categories.json', readJson('categories.json').filter(c => c.id !== id));
  return NextResponse.json({ ok: true });
}
