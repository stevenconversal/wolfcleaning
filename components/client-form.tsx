'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface Zone { id: string; name: string; colorHex: string; }

export function ClientFormComponent({ zones, client }: { zones: Zone[]; client?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!client;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const url = isEdit ? `/api/clients/${client.id}` : '/api/clients';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/clients/${data.id}`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="px-4 lg:px-7 py-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/clients" className="text-wc-blue font-medium">Klanten</Link>
        <span className="text-wc-text-ter">/</span>
        <span className="text-wc-text font-medium">{isEdit ? 'Bewerken' : 'Nieuwe klant'}</span>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-wc-text tracking-tight mb-6">
        {isEdit ? `${client.name} bewerken` : 'Nieuwe klant'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Basisgegevens">
          <Field label="Naam *">
            <input type="text" name="name" defaultValue={client?.name} required placeholder="Bijv. Bakkerij Lievens" className="input" />
          </Field>
          <Field label="Adres *">
            <input type="text" name="address" defaultValue={client?.address} required placeholder="Straat 123, Gemeente" className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Zone">
              <select name="zoneId" defaultValue={client?.zoneId || ''} className="input">
                <option value="">Geen zone</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </Field>
            <Field label="Frequentie (weken)">
              <select name="frequencyWeeks" defaultValue={client?.frequencyWeeks || 4} className="input">
                <option value="1">Wekelijks</option>
                <option value="2">2-wekelijks</option>
                <option value="4">4-wekelijks</option>
                <option value="8">8-wekelijks</option>
                <option value="12">12-wekelijks</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Contact">
          <Field label="Contactpersoon">
            <input type="text" name="contactPerson" defaultValue={client?.contactPerson} placeholder="Naam" className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefoon">
              <input type="tel" name="phone" defaultValue={client?.phone} placeholder="0476 12 34 56" className="input" />
            </Field>
            <Field label="E-mail">
              <input type="email" name="email" defaultValue={client?.email} placeholder="info@bedrijf.be" className="input" />
            </Field>
          </div>
        </Section>

        <Section title="Tarief en betaling">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarief per beurt (€)">
              <input type="number" step="0.01" name="defaultPrice" defaultValue={client?.defaultPrice || 35} className="input" />
            </Field>
            <Field label="Betaalwijze">
              <select name="paymentMethod" defaultValue={client?.paymentMethod || 'cash'} className="input">
                <option value="cash">Cash</option>
                <option value="transfer">Overschrijving</option>
                <option value="invoice">Factuur</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Notities">
          <Field label="Vrije notitie">
            <textarea name="notes" defaultValue={client?.notes} rows={3} placeholder="Bijv. toegang via zij-ingang, niet bellen voor 8u30..."
              className="input resize-none" />
          </Field>
        </Section>

        <div className="flex gap-3 pt-2">
          <Link href="/clients" className="px-5 py-2.5 text-sm font-medium text-wc-text-sec hover:text-wc-text">Annuleer</Link>
          <button type="submit" disabled={loading}
            className="bg-wc-blue text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-wc-blue-dark disabled:opacity-50 transition-colors">
            {loading ? 'Bezig...' : (isEdit ? 'Opslaan' : 'Klant aanmaken')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input { width:100%; border:1px solid #E8E5DE; border-radius:0.5rem; padding:0.5rem 0.75rem; font-size:0.875rem; color:#1A1A18; background:white; outline:none; }
        .input:focus { border-color:#1D4ED8; }
        .input::placeholder { color:#9C978C; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-wc-border rounded-xl p-5">
      <h2 className="text-xs font-medium text-wc-text-ter uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm text-wc-text-sec mb-1">{label}</label>{children}</div>;
}
