import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clients = await prisma.client.findMany({
    include: { zone: true, _count: { select: { visits: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const client = await prisma.client.create({
    data: {
      name: body.name,
      address: body.address,
      phone: body.phone || null,
      email: body.email || null,
      contactPerson: body.contactPerson || null,
      defaultPrice: parseFloat(body.defaultPrice) || 0,
      paymentMethod: body.paymentMethod || 'cash',
      frequencyWeeks: parseInt(body.frequencyWeeks) || 4,
      notes: body.notes || null,
      status: body.status || 'active',
      zoneId: body.zoneId || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
