
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const filePath = path.join(process.cwd(), 'src/app/data/products.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(jsonData);
    const product = products.find((p: any) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}
