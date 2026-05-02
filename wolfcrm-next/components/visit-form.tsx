'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function VisitForm({ clientId, defaultPrice, defaultPaymentMethod }: {
  clientId: string; defaultPrice: number; defaultPaymentMethod: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch(`/api/clients/${clientId}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="bg-wc-green text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-emerald-700 transition-colors">
          + Bezoek registreren
        </button>
      ) : (
        <div className="bg-white border border-wc-blue rounded-xl p-5">
          <h2 className="text-sm font-medium text-wc-text mb-4">Bezoek registreren</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-wc-text-sec mb-1">Datum</label>
              <input type="date" name="visitDate" defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue" />
            </div>
            <div>
              <label className="block text-xs text-wc-text-sec mb-1">Bedrag</label>
              <input type="number" step="0.01" name="amount" defaultValue={defaultPrice}
                className="w-full border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue" />
            </div>
            <div>
              <label className="block text-xs text-wc-text-sec mb-1">Betaalwijze</label>
              <select name="paymentMethod" defaultValue={defaultPaymentMethod}
                className="w-full border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue">
                <option value="cash">Cash</option>
                <option value="transfer">Overschrijving</option>
                <option value="invoice">Factuur</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-wc-text-sec mb-1">Status</label>
              <select name="paymentStatus" defaultValue="paid"
                className="w-full border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue">
                <option value="paid">Betaald</option>
                <option value="pending">Wacht op betaling</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-wc-text-sec mb-1">Notitie (optioneel)</label>
              <input type="text" name="notes" placeholder="Bijv. extra raam gedaan"
                className="w-full border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue" />
            </div>
            <div className="sm:col-span-3 flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-wc-text-sec hover:text-wc-text">Annuleer</button>
              <button type="submit" disabled={loading}
                className="bg-wc-green text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
                {loading ? 'Bezig...' : 'Bevestig bezoek'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
