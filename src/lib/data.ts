import { prisma } from "@/lib/db/prisma";
import { buildSlots } from "@/lib/booking/time";

const courtImages = [
  "https://images.unsplash.com/photo-1686721134997-a43d7de8de1a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1737231809989-aaaaedb8d757?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1686721134997-a43d7de8de1a?auto=format&fit=crop&crop=edges&w=1000&q=80",
  "https://images.unsplash.com/photo-1737231809989-aaaaedb8d757?auto=format&fit=crop&crop=faces&w=1000&q=80",
];

export const fallbackCourts = [1, 2, 3, 4].map((number) => ({
  id: `demo-court-${number}`,
  name: `Court ${number}`,
  courtNumber: number,
  type: number % 2 === 0 ? "OUTDOOR" : "INDOOR",
  surface: number % 2 === 0 ? "Cushioned acrylic" : "Professional indoor surface",
  description: "Competition-ready pickleball court with clear sightlines, bright lighting, and easy access to player amenities.",
  amenities: ["LED lighting", "Water station", "Paddle racks"],
  imageUrl: courtImages[number - 1],
  status: "AVAILABLE",
  openTime: "08:00",
  closeTime: "22:00",
}));

export const fallbackSessions = [
  { id: "demo-open-1", name: "Friday Night Open Play", skillLevel: "INTERMEDIATE", maxPlayers: 12, joined: 8, court: fallbackCourts[1], dateOffset: 3, start: "19:00", end: "21:00" },
  { id: "demo-open-2", name: "Saturday Morning Rally", skillLevel: "BEGINNER", maxPlayers: 16, joined: 10, court: fallbackCourts[2], dateOffset: 4, start: "09:00", end: "11:00" },
  { id: "demo-open-3", name: "Advanced Ladder Play", skillLevel: "ADVANCED", maxPlayers: 8, joined: 8, court: fallbackCourts[0], dateOffset: 6, start: "18:00", end: "20:00" },
].map((session) => {
  const date = new Date();
  date.setDate(date.getDate() + session.dateOffset);
  const iso = date.toISOString().slice(0, 10);
  return {
    ...session,
    date,
    startTime: new Date(`${iso}T${session.start}:00`),
    endTime: new Date(`${iso}T${session.end}:00`),
    status: "SCHEDULED",
    participants: Array.from({ length: session.joined }, (_, index) => ({ id: `${session.id}-${index}`, status: "JOINED" })),
  };
});

export async function getCourts() {
  try {
    const courts = await prisma.court.findMany({ orderBy: { courtNumber: "asc" } });
    return courts.length ? courts : fallbackCourts;
  } catch {
    return fallbackCourts;
  }
}

export async function getCourt(id: string) {
  try {
    const court = await prisma.court.findUnique({ where: { id } });
    return court ?? fallbackCourts.find((item) => item.id === id) ?? null;
  } catch {
    return fallbackCourts.find((item) => item.id === id) ?? null;
  }
}

export async function getCourtAvailability(courtId: string, date: string) {
  const court = await getCourt(courtId);
  if (!court) return [];

  const slots = buildSlots(date, court.openTime, court.closeTime);
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        courtId,
        status: "CONFIRMED",
        startTime: { lt: slots.at(-1)?.end },
        endTime: { gt: slots[0]?.start },
      },
    });

    return slots.map((slot) => ({
      ...slot,
      available: court.status === "AVAILABLE" && !reservations.some((reservation) => reservation.startTime < slot.end && reservation.endTime > slot.start),
    }));
  } catch {
    return slots.map((slot, index) => ({ ...slot, available: index % 4 !== 1 }));
  }
}

export async function getOpenPlaySessions() {
  try {
    const sessions = await prisma.openPlaySession.findMany({
      where: { startTime: { gte: new Date() } },
      include: { court: true, participants: { where: { status: "JOINED" } } },
      orderBy: { startTime: "asc" },
    });
    return sessions.length ? sessions : fallbackSessions;
  } catch {
    return fallbackSessions;
  }
}

export async function getDashboardData(userId: string) {
  const now = new Date();
  const [reservations, participants, notifications] = await Promise.all([
    prisma.reservation.findMany({ where: { userId }, include: { court: true }, orderBy: { startTime: "desc" } }),
    prisma.openPlayParticipant.findMany({ where: { userId }, include: { session: { include: { court: true, participants: { where: { status: "JOINED" } } } } }, orderBy: { joinedAt: "desc" } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return {
    reservations,
    participants,
    notifications,
    stats: {
      upcoming: reservations.filter((item) => item.status === "CONFIRMED" && item.startTime >= now).length,
      openPlay: participants.filter((item) => item.status === "JOINED" && item.session.startTime >= now).length,
      completed: reservations.filter((item) => item.status === "COMPLETED" || item.endTime < now).length,
      cancelled: reservations.filter((item) => item.status === "CANCELLED").length,
    },
  };
}
