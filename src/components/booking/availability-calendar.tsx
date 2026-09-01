import { Calendar, Clock } from "lucide-react";
import { createReservationAction } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/lib/utils";

type Slot = { start: Date; end: Date; label: string; endLabel: string; available: boolean };

export function AvailabilityCalendar({ courtId, date, slots }: { courtId: string; date: string; slots: Slot[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Availability</CardTitle>
        <form className="flex flex-col gap-3 sm:flex-row">
          <Input name="date" type="date" defaultValue={date} />
          <Button type="submit" variant="outline">Check Date</Button>
        </form>
      </CardHeader>
      <CardContent className="grid gap-3">
        {slots.map((slot) => (
          <div key={slot.label} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-medium"><Clock className="h-4 w-4" /> {formatTime(slot.start)} - {formatTime(slot.end)}</p>
              <p className={slot.available ? "text-sm text-emerald-700" : "text-sm text-muted-foreground"}>{slot.available ? "Available" : "Reserved"}</p>
            </div>
            {slot.available ? (
              <form action={createReservationAction}>
                <input type="hidden" name="courtId" value={courtId} />
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="startTime" value={slot.label} />
                <input type="hidden" name="endTime" value={slot.endLabel} />
                <Button type="submit">Reserve</Button>
              </form>
            ) : (
              <Button disabled variant="outline">Unavailable</Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
