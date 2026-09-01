import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { updateProfileAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default async function ProfilePage(props: PageProps<"/dashboard/profile">) {
  const sessionUser = await requireUser();
  const [user, searchParams] = await Promise.all([prisma.user.findUnique({ where: { id: sessionUser.id } }), props.searchParams]);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <p className="text-sm text-muted-foreground">Keep contact and skill details current for open play.</p>
        </CardHeader>
        <CardContent>
          {searchParams?.message ? <p className="mb-4 rounded-md bg-secondary p-3 text-sm">{searchParams.message}</p> : null}
          <form action={updateProfileAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={user?.firstName} required /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={user?.lastName} required /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Email</Label><Input name="email" defaultValue={user?.email} disabled /></div>
            <div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={user?.phone ?? ""} /></div>
            <div className="space-y-2"><Label>Skill Level</Label><Select name="skillLevel" defaultValue={user?.skillLevel}><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option><option>PROFESSIONAL</option></Select></div>
            <div className="space-y-2 sm:col-span-2"><Label>Profile Image</Label><Input name="profileImage" defaultValue={user?.profileImage ?? ""} /></div>
            <Button className="sm:col-span-2" type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
