import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const zone = await prisma.zone.update({
    where: { id: params.id },
    data: { name: body.name, colorHex: body.colorHex },
  });
  return NextResponse.json(zone);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.zone.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
