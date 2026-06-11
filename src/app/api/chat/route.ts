import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Lấy tất cả tin nhắn chung (nơi receiverRole là null hoặc "ALL") hoặc tin nhắn gửi trực tiếp đến/từ role này.
    // Để đơn giản cho MVP Chat, ta làm Group Chat chung cho toàn công ty.
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API GET chat error:', err);
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderName, senderRole, content, receiverRole } = body;

    if (!senderName || !senderRole || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderName,
        senderRole,
        content,
        receiverRole: receiverRole || null,
      },
    });

    return NextResponse.json(newMessage, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err: any) {
    console.error('API POST chat error:', err);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
