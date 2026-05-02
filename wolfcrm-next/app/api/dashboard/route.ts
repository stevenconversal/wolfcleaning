import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
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

  return NextResponse.json({
    stats: {
      activeClients,
      revenueThisMonth: revenueResult._sum.amount || 0,
      visitsThisMonth,
      pendingPayments: pendingResult._sum.amount || 0,
    },
    recentVisits,
  });
}
