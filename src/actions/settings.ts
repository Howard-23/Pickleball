"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const entries = Array.from(formData.entries()).filter(([key]) => key !== "$ACTION_ID");
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), group: key.toLowerCase().includes("openplay") ? "openPlay" : key.toLowerCase().includes("business") || key.toLowerCase().includes("contact") || key === "address" ? "website" : "booking" },
      }),
    ),
  );
  revalidatePath("/admin/settings");
}
