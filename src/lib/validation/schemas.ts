import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"]).default("BEGINNER"),
});

export const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"]),
  profileImage: z.string().optional(),
});

export const reservationSchema = z.object({
  courtId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const cancellationSchema = z.object({
  id: z.string().min(1),
  reason: z.string().max(240).optional(),
});

export const openPlayJoinSchema = z.object({
  sessionId: z.string().min(1),
});

export const courtSchema = z.object({
  name: z.string().min(2),
  courtNumber: z.coerce.number().int().positive(),
  type: z.enum(["INDOOR", "OUTDOOR"]),
  surface: z.string().min(2),
  description: z.string().min(10),
  amenities: z.string().min(2),
  imageUrl: z.string().url(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "INACTIVE"]),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const openPlaySchema = z.object({
  name: z.string().min(3),
  courtId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"]),
  maxPlayers: z.coerce.number().int().min(2).max(64),
  status: z.enum(["SCHEDULED", "CANCELLED", "COMPLETED"]).default("SCHEDULED"),
});
