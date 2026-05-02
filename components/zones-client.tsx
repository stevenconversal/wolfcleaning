'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Zone { id: string; name: string; colorHex: string; sortOrder: number; _count: { clients: number } }

const COLORS = ['#6D5DD3', '#0D9488', '#D97706', '#1D4ED8', '#DC2626', '#059669', '#7C3AED', '#DB2777'];

export function ZonesClient({ initialZones }: { initialZones: Zone[] }) {
  const router = useRouter();
  const [zones, setZones] = useState(initialZones);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[initialZones.length % COLORS.length]);
  const [loading, setLoading] = useState(false);

  async function createZone(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, colorHex: newColor }),
    });
    if (res.ok) { setNewName(''); router.refresh(); }
    setLoading(false);
    const updated = await fetch('/api/zones').then(r => r.json());
    setZones(updated);
  }

  async function updateZone(id: string) {
    await fetch(`/api/zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, colorHex: editColor }),
    });
    setEditing(null);
    const updated = await fetch('/api/zones').then(r => r.json());
    setZones(updated);
  }

  async function deleteZone(id: string) {
    if (!confirm('Zone verwijderen? Klanten worden ontkoppeld.')) return;
    await fetch(`/api/zones/${id}`, { method: 'DELETE' });
    const updated = await fetch('/api/zones').then(r => r.json());
    setZones(updated);
  }

  return (
    <div className="px-4 lg:px-7 py-6 max-w-xl">
      <h1 className="font-serif text-2xl font-semibold text-wc-text tracking-tight mb-1">Zones</h1>
      <p className="text-sm text-wc-text-sec mb-6">Deel je werkgebied in zones in.</p>

      <div className="space-y-2 mb-6">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white border border-wc-border rounded-xl overflow-hidden">
            {editing === zone.id ? (
              <div className="flex items-center gap-3 p-3">
                <div className="flex gap-1.5 flex-shrink-0">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setEditColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${editColor === c ? 'border-wc-text' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                  className="flex-1 border border-wc-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-wc-blue" autoFocus />
                <button onClick={() => updateZone(zone.id)} className="text-xs font-medium text-wc-blue">Opslaan</button>
                <button onClick={() => setEditing(null)} className="text-xs text-wc-text-ter">Annuleer</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: zone.colorHex }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-wc-text">{zone.name}</div>
                  <div className="text-xs text-wc-text-ter">{zone._count.clients} klanten</div>
                </div>
                <button onClick={() => { setEditing(zone.id); setEditName(zone.name); setEditColor(zone.colorHex); }}
                  className="text-xs text-wc-text-sec hover:text-wc-text">Bewerken</button>
                <button onClick={() => deleteZone(zone.id)} className="text-xs text-red-500 hover:text-red-700">Verwijder</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={createZone} className="bg-white border border-dashed border-wc-border rounded-xl p-4">
        <div className="text-xs font-medium text-wc-text-ter uppercase tracking-wider mb-3">Nieuwe zone</div>
        <div className="flex gap-1.5 mb-3">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setNewColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${newColor === c ? 'border-wc-text scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Bijv. Zone A — Affligem"
            className="flex-1 border border-wc-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-wc-blue placeholder:text-wc-text-ter" />
          <button type="submit" disabled={!newName.trim() || loading}
            className="bg-wc-blue text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-wc-blue-dark disabled:opacity-30 transition-colors">
            Toevoegen
          </button>
        </div>
      </form>
    </div>
  );
}
