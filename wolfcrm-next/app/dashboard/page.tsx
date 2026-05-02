import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency, formatDate, paymentStatusLabels, paymentStatusColors } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [activeClients, revenueResult, visitsThisMonth, pendingResult, recentVisits] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.visit.aggregate({ _sum: { amount: true }, where: { visitDate: { gte: startOfMonth } } }),
    prisma.visit.count({ where: { visitDate: { gte: startOfMonth } } }),
    prisma.visit.aggregate({ _sum: { amount: true }, where: { paymentStatus: 'pending' } }),
    prisma.visit.findMany({
      orderBy: { visitDate: 'desc' },
      take: 10,
      include: { client: { select: { id: true, name: true, address: true } } },
    }),
  ]);

  const stats = [
    { label: 'Actieve klanten', value: String(activeClients), accent: 'border-t-wc-blue' },
    { label: 'Omzet deze maand', value: formatCurrency(revenueResult._sum.amount || 0), accent: 'border-t-wc-green' },
    { label: 'Bezoeken', value: String(visitsThisMonth), accent: 'border-t-wc-amber' },
    { label: 'Openstaand', value: formatCurrency(pendingResult._sum.amount || 0), accent: 'border-t-red-500' },
  ];

  return (
    <div className="px-4 lg:px-7 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-wc-text tracking-tight">Dashboard</h1>
        <p className="text-sm text-wc-text-sec mt-1">Overzicht van deze maand</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white border border-wc-border rounded-xl p-4 border-t-[3px] ${s.accent}`}>
            <div className="text-xs text-wc-text-sec mb-1">{s.label}</div>
            <div className="font-serif text-2xl font-semibold text-wc-text tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-wc-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-wc-border-light flex items-center justify-between">
          <h2 className="text-sm font-medium text-wc-text">Recente bezoeken</h2>
          <Link href="/clients" className="text-xs text-wc-blue font-medium">Alle klanten →</Link>
        </div>
        {recentVisits.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-wc-text-ter">
            Nog geen bezoeken. <Link href="/clients/new" className="text-wc-blue font-medium">Maak je eerste klant aan →</Link>
          </div>
        ) : (
          <div className="divide-y divide-wc-border-light">
            {recentVisits.map((v) => (
              <Link key={v.id} href={`/clients/${v.clientId}`} className="flex items-center gap-4 px-5 py-3 hover:bg-wc-surface transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wc-text truncate">{v.client.name}</div>
                  <div className="text-xs text-wc-text-ter">{formatDate(v.visitDate)}</div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentStatusColors[v.paymentStatus] || ''}`}>
                  {paymentStatusLabels[v.paymentStatus]}
                </span>
                <div className="font-serif font-semibold text-wc-text text-sm">{formatCurrency(v.amount)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
