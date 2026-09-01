"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, requireAdmin } from "@/lib/auth/session";
import { combineDateAndTime, isWithinOperatingHours } from "@/lib/booking/time";
import { getSetting } from "@/lib/booking/settings";
import { prisma } from "@/lib/db/prisma";
import { cancellationSchema, reservationSchema } from "@/lib/validation/schemas";

export async function createReservationAction(formData: FormData) {
  const user = await requireUser();
  await createReservationForUser(formData, user.id, user.role !== "USER", "/dashboard?message=Reservation%20Created");
}

async function createReservationForUser(formData: FormData, actorUserId: string, canChooseUser = false, successPath = "/dashboard?message=Reservation%20Created") {
  const parsed = reservationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/courts?message=Invalid%20reservation%20details");

  const { courtId, date, startTime, endTime } = parsed.data;
  const targetUserId = canChooseUser && formData.get("userId") ? String(formData.get("userId")) : actorUserId;
  const start = combineDateAndTime(date, startTime);
  const end = combineDateAndTime(date, endTime);
  const advanceDays = Number(await getSetting("advanceBookingDays"));
  const maxHours = Number(await getSetting("maximumReservationHours"));
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + advanceDays);
  const durationHours = (end.getTime() - start.getTime()) / 36e5;

  const court = await prisma.court.findUnique({ where: { id: courtId } });
  if (!court || court.status !== "AVAILABLE") redirect(`/courts/${courtId}?message=Court%20is%20not%20available`);
  if (start < new Date() || start > maxDate) redirect(`/courts/${courtId}?message=Outside%20advance%20booking%20window`);
  if (durationHours <= 0 || durationHours > maxHours) redirect(`/courts/${courtId}?message=Invalid%20reservation%20duration`);
  if (!isWithinOperatingHours(start, end, court.openTime, court.closeTime)) redirect(`/courts/${courtId}?message=Outside%20operating%20hours`);

  try {
    await prisma.$transaction(async (tx) => {
      const conflict = await tx.reservation.findFirst({
        where: {
          courtId,
          status: "CONFIRMED",
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });
      if (conflict) throw new Error("CONFLICT");

      const reservation = await tx.reservation.create({
        data: {
          userId: targetUserId,
          courtId,
          date: start,
          startTime: start,
          endTime: end,
          paymentStatus: "NOT_REQUIRED",
        },
        include: { court: true },
      });

      await tx.notification.create({
        data: {
          userId: targetUserId,
          title: "Reservation confirmed",
          message: `Your reservation for ${reservation.court.name} is confirmed.`,
        },
      });
    });
  } catch (error) {
    const message = error instanceof Error && error.message === "CONFLICT" ? "This%20time%20slot%20has%20already%20been%20reserved" : "Something%20went%20wrong";
    redirect(`/courts/${courtId}?message=${message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/reservations");
  redirect(successPath);
}

export async function cancelReservationAction(formData: FormData) {
  const user = await requireUser();
  const parsed = cancellationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/reservations?message=Invalid%20request");

  const reservation = await prisma.reservation.findUnique({ where: { id: parsed.data.id } });
  if (!reservation) redirect("/dashboard/reservations?message=Reservation%20not%20found");
  if (reservation.userId !== user.id && user.role === "USER") redirect("/dashboard/reservations?message=Not%20authorized");

  const allowed = (await getSetting("cancellationAllowed")) === "true";
  const cutoffHours = Number(await getSetting("cancellationCutoffHours"));
  const cutoff = new Date(reservation.startTime);
  cutoff.setHours(cutoff.getHours() - cutoffHours);
  if (!allowed || new Date() > cutoff) redirect("/dashboard/reservations?message=You%20can%20no%20longer%20cancel%20this%20reservation");

  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason: parsed.data.reason || "Cancelled by user",
    },
  });
  await prisma.notification.create({
    data: {
      userId: reservation.userId,
      title: "Reservation cancelled",
      message: "Reservation cancelled successfully.",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reservations");
}

export async function adminCreateReservationAction(formData: FormData) {
  const admin = await requireAdmin();
  await createReservationForUser(formData, admin.id, true, "/admin/reservations?message=Reservation%20Created");
}
