import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password123", 12);
  const [admin, staff, demo] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@picklepro.test" },
      update: {},
      create: { email: "admin@picklepro.test", firstName: "Avery", lastName: "Admin", role: "ADMIN", skillLevel: "ADVANCED", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "staff@picklepro.test" },
      update: {},
      create: { email: "staff@picklepro.test", firstName: "Sam", lastName: "Staff", role: "STAFF", skillLevel: "INTERMEDIATE", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "demo@picklepro.test" },
      update: {},
      create: { email: "demo@picklepro.test", firstName: "Drew", lastName: "Player", role: "USER", skillLevel: "BEGINNER", passwordHash },
    }),
  ]);

  const imageUrls = [
    "https://images.unsplash.com/photo-1686721134997-a43d7de8de1a?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1737231809989-aaaaedb8d757?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1686721134997-a43d7de8de1a?auto=format&fit=crop&crop=edges&w=1000&q=80",
    "https://images.unsplash.com/photo-1737231809989-aaaaedb8d757?auto=format&fit=crop&crop=faces&w=1000&q=80",
  ];

  const courts = await Promise.all(
    [1, 2, 3, 4].map((courtNumber) =>
      prisma.court.upsert({
        where: { courtNumber },
        update: {},
        create: {
          name: `Court ${courtNumber}`,
          courtNumber,
          type: courtNumber % 2 === 0 ? "OUTDOOR" : "INDOOR",
          surface: courtNumber % 2 === 0 ? "Cushioned acrylic" : "Professional indoor surface",
          description: "Competition-ready pickleball court with bright lighting, player benches, and clear boundary visibility.",
          amenities: ["LED lighting", "Water station", "Paddle racks"],
          imageUrl: imageUrls[courtNumber - 1],
          openTime: "08:00",
          closeTime: "22:00",
        },
      }),
    ),
  );

  const sessionSpecs = [
    ["Friday Night Open Play", 3, "19:00", "21:00", "INTERMEDIATE", 12, courts[1].id],
    ["Saturday Morning Open Play", 4, "09:00", "11:00", "BEGINNER", 16, courts[2].id],
    ["Advanced Ladder Play", 6, "18:00", "20:00", "ADVANCED", 8, courts[0].id],
  ] as const;

  for (const [name, offset, start, end, skillLevel, maxPlayers, courtId] of sessionSpecs) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const day = date.toISOString().slice(0, 10);
    await prisma.openPlaySession.create({
      data: {
        name,
        courtId,
        date: new Date(`${day}T${start}:00`),
        startTime: new Date(`${day}T${start}:00`),
        endTime: new Date(`${day}T${end}:00`),
        skillLevel,
        maxPlayers,
      },
    });
  }

  await prisma.notification.createMany({
    data: [
      { userId: demo.id, title: "Welcome to PicklePro", message: "Your demo account is ready for Phase 1 reservations." },
      { userId: admin.id, title: "Admin ready", message: "Court, reservation, open play, and settings management are available." },
      { userId: staff.id, title: "Staff ready", message: "You can access the operations dashboard." },
    ],
    skipDuplicates: true,
  });

  const settings = {
    advanceBookingDays: "14",
    cancellationAllowed: "true",
    cancellationCutoffHours: "2",
    maximumReservationHours: "2",
    defaultOpenPlayCapacity: "12",
    businessName: "PicklePro Club",
    contactEmail: "hello@picklepro.example",
    contactPhone: "(555) 012-2026",
    address: "128 Rally Lane, Court City, USA",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: "booking" },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
