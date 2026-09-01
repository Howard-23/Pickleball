import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-foreground">PicklePro Club</p>
          <p className="mt-2">Premium court reservations and open play for active pickleball communities.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Phase 1</p>
          <p className="mt-2">Reservations, open play, dashboards, and notifications. Payments are intentionally excluded.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/courts">Courts</Link>
          <Link href="/open-play">Open Play</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
