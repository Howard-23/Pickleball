import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function THead({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("h-11 px-4 text-left align-middle font-semibold text-muted-foreground", className)} {...props} />;
}

export function TCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}

export function TRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("border-b border-border transition-colors hover:bg-muted/40", className)} {...props} />;
}
