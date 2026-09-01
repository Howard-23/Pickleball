import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { titleCase } from "@/lib/utils";

type CourtCardProps = {
  court: {
    id: string;
    name: string;
    courtNumber: number;
    type: string;
    surface: string;
    imageUrl: string;
    status: string;
    openTime: string;
    closeTime: string;
  };
};

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Image src={court.imageUrl} alt={`${court.name} pickleball court`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{court.name}</h3>
            <p className="text-sm text-muted-foreground">Court {court.courtNumber}</p>
          </div>
          <StatusBadge status={court.status} />
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {titleCase(court.type)}</p>
          <p>{court.surface}</p>
          <p>{court.openTime} - {court.closeTime}</p>
        </div>
        <Button asChild className="w-full">
          <Link href={`/courts/${court.id}`}>View Availability</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
