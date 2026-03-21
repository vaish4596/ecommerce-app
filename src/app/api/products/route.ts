
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  try {
    const filePath = path.join(process.cwd(), 'src/app/data/products.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    let products = JSON.parse(jsonData);

    if (category && category !== 'All') {
      products = products.filter((p: any) => p.category === category);
    }

    if (query) {
      products = products.filter((p: any) => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
