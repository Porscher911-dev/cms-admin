import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection');

    if (!collection || !/^[a-zA-Z0-9_-]+$/.test(collection)) {
      return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { key: collection },
    });

    if (!store) {
      return NextResponse.json(null, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    return NextResponse.json(JSON.parse(store.value), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API GET db error:', err);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection');

    if (!collection || !/^[a-zA-Z0-9_-]+$/.test(collection)) {
      return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
    }

    const body = await req.json();
    const valueStr = JSON.stringify(body);

    await prisma.store.upsert({
      where: { key: collection },
      update: { value: valueStr },
      create: { key: collection, value: valueStr },
    });

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API POST db error:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
