import { CourtCard } from "@/components/courts/court-card";

export function CourtGrid({ courts }: { courts: Parameters<typeof CourtCard>[0]["court"][] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {courts.map((court) => <CourtCard key={court.id} court={court} />)}
    </div>
  );
}
