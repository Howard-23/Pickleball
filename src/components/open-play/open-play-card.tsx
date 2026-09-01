import { Users } from "lucide-react";
import { joinOpenPlayAction } from "@/actions/open-play";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatTime, titleCase } from "@/lib/utils";

type Session = {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  skillLevel: string;
  maxPlayers: number;
  status: string;
  court: { name: string };
  participants: { id: string; status: string }[];
};

export function OpenPlayCard({ session }: { session: Session }) {
  const joined = session.participants.filter((participant) => participant.status === "JOINED").length;
  const full = joined >= session.maxPlayers;
  const spots = Math.max(session.maxPlayers - joined, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{session.name}</CardTitle>
          <StatusBadge status={full ? "FULL" : session.status} />
        </div>
        <p className="text-sm text-muted-foreground">{session.court.name}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>{formatDate(session.startTime)}</p>
          <p>{formatTime(session.startTime)} - {formatTime(session.endTime)}</p>
          <p>Skill Level: <span className="font-medium text-foreground">{titleCase(session.skillLevel)}</span></p>
          <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {joined} / {session.maxPlayers} players</p>
          <p>{spots} spots remaining</p>
        </div>
        <form action={joinOpenPlayAction}>
          <input type="hidden" name="sessionId" value={session.id} />
          <Button className="w-full" disabled={full || session.status !== "SCHEDULED"} type="submit">Join Open Play</Button>
        </form>
      </CardContent>
    </Card>
  );
}
