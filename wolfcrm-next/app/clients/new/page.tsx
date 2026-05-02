import { prisma } from '@/lib/prisma';
import { ClientFormComponent } from '@/components/client-form';

export default async function NewClientPage() {
  const zones = await prisma.zone.findMany({ orderBy: { sortOrder: 'asc' } });
  return <ClientFormComponent zones={zones} />;
}
