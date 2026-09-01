import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Dumbbell, Users } from "lucide-react";
import { CourtGrid } from "@/components/courts/court-grid";
import { OpenPlayGrid } from "@/components/open-play/open-play-grid";
import { Button } from "@/components/ui/button";
import { getCourts, getOpenPlaySessions } from "@/lib/data";

export default async function Home() {
  const [courts, sessions] = await Promise.all([getCourts(), getOpenPlaySessions()]);

  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1737231809989-aaaaedb8d757?auto=format&fit=crop&w=1800&q=80" alt="Pickleball players rallying on an outdoor court" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,25,14,.88),rgba(15,25,14,.54),rgba(15,25,14,.2))]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 text-white sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Pickleball bookings made simple</p>
            <h1 className="text-5xl font-black tracking-normal sm:text-7xl">PLAY. BOOK. CONNECT.</h1>
            <p className="mt-5 text-lg text-white/85">Reserve your pickleball court or join an Open Play session with a few quick taps.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/courts">Reserve a Court</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/open-play">Join Open Play</Link></Button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Find Your Court</p>
            <h2 className="mt-2 text-3xl font-bold">Available courts</h2>
          </div>
          <Button asChild variant="outline"><Link href="/courts">View All</Link></Button>
        </div>
        <CourtGrid courts={courts.slice(0, 4)} />
      </section>
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">Open Play</p>
            <h2 className="mt-2 text-3xl font-bold">Upcoming sessions</h2>
          </div>
          <OpenPlayGrid sessions={sessions.slice(0, 3)} />
        </div>
      </section>
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">How It Works</p>
          <h2 className="mt-2 text-3xl font-bold">Three steps to game time</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Choose", text: "Select a court or Open Play session.", Icon: CalendarCheck },
            { title: "Reserve", text: "Book your preferred date and time.", Icon: Dumbbell },
            { title: "Play", text: "Show up and enjoy the game.", Icon: Users },
          ].map(({ title, text, Icon }) => (
            <div key={title} className="rounded-lg border bg-card p-6">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="about" className="bg-secondary py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Built for Phase 1 reservations</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Court reservations, open play, cancellation rules, history, notifications, and admin management work without payment processing. Payment fields are stored for a clean Phase 2 upgrade later.</p>
        </div>
      </section>
    </main>
  );
}
