import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const initialEmployees = [
  { id: "E00", name: "Quản trị viên", role: "Administrator", systemRole: "DIRECTOR", department: "BOD", email: "admin@mrex.vn", phone: "0362777763", cccd: "", address: "", status: "ACTIVE", attendance: "100%", tasksCompleted: 0, tasksDelayed: 0 }
];

export async function GET() {
  try {
    const store = await prisma.store.findUnique({
      where: { key: 'employees' },
    });

    if (!store) {
      await prisma.store.create({
        data: {
          key: 'employees',
          value: JSON.stringify(initialEmployees),
        },
      });
      return NextResponse.json(initialEmployees, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    return NextResponse.json(JSON.parse(store.value), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API GET employees error:', err);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valueStr = JSON.stringify(body);

    await prisma.store.upsert({
      where: { key: 'employees' },
      update: { value: valueStr },
      create: { key: 'employees', value: valueStr },
    });

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API POST employees error:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
