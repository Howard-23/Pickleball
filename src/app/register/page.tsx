import Link from "next/link";
import { UserPlus } from "lucide-react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default async function RegisterPage(props: PageProps<"/register">) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <p className="text-sm text-muted-foreground">Phase 1 accounts are free. No payment details are collected.</p>
        </CardHeader>
        <CardContent>
          {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
          <form action={registerAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill level</Label>
              <Select id="skillLevel" name="skillLevel" defaultValue="BEGINNER">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="PROFESSIONAL">Professional</option>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <Button className="sm:col-span-2" type="submit">
              <UserPlus className="h-4 w-4" />
              Register
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already registered? <Link className="font-medium text-primary" href="/login">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
