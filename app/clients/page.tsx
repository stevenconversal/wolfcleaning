import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency, statusLabels } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
};

export default async function ClientsPage({ searchParams }: { searchParams: { zone?: string; status?: string; q?: string } }) {
  const where: any = {};
  if (searchParams.zone) where.zoneId = searchParams.zone;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { address: { contains: searchParams.q } },
      { contactPerson: { contains: searchParams.q } },
    ];
  }

  const [clients, zones] = await Promise.all([
    prisma.client.findMany({
      where,
      include: { zone: true, _count: { select: { visits: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.zone.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="px-4 lg:px-7 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-wc-text tracking-tight">Klanten</h1>
          <p className="text-sm text-wc-text-sec mt-1">{clients.length} klanten</p>
        </div>
        <Link href="/clients/new" className="bg-wc-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-wc-blue-dark transition-colors">
          + Nieuwe klant
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-2 mb-4">
        <input type="text" name="q" defaultValue={searchParams.q} placeholder="Zoek klant..."
          className="border border-wc-border rounded-lg px-3 py-2 text-sm bg-white text-wc-text placeholder:text-wc-text-ter w-full sm:w-64 focus:outline-none focus:border-wc-blue" />
        <select name="zone" defaultValue={searchParams.zone || ''}
          className="border border-wc-border rounded-lg px-3 py-2 text-sm bg-white text-wc-text focus:outline-none focus:border-wc-blue"
          onChange={(e) => e.target.form?.submit()}>
          <option value="">Alle zones</option>
          {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <select name="status" defaultValue={searchParams.status || ''}
          className="border border-wc-border rounded-lg px-3 py-2 text-sm bg-white text-wc-text focus:outline-none focus:border-wc-blue"
          onChange={(e) => e.target.form?.submit()}
          <option value="">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="paused">Gepauzeerd</option>
          <option value="inactive">Inactief</option>
        </select>
      </form>

      {/* Client list */}
      <div className="bg-white border border-wc-border rounded-xl overflow-hidden">
        {clients.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-wc-text-ter">Geen klanten gevonden.</div>
        ) : (
          <div className="divide-y divide-wc-border-light">
            {clients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-wc-surface transition-colors">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: client.zone?.colorHex || '#9C978C' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wc-text">{client.name}</div>
                  <div className="text-xs text-wc-text-ter truncate">{client.address}</div>
                </div>
                <div className="hidden sm:block text-xs text-wc-text-ter">{client.frequencyWeeks}w</div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[client.status]}`}>
                  {statusLabels[client.status]}
                </span>
                <div className="font-serif font-semibold text-sm text-wc-text w-14 text-right">
                  {formatCurrency(client.defaultPrice)}
                </div>
                <svg className="w-4 h-4 text-wc-text-ter flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
