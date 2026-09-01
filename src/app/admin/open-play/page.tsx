import { cancelOpenPlaySessionAction, createOpenPlayAction } from "@/actions/open-play";
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

export default async function AdminOpenPlayPage() {
  await requireAdmin();
  const [courts, sessions] = await Promise.all([
    prisma.court.findMany({ orderBy: { courtNumber: "asc" } }),
    prisma.openPlaySession.findMany({ include: { court: true, participants: { include: { user: true } } }, orderBy: { startTime: "asc" } }),
  ]);
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card>
        <CardHeader><CardTitle>Create Open Play</CardTitle></CardHeader>
        <CardContent>
          <form action={createOpenPlayAction} className="grid gap-4">
            <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue="Saturday Morning Open Play" required /></div>
            <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" required /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Start</Label><Input name="startTime" type="time" defaultValue="09:00" required /></div>
              <div className="space-y-2"><Label>End</Label><Input name="endTime" type="time" defaultValue="11:00" required /></div>
            </div>
            <div className="space-y-2"><Label>Skill Level</Label><Select name="skillLevel"><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option><option>PROFESSIONAL</option></Select></div>
            <div className="space-y-2"><Label>Maximum Players</Label><Input name="maxPlayers" type="number" defaultValue="16" required /></div>
            <div className="space-y-2"><Label>Court</Label><Select name="courtId">{courts.map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}</Select></div>
            <input type="hidden" name="status" value="SCHEDULED" />
            <Button type="submit">Create Session</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Open Play management</CardTitle></CardHeader>
        <CardContent className="space-y-6 overflow-x-auto">
          <Table>
            <thead><TRow><THead>Session</THead><THead>Date</THead><THead>Players</THead><THead>Status</THead><THead /></TRow></thead>
            <tbody>
              {sessions.map((session) => (
                <TRow key={session.id}>
                  <TCell>{session.name}<p className="text-xs text-muted-foreground">{session.court.name} · {formatTime(session.startTime)} - {formatTime(session.endTime)}</p></TCell>
                  <TCell>{formatDate(session.startTime)}</TCell>
                  <TCell>{session.participants.filter((p) => p.status === "JOINED").length} / {session.maxPlayers}</TCell>
                  <TCell><StatusBadge status={session.status} /></TCell>
                  <TCell>
                    <form action={cancelOpenPlaySessionAction}>
                      <input type="hidden" name="id" value={session.id} />
                      <Button size="sm" type="submit" variant="outline">Cancel</Button>
                    </form>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
          {sessions.map((session) => (
            <div key={`${session.id}-players`} className="rounded-lg border p-4">
              <h3 className="font-semibold">{session.name} Players</h3>
              <div className="mt-3 grid gap-2 text-sm">
                {session.participants.length ? session.participants.map((participant) => (
                  <p key={participant.id} className="flex justify-between gap-3 border-b pb-2">
                    <span>{participant.user.firstName} {participant.user.lastName}</span>
                    <span className="text-muted-foreground">{participant.user.skillLevel} · {participant.status}</span>
                  </p>
                )) : <p className="text-muted-foreground">No players joined yet.</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
