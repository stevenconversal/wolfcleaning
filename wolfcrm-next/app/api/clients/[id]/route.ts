import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { zone: true, visits: { orderBy: { visitDate: 'desc' }, take: 20 } },
  });
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(client);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const client = await prisma.client.update({
    where: { id: params.id },
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

  return NextResponse.json(client);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.client.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
