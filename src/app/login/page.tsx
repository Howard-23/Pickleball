import Link from "next/link";
import { LogIn } from "lucide-react";
import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Log in to PicklePro</CardTitle>
          <p className="text-sm text-muted-foreground">Reserve courts and manage open play from your dashboard.</p>
        </CardHeader>
        <CardContent>
          {error ? <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">Invalid email or password.</p> : null}
          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required defaultValue="demo@picklepro.test" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required defaultValue="password123" />
            </div>
            <Button className="w-full" type="submit">
              <LogIn className="h-4 w-4" />
              Log in
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here? <Link className="font-medium text-primary" href="/register">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
