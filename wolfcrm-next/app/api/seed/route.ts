import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  // Clean
  await prisma.visit.deleteMany();
  await prisma.client.deleteMany();
  await prisma.zone.deleteMany();

  // Zones
  const zoneA = await prisma.zone.create({ data: { name: 'Zone A — Affligem', colorHex: '#6D5DD3', sortOrder: 1 } });
  const zoneB = await prisma.zone.create({ data: { name: 'Zone B — Asse / Ternat', colorHex: '#0D9488', sortOrder: 2 } });
  const zoneC = await prisma.zone.create({ data: { name: 'Zone C — Aalst', colorHex: '#D97706', sortOrder: 3 } });

  const clientsData = [
    { name: 'Fam. De Smedt', address: 'Kerkstraat 12, 1790 Affligem', defaultPrice: 24, frequencyWeeks: 4, paymentMethod: 'cash', zoneId: zoneA.id },
    { name: 'Bakkerij Lievens', address: 'Brusselsesteenweg 88, 1790 Affligem', defaultPrice: 45, frequencyWeeks: 4, paymentMethod: 'cash', zoneId: zoneA.id, contactPerson: 'Marc Lievens', phone: '0476 23 14 88', email: 'marc@bakkerijlievens.be', notes: 'Toegang via zij-ingang. Niet bellen vóór 8u30.' },
    { name: 'Mevr. Janssen', address: 'Molenbergstraat 5, 1730 Asse', defaultPrice: 32, frequencyWeeks: 8, paymentMethod: 'transfer', zoneId: zoneA.id },
    { name: 'Kantoor VDB nv', address: 'Industrielaan 22, 1740 Ternat', defaultPrice: 68, frequencyWeeks: 4, paymentMethod: 'invoice', zoneId: zoneA.id, contactPerson: 'Jan Van den Broeck' },
    { name: 'Fam. Wouters', address: 'Nieuwstraat 3, 1770 Liedekerke', defaultPrice: 28, frequencyWeeks: 8, paymentMethod: 'cash', zoneId: zoneA.id },
    { name: 'Huisarts Pieters', address: 'Marktplein 7, 1790 Affligem', defaultPrice: 35, frequencyWeeks: 4, paymentMethod: 'transfer', zoneId: zoneA.id },
    { name: 'Notaris Verbeke', address: 'Kasteelstraat 1, 1790 Affligem', defaultPrice: 42, frequencyWeeks: 4, paymentMethod: 'invoice', zoneId: zoneA.id },
    { name: "Frituur 't Hoekske", address: 'Steenweg 44, 1790 Affligem', defaultPrice: 30, frequencyWeeks: 4, paymentMethod: 'cash', zoneId: zoneA.id },
    { name: 'Apotheek De Wolf', address: 'Gemeenteplein 3, 1790 Affligem', defaultPrice: 38, frequencyWeeks: 8, paymentMethod: 'transfer', zoneId: zoneA.id },
    { name: 'Fam. Claes', address: 'Gentsesteenweg 55, 1730 Asse', defaultPrice: 35, frequencyWeeks: 4, paymentMethod: 'cash', zoneId: zoneB.id },
    { name: 'Kapsalon Brigitte', address: 'Stationsstraat 12, 1730 Asse', defaultPrice: 28, frequencyWeeks: 4, paymentMethod: 'cash', zoneId: zoneB.id },
    { name: 'Immokantoor Verbeke', address: 'Brusselsesteenweg 101, 1790 Affligem', defaultPrice: 95, frequencyWeeks: 4, paymentMethod: 'invoice', zoneId: zoneB.id },
    { name: 'Garage Jacobs', address: 'Dendermondesteenweg 44, 9300 Aalst', defaultPrice: 65, frequencyWeeks: 4, paymentMethod: 'invoice', zoneId: zoneC.id },
    { name: 'Fam. Mertens', address: 'Kerkweg 8, 9470 Denderleeuw', defaultPrice: 24, frequencyWeeks: 8, paymentMethod: 'cash', zoneId: zoneC.id },
  ];

  for (const data of clientsData) {
    const client = await prisma.client.create({ data });
    const now = new Date();
    let visitDate = new Date(now);
    visitDate.setMonth(visitDate.getMonth() - 6);

    while (visitDate < now) {
      await prisma.visit.create({
        data: {
          clientId: client.id,
          visitDate: new Date(visitDate),
          amount: data.defaultPrice,
          paymentMethod: data.paymentMethod,
          paymentStatus: visitDate > new Date(now.getTime() - 14 * 86400000) && Math.random() < 0.25 ? 'pending' : 'paid',
          durationMinutes: Math.floor(Math.random() * 25) + 10,
          completedAt: new Date(visitDate),
        },
      });
      visitDate.setDate(visitDate.getDate() + data.frequencyWeeks * 7);
    }
  }

  const clientCount = await prisma.client.count();
  const visitCount = await prisma.visit.count();

  return NextResponse.json({ message: `Seeded: ${clientCount} clients, ${visitCount} visits` });
}
