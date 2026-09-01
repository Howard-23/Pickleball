import { prisma } from "@/lib/db/prisma";

const defaults: Record<string, string> = {
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

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? defaults[key];
}

export async function getSettings() {
  const settings = await prisma.setting.findMany();
  return { ...defaults, ...Object.fromEntries(settings.map((setting) => [setting.key, setting.value])) };
}
