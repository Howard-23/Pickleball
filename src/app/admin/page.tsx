import { CalendarX, Grid3X3, Users, Volleyball } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  await requireAdmin();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [users, courts, todayReservations, upcomingOpenPlay, cancelledReservations] = await Promise.all([
    prisma.user.count(),
    prisma.court.count(),
    prisma.reservation.count({ where: { startTime: { gte: today, lt: tomorrow } } }),
    prisma.openPlaySession.count({ where: { startTime: { gte: new Date() }, status: "SCHEDULED" } }),
    prisma.reservation.count({ where: { status: "CANCELLED" } }),
  ]);
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-primary">Admin</p><h1 className="mt-2 text-4xl font-bold">Club operations</h1></div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link href="/admin/courts">Courts</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/reservations">Reservations</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/open-play">Open Play</Link></Button>
          <Button asChild><Link href="/admin/settings">Settings</Link></Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <DashboardCard title="Total Users" value={users} icon={Users} />
        <DashboardCard title="Total Courts" value={courts} icon={Grid3X3} />
        <DashboardCard title="Today's Reservations" value={todayReservations} icon={Volleyball} />
        <DashboardCard title="Upcoming Open Play" value={upcomingOpenPlay} icon={CalendarX} />
        <DashboardCard title="Cancelled Reservations" value={cancelledReservations} icon={CalendarX} />
      </div>
      <div className="mt-8 h-72 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold">Today&apos;s Activity</h2>
        <div className="mt-6 flex h-44 items-end gap-4">
          {[40, 72, 55, 88, 64, 92, 70].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${height}%` }} />)}
        </div>
      </div>
    </main>
  );
}
