import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const visit = await prisma.visit.create({
    data: {
      clientId: params.id,
      visitDate: new Date(body.visitDate),
      amount: parseFloat(body.amount),
      paymentMethod: body.paymentMethod || 'cash',
      paymentStatus: body.paymentStatus || 'paid',
      notes: body.notes || null,
      durationMinutes: body.durationMinutes ? parseInt(body.durationMinutes) : null,
      completedAt: new Date(),
    },
  });

  return NextResponse.json(visit, { status: 201 });
}
