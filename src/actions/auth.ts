"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { profileSchema, registerSchema } from "@/lib/validation/schemas";

export async function signInAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=CredentialsSignin");
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/register?error=Please%20check%20your%20registration%20details");

  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) redirect("/register?error=That%20email%20is%20already%20registered");

  await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: await hash(data.password, 12),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      skillLevel: data.skillLevel,
    },
  });

  await signIn("credentials", {
    email: data.email.toLowerCase(),
    password: data.password,
    redirectTo: "/dashboard",
  });
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/profile?message=Invalid%20profile%20details");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      skillLevel: parsed.data.skillLevel,
      profileImage: String(formData.get("profileImage") ?? ""),
    },
  });
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?message=Profile%20updated");
}
