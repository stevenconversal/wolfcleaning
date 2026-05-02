import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const zones = await prisma.zone.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { clients: true } } },
  });
  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.zone.count();
  const zone = await prisma.zone.create({
    data: {
      name: body.name,
      colorHex: body.colorHex || '#6D5DD3',
      sortOrder: count + 1,
    },
  });
  return NextResponse.json(zone, { status: 201 });
}
