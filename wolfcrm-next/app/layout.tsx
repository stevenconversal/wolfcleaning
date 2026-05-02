import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { NavLink } from '@/components/nav-link';

export const metadata: Metadata = {
  title: { default: 'Wolf CRM', template: '%s · Wolf CRM' },
  description: 'Field Service CRM voor zelfstandige buitendienstwerkers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="font-sans">
        <div className="min-h-screen bg-wc-surface">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-wc-border">
            <span className="font-serif font-semibold text-wc-text">Wolf CRM</span>
          </div>

          <div className="flex">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-56 flex-col bg-wc-sidebar min-h-screen fixed z-40">
              <div className="px-5 py-5 border-b border-white/5">
                <div className="font-serif font-semibold text-[#F5F3EF] text-base">Wolf CRM</div>
                <div className="text-[10px] text-[#A8A49A] uppercase tracking-wider mt-0.5">Field Service CRM</div>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-0.5">
                <NavLink href="/dashboard" icon="dashboard">Dashboard</NavLink>
                <NavLink href="/clients" icon="clients">Klanten</NavLink>
                <NavLink href="/zones" icon="zones">Zones</NavLink>
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:ml-56 min-h-screen pb-20 lg:pb-0">
              {children}
            </main>
          </div>

          {/* Mobile bottom nav */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-wc-border flex items-center justify-around z-50">
            <NavLink href="/dashboard" icon="dashboard" mobile>Dashboard</NavLink>
            <NavLink href="/clients" icon="clients" mobile>Klanten</NavLink>
            <NavLink href="/zones" icon="zones" mobile>Zones</NavLink>
          </div>
        </div>
      </body>
    </html>
  );
}
