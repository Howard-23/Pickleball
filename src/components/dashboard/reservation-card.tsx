import { CancellationModal } from "@/components/booking/cancellation-modal";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatTime } from "@/lib/utils";

type ReservationCardProps = {
  reservation: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
    court: { name: string };
  };
};

export function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{reservation.court.name}</p>
          <p className="text-sm text-muted-foreground">{formatDate(reservation.startTime)}</p>
          <p className="text-sm text-muted-foreground">{formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={reservation.status} />
          {reservation.status === "CONFIRMED" ? <CancellationModal id={reservation.id} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}
