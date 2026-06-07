import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const dataFile = path.join(process.cwd(), 'data', 'employees.json');

const initialEmployees = [
  { id: "E00", name: "Quản trị viên", role: "Administrator", systemRole: "DIRECTOR", department: "BOD", email: "admin@mrex.vn", phone: "0362777763", cccd: "", address: "", status: "ACTIVE", attendance: "100%", tasksCompleted: 0, tasksDelayed: 0 }
];

export async function GET() {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify(initialEmployees, null, 2));
      return NextResponse.json(initialEmployees, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data), {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('API GET employees error:', err);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API POST employees error:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
