"use client";

import { useState } from "react";
import { cancelReservationAction } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function CancellationModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Cancel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Reservation?</DialogTitle>
          <DialogDescription>Are you sure you want to cancel this reservation?</DialogDescription>
        </DialogHeader>
        <form action={cancelReservationAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <Textarea name="reason" placeholder="Optional cancellation reason" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Keep Reservation</Button>
            <Button type="submit" variant="destructive">Cancel Reservation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
