import { deactivateCourtAction, saveCourtAction } from "@/actions/courts";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TCell, THead, TRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";

export default async function AdminCourtsPage() {
  await requireAdmin();
  const courts = await prisma.court.findMany({ orderBy: { courtNumber: "asc" } });
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.85fr_1.15fr]">
      <Card>
        <CardHeader><CardTitle>Add court</CardTitle></CardHeader>
        <CardContent>
          <form action={saveCourtAction} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
              <div className="space-y-2"><Label>Court Number</Label><Input name="courtNumber" type="number" required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Type</Label><Select name="type"><option>INDOOR</option><option>OUTDOOR</option></Select></div>
              <div className="space-y-2"><Label>Status</Label><Select name="status"><option>AVAILABLE</option><option>MAINTENANCE</option><option>INACTIVE</option></Select></div>
            </div>
            <div className="space-y-2"><Label>Surface</Label><Input name="surface" required /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea name="description" required /></div>
            <div className="space-y-2"><Label>Amenities</Label><Input name="amenities" placeholder="Lighting, water station, lockers" required /></div>
            <div className="space-y-2"><Label>Image URL</Label><Input name="imageUrl" type="url" required defaultValue="https://images.unsplash.com/photo-1686721134997-a43d7de8de1a?auto=format&fit=crop&w=1000&q=80" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Open</Label><Input name="openTime" type="time" defaultValue="08:00" required /></div>
              <div className="space-y-2"><Label>Close</Label><Input name="closeTime" type="time" defaultValue="22:00" required /></div>
            </div>
            <Button type="submit">Save Court</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Court management</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <thead><TRow><THead>Court</THead><THead>Type</THead><THead>Surface</THead><THead>Status</THead><THead /></TRow></thead>
            <tbody>
              {courts.map((court) => (
                <TRow key={court.id}>
                  <TCell>{court.name}</TCell>
                  <TCell>{court.type}</TCell>
                  <TCell>{court.surface}</TCell>
                  <TCell><StatusBadge status={court.status} /></TCell>
                  <TCell>
                    <form action={deactivateCourtAction}>
                      <input type="hidden" name="id" value={court.id} />
                      <Button size="sm" type="submit" variant="outline">Deactivate</Button>
                    </form>
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
