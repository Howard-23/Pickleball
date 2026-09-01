import { CourtGrid } from "@/components/courts/court-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCourts } from "@/lib/data";

export default async function CourtsPage() {
  const courts = await getCourts();
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Courts</p>
        <h1 className="mt-2 text-4xl font-bold">Reserve a court</h1>
      </div>
      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-5">
          <Select defaultValue=""><option value="">Indoor / Outdoor</option><option>INDOOR</option><option>OUTDOOR</option></Select>
          <Select defaultValue=""><option value="">Court type</option><option>Professional</option><option>Recreation</option></Select>
          <Input type="date" />
          <Input type="time" />
          <Select defaultValue=""><option value="">Availability</option><option>Available</option><option>Maintenance</option></Select>
        </CardContent>
      </Card>
      <CourtGrid courts={courts} />
    </main>
  );
}
