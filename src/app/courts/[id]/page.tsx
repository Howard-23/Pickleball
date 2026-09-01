import Image from "next/image";
import { notFound } from "next/navigation";
import { AvailabilityCalendar } from "@/components/booking/availability-calendar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getCourt, getCourtAvailability } from "@/lib/data";
import { titleCase } from "@/lib/utils";

export default async function CourtDetailPage(props: PageProps<"/courts/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const court = await getCourt(id);
  if (!court) notFound();
  const date = typeof searchParams?.date === "string" ? searchParams.date : new Date().toISOString().slice(0, 10);
  const slots = await getCourtAvailability(id, date);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image src={court.imageUrl} alt={court.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold">{court.name}</h1>
            <StatusBadge status={court.status} />
          </div>
          <p className="mt-3 text-muted-foreground">{court.description}</p>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-medium">Type:</span> {titleCase(court.type)}</p>
            <p><span className="font-medium">Surface:</span> {court.surface}</p>
            <p><span className="font-medium">Hours:</span> {court.openTime} - {court.closeTime}</p>
            <p><span className="font-medium">Amenities:</span> {court.amenities.join(", ")}</p>
          </div>
        </div>
        <AvailabilityCalendar courtId={id} date={date} slots={slots} />
      </div>
    </main>
  );
}
