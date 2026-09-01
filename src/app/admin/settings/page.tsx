import { saveSettingsAction } from "@/actions/settings";
import { requireAdmin } from "@/lib/auth/session";
import { getSettings } from "@/lib/booking/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <form action={saveSettingsAction} className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Booking</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Maximum advance booking days</Label><Select name="advanceBookingDays" defaultValue={settings.advanceBookingDays}><option>7</option><option>14</option><option>30</option><option>60</option></Select></div>
            <div className="space-y-2"><Label>Cancellation allowed</Label><Select name="cancellationAllowed" defaultValue={settings.cancellationAllowed}><option value="true">YES</option><option value="false">NO</option></Select></div>
            <div className="space-y-2"><Label>Cancellation cutoff hours</Label><Select name="cancellationCutoffHours" defaultValue={settings.cancellationCutoffHours}><option>1</option><option>2</option><option>6</option><option>12</option><option>24</option><option>48</option></Select></div>
            <div className="space-y-2"><Label>Maximum reservation duration</Label><Select name="maximumReservationHours" defaultValue={settings.maximumReservationHours}><option>1</option><option>2</option><option>3</option></Select></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Play</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Default capacity</Label><Input name="defaultOpenPlayCapacity" defaultValue={settings.defaultOpenPlayCapacity} /></div>
            <div className="space-y-2"><Label>Open Play duration</Label><Input name="openPlayDuration" defaultValue={settings.openPlayDuration ?? "2 hours"} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Website</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Business name</Label><Input name="businessName" defaultValue={settings.businessName} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input name="contactPhone" defaultValue={settings.contactPhone} /></div>
            <div className="space-y-2"><Label>Email</Label><Input name="contactEmail" defaultValue={settings.contactEmail} /></div>
            <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={settings.address} /></div>
          </CardContent>
        </Card>
        <Button type="submit">Save Settings</Button>
      </form>
    </main>
  );
}
