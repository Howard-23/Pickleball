import { adminCreateReservationAction, cancelReservationAction } from "@/actions/reservations";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TCell, THead, TRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatTime } from "@/lib/utils";

export default async function AdminReservationsPage() {
  await requireAdmin();
  const [reservations, courts, users] = await Promise.all([
    prisma.reservation.findMany({ include: { court: true, user: true }, orderBy: { startTime: "desc" }, take: 80 }),
    prisma.court.findMany({ orderBy: { courtNumber: "asc" } }),
    prisma.user.findMany({ orderBy: { email: "asc" } }),
  ]);
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <Card>
        <CardHeader><CardTitle>Manual reservation</CardTitle></CardHeader>
        <CardContent>
          <form action={adminCreateReservationAction} className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2"><Label>User</Label><Select name="userId">{users.map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}</Select></div>
            <div className="space-y-2"><Label>Court</Label><Select name="courtId">{courts.map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}</Select></div>
            <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" required /></div>
            <div className="space-y-2"><Label>Start</Label><Input name="startTime" type="time" required /></div>
            <div className="space-y-2"><Label>End</Label><Input name="endTime" type="time" required /></div>
            <Button className="md:col-span-5" type="submit">Create Reservation</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All reservations</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <thead><TRow><THead>User</THead><THead>Court</THead><THead>Date</THead><THead>Time</THead><THead>Status</THead><THead /></TRow></thead>
            <tbody>
              {reservations.map((reservation) => (
                <TRow key={reservation.id}>
                  <TCell>{reservation.user.email}</TCell>
                  <TCell>{reservation.court.name}</TCell>
                  <TCell>{formatDate(reservation.startTime)}</TCell>
                  <TCell>{formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}</TCell>
                  <TCell><StatusBadge status={reservation.status} /></TCell>
                  <TCell>
                    {reservation.status === "CONFIRMED" ? (
                      <form action={cancelReservationAction}>
                        <input type="hidden" name="id" value={reservation.id} />
                        <input type="hidden" name="reason" value="Cancelled by admin" />
                        <Button size="sm" type="submit" variant="outline">Cancel</Button>
                      </form>
                    ) : null}
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
