import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = searchParams.get('collection');

    if (!collection || !/^[a-zA-Z0-9_-]+$/.test(collection)) {
      return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
    }

    const dataFile = path.join(process.cwd(), 'data', `${collection}.json`);

    if (!fs.existsSync(dataFile)) {
      return NextResponse.json(null, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const data = fs.readFileSync(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data), {
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

    const dataFile = path.join(process.cwd(), 'data', `${collection}.json`);
    const body = await req.json();

    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API POST db error:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
