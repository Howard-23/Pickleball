import { OpenPlayCard } from "@/components/open-play/open-play-card";

export function OpenPlayGrid({ sessions }: { sessions: Parameters<typeof OpenPlayCard>[0]["session"][] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => <OpenPlayCard key={session.id} session={session} />)}
    </div>
  );
}
