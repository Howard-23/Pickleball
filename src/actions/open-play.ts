"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { combineDateAndTime } from "@/lib/booking/time";
import { prisma } from "@/lib/db/prisma";
import { openPlayJoinSchema, openPlaySchema } from "@/lib/validation/schemas";

export async function joinOpenPlayAction(formData: FormData) {
  const user = await requireUser();
  const parsed = openPlayJoinSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/open-play?message=Invalid%20session");

  const { sessionId } = parsed.data;
  try {
    await prisma.$transaction(async (tx) => {
      const session = await tx.openPlaySession.findUnique({
        where: { id: sessionId },
        include: { participants: { where: { status: "JOINED" } } },
      });
      if (!session || session.status !== "SCHEDULED") throw new Error("UNAVAILABLE");
      if (session.participants.length >= session.maxPlayers) throw new Error("FULL");

      await tx.openPlayParticipant.create({
        data: { userId: user.id, sessionId },
      });

      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Open Play joined",
          message: `You successfully joined ${session.name}.`,
        },
      });
    });
  } catch (error) {
    const message = error instanceof Error && error.message === "FULL" ? "This%20Open%20Play%20session%20is%20full" : error instanceof Error && error.message.includes("Unique") ? "You%20have%20already%20joined%20this%20session" : "You%20have%20already%20joined%20this%20session";
    redirect(`/open-play?message=${message}`);
  }

  revalidatePath("/open-play");
  revalidatePath("/dashboard");
  redirect("/dashboard?message=Open%20Play%20Joined");
}

export async function cancelOpenPlayAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const participant = await prisma.openPlayParticipant.findUnique({
    where: { id },
    include: { session: true },
  });
  if (!participant || (participant.userId !== user.id && user.role === "USER")) redirect("/dashboard?message=Not%20authorized");

  await prisma.openPlayParticipant.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  await prisma.notification.create({
    data: {
      userId: participant.userId,
      title: "Open Play participation cancelled",
      message: "Your Open Play spot has been released.",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/open-play");
}

export async function createOpenPlayAction(formData: FormData) {
  await requireAdmin();
  const parsed = openPlaySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/open-play?message=Invalid%20Open%20Play%20details");
  const data = parsed.data;
  await prisma.openPlaySession.create({
    data: {
      name: data.name,
      courtId: data.courtId,
      date: combineDateAndTime(data.date, data.startTime),
      startTime: combineDateAndTime(data.date, data.startTime),
      endTime: combineDateAndTime(data.date, data.endTime),
      skillLevel: data.skillLevel,
      maxPlayers: data.maxPlayers,
      status: data.status,
    },
  });
  revalidatePath("/admin/open-play");
  redirect("/admin/open-play?message=Open%20Play%20Created");
}

export async function cancelOpenPlaySessionAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.openPlaySession.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/admin/open-play");
}
