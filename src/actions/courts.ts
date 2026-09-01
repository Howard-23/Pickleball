"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { courtSchema } from "@/lib/validation/schemas";

export async function saveCourtAction(formData: FormData) {
  await requireAdmin();
  const parsed = courtSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/courts?message=Invalid%20court%20details");
  const data = parsed.data;
  const payload = {
    ...data,
    amenities: data.amenities.split(",").map((item) => item.trim()).filter(Boolean),
  };
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.court.update({ where: { id }, data: payload });
  } else {
    await prisma.court.create({ data: payload });
  }
  revalidatePath("/admin/courts");
  revalidatePath("/courts");
}

export async function deactivateCourtAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.court.update({ where: { id }, data: { status: "INACTIVE" } });
  revalidatePath("/admin/courts");
  revalidatePath("/courts");
}
