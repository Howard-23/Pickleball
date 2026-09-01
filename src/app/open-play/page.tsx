import { OpenPlayGrid } from "@/components/open-play/open-play-grid";
import { getOpenPlaySessions } from "@/lib/data";

export default async function OpenPlayPage(props: PageProps<"/open-play">) {
  const [sessions, searchParams] = await Promise.all([getOpenPlaySessions(), props.searchParams]);
  const message = searchParams?.message;
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Open Play</p>
        <h1 className="mt-2 text-4xl font-bold">Join upcoming sessions</h1>
        {message ? <p className="mt-4 rounded-md bg-secondary p-3 text-sm">{message}</p> : null}
      </div>
      <OpenPlayGrid sessions={sessions} />
    </main>
  );
}
