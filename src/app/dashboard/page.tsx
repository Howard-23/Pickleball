import { CalendarCheck, History, Trophy, Users } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ReservationCard } from "@/components/dashboard/reservation-card";
import { CancelParticipationButton } from "@/components/open-play/cancel-participation-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTime } from "@/lib/utils";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const [user, searchParams] = await Promise.all([requireUser(), props.searchParams]);
  const data = await getDashboardData(user.id);
  const upcomingReservations = data.reservations.filter((item) => item.status === "CONFIRMED" && item.startTime >= new Date()).slice(0, 4);
  const upcomingOpenPlay = data.participants.filter((item) => item.status === "JOINED" && item.session.startTime >= new Date()).slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Dashboard</p>
        <h1 className="mt-2 text-4xl font-bold">Welcome back, {user.name}</h1>
        {searchParams?.message ? <p className="mt-4 rounded-md bg-secondary p-3 text-sm">{searchParams.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Upcoming Bookings" value={data.stats.upcoming} icon={CalendarCheck} />
        <DashboardCard title="Open Play Joined" value={data.stats.openPlay} icon={Users} />
        <DashboardCard title="Completed Games" value={data.stats.completed} icon={Trophy} />
        <DashboardCard title="Cancelled Bookings" value={data.stats.cancelled} icon={History} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Reservations</h2>
          <div className="grid gap-3">
            {upcomingReservations.length ? upcomingReservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />) : <EmptyState title="No reservations" message="Reserve a court to see it here." />}
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Open Play</h2>
          <div className="grid gap-3">
            {upcomingOpenPlay.length ? upcomingOpenPlay.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{participant.session.name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(participant.session.startTime)}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(participant.session.startTime)} - {formatTime(participant.session.endTime)}</p>
                    <p className="text-sm text-muted-foreground">{participant.session.participants.length} players</p>
                  </div>
                  <CancelParticipationButton id={participant.id} />
                </CardContent>
              </Card>
            )) : <EmptyState title="No Open Play" message="Join a session to see it here." />}
          </div>
        </section>
      </div>
      <Card className="mt-8">
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {data.notifications.length ? data.notifications.map((note) => (
            <div key={note.id} className="rounded-md border p-3">
              <p className="font-medium">{note.title}</p>
              <p className="text-sm text-muted-foreground">{note.message}</p>
            </div>
          )) : <p className="text-sm text-muted-foreground">No notifications yet.</p>}
        </CardContent>
      </Card>
    </main>
  );
}
