import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, paymentMethodLabels, paymentStatusLabels, paymentStatusColors } from '@/lib/utils';
import { VisitForm } from '@/components/visit-form';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      zone: true,
      visits: { orderBy: { visitDate: 'desc' }, take: 20 },
    },
  });

  if (!client) notFound();

  const totalRevenue = client.visits.reduce((sum, v) => sum + v.amount, 0);
  const visitCount = client.visits.length;
  const avgPerVisit = visitCount > 0 ? totalRevenue / visitCount : 0;
  const lastVisit = client.visits[0];
  const pendingPayments = client.visits.filter(v => v.paymentStatus === 'pending').reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="px-4 lg:px-7 py-6 pb-24 lg:pb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/clients" className="text-wc-blue font-medium">Klanten</Link>
        <span className="text-wc-text-ter">/</span>
        <span className="text-wc-text font-medium">{client.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-semibold flex-shrink-0"
            style={{ backgroundColor: (client.zone?.colorHex || '#6B6960') + '18', color: client.zone?.colorHex || '#6B6960' }}>
            {client.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-wc-text tracking-tight">{client.name}</h1>
            <p className="text-sm text-wc-text-sec mt-0.5">{client.address}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {client.zone && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: client.zone.colorHex + '18', color: client.zone.colorHex }}>
                  {client.zone.name}
                </span>
              )}
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-wc-border-light text-wc-text-sec">{client.frequencyWeeks}w</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${client.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {client.status === 'active' ? 'Actief' : 'Gepauzeerd'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/clients/${client.id}/edit`} className="border border-wc-border rounded-lg px-4 py-2 text-sm font-medium text-wc-text-sec hover:bg-wc-border-light transition-colors">Bewerken</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-wc-border rounded-xl overflow-hidden border border-wc-border mb-6">
        <div className="bg-white p-4"><div className="text-xs text-wc-text-ter uppercase tracking-wider">Totale omzet</div><div className="font-serif text-xl font-semibold text-wc-text mt-1">{formatCurrency(totalRevenue)}</div></div>
        <div className="bg-white p-4"><div className="text-xs text-wc-text-ter uppercase tracking-wider">Bezoeken</div><div className="font-serif text-xl font-semibold text-wc-text mt-1">{visitCount}</div></div>
        <div className="bg-white p-4"><div className="text-xs text-wc-text-ter uppercase tracking-wider">Gem/bezoek</div><div className="font-serif text-xl font-semibold text-wc-text mt-1">{formatCurrency(avgPerVisit)}</div></div>
        <div className="bg-white p-4"><div className="text-xs text-wc-text-ter uppercase tracking-wider">Laatste bezoek</div><div className="font-serif text-xl font-semibold text-wc-text mt-1">{lastVisit ? formatDate(lastVisit.visitDate) : '—'}</div></div>
        <div className="bg-white p-4"><div className="text-xs text-wc-text-ter uppercase tracking-wider">Openstaand</div><div className={`font-serif text-xl font-semibold mt-1 ${pendingPayments > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{formatCurrency(pendingPayments)}</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Contact info */}
        <div className="bg-white border border-wc-border rounded-xl">
          <div className="px-5 py-3.5 border-b border-wc-border-light"><h2 className="text-sm font-medium text-wc-text">Contactgegevens</h2></div>
          <div className="divide-y divide-wc-border-light">
            {client.contactPerson && <InfoRow label="Contactpersoon" value={client.contactPerson} />}
            {client.phone && <InfoRow label="Telefoon" value={client.phone} href={`tel:${client.phone}`} />}
            {client.email && <InfoRow label="E-mail" value={client.email} href={`mailto:${client.email}`} />}
            <InfoRow label="Tarief" value={`${formatCurrency(client.defaultPrice)} / beurt`} />
            <InfoRow label="Betaalwijze" value={paymentMethodLabels[client.paymentMethod] || client.paymentMethod} />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border border-wc-border rounded-xl">
          <div className="px-5 py-3.5 border-b border-wc-border-light"><h2 className="text-sm font-medium text-wc-text">Notitie</h2></div>
          <div className="p-5">
            {client.notes ? (
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 text-sm text-[#78350F] leading-relaxed">{client.notes}</div>
            ) : (
              <p className="text-sm text-wc-text-ter">Geen notities.</p>
            )}
          </div>
        </div>
      </div>

      {/* Visit form */}
      <VisitForm clientId={client.id} defaultPrice={client.defaultPrice} defaultPaymentMethod={client.paymentMethod} />

      {/* Visit history */}
      <div className="mt-4 bg-white border border-wc-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-wc-border-light"><h2 className="text-sm font-medium text-wc-text">Bezoekhistoriek</h2></div>
        {client.visits.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-wc-text-ter">Nog geen bezoeken.</div>
        ) : (
          <div className="divide-y divide-wc-border-light">
            {client.visits.map((v) => (
              <div key={v.id} className="flex items-center gap-4 px-5 py-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${v.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wc-text">{formatDate(v.visitDate)}</div>
                  {v.notes && <div className="text-xs text-wc-text-ter truncate">{v.notes}</div>}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentStatusColors[v.paymentStatus]}`}>
                  {paymentStatusLabels[v.paymentStatus]}
                </span>
                <div className="text-xs text-wc-text-ter">{paymentMethodLabels[v.paymentMethod]}</div>
                <div className="font-serif font-semibold text-sm text-wc-text w-14 text-right">{formatCurrency(v.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex justify-between px-5 py-3 text-sm">
      <span className="text-wc-text-sec">{label}</span>
      {href ? <a href={href} className="font-medium text-wc-blue">{value}</a> : <span className="font-medium text-wc-text">{value}</span>}
    </div>
  );
}
