import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ClientFormComponent } from '@/components/client-form';

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const [client, zones] = await Promise.all([
    prisma.client.findUnique({ where: { id: params.id } }),
    prisma.zone.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);
  if (!client) notFound();
  return <ClientFormComponent zones={zones} client={client} />;
}
