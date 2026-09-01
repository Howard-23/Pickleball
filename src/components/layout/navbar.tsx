import Link from "next/link";
import { CalendarDays, LogOut, Menu, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const publicLinks = [
  ["Home", "/"],
  ["Courts", "/courts"],
  ["Open Play", "/open-play"],
  ["How It Works", "/#how-it-works"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
];

export async function Navbar() {
  const session = await auth();
  const links = session?.user ? [["Dashboard", "/dashboard"], ["My Reservations", "/dashboard/reservations"], ["Open Play", "/open-play"], ["Profile", "/dashboard/profile"]] : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </span>
          PicklePro Club
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Button key={href} asChild variant="ghost">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
          {session?.user?.role === "ADMIN" || session?.user?.role === "STAFF" ? (
            <Button asChild variant="ghost"><Link href="/admin">Admin</Link></Button>
          ) : null}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {session?.user ? (
            <form action={signOutAction}>
              <Button variant="outline" type="submit"><LogOut className="h-4 w-4" /> Logout</Button>
            </form>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Register</Link></Button>
            </>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="md:hidden" size="icon" variant="outline" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid gap-2 pt-6">
              {links.map(([label, href]) => (
                <Button key={href} asChild variant="ghost">
                  <Link href={href}>{label}</Link>
                </Button>
              ))}
              {session?.user ? (
                <form action={signOutAction}>
                  <Button className="w-full" variant="outline" type="submit"><LogOut className="h-4 w-4" /> Logout</Button>
                </form>
              ) : (
                <Button asChild><Link href="/login"><CalendarDays className="h-4 w-4" /> Login</Link></Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
