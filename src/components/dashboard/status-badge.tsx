import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const variant = status.includes("CANCELLED") || status === "INACTIVE" ? "destructive" : status.includes("CONFIRMED") || status.includes("AVAILABLE") || status.includes("JOINED") || status.includes("SCHEDULED") ? "success" : "warning";
  return <Badge variant={variant}>{titleCase(status)}</Badge>;
}
