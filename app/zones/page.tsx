import { prisma } from '@/lib/prisma';
import { ZonesClient } from '@/components/zones-client';

export const dynamic = 'force-dynamic';

export default async function ZonesPage() {
  const zones = await prisma.zone.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { clients: true } } },
  });

  return <ZonesClient initialZones={zones} />;
}
