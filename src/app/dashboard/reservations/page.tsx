import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ReservationCard } from "@/components/dashboard/reservation-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ReservationsPage() {
  const user = await requireUser();
  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { court: true },
    orderBy: { startTime: "desc" },
  });
  const groups = {
    all: reservations,
    confirmed: reservations.filter((item) => item.status === "CONFIRMED"),
    completed: reservations.filter((item) => item.status === "COMPLETED" || item.endTime < new Date()),
    cancelled: reservations.filter((item) => item.status === "CANCELLED"),
  };
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold">Booking history</h1>
      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        {Object.entries(groups).map(([key, items]) => (
          <TabsContent key={key} value={key} className="mt-5 grid gap-3">
            {items.length ? items.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />) : <EmptyState title="Nothing here" message="No reservations match this filter." />}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
