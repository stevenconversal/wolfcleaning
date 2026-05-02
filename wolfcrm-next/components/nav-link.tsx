'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const icons: Record<string, string> = {
  dashboard: '◻',
  clients: '👤',
  zones: '📍',
};

export function NavLink({ href, icon, children, mobile }: {
  href: string; icon: string; children: React.ReactNode; mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  if (mobile) {
    return (
      <Link href={href} className={clsx('flex flex-col items-center gap-1 px-4 py-1.5', active ? 'text-wc-blue' : 'text-wc-text-ter')}>
        <span className="text-lg">{icons[icon]}</span>
        <span className="text-[10px] font-medium">{children}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={clsx(
      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
      active ? 'bg-[#2A2A27] text-[#F5F3EF] font-medium' : 'text-[#A8A49A] hover:bg-[#1F1F1D] hover:text-[#F5F3EF]'
    )}>
      <span className="text-base">{icons[icon]}</span>
      {children}
    </Link>
  );
}
