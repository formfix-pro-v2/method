// ============================================================
// ZOD SCHEMAS — centralized input validation for all API routes
// ============================================================

import { z } from "zod";

// ---- Check-in ----
export const checkinSchema = z.object({
  sleep: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  stress: z.number().int().min(1).max(10),
  time: z.string().max(20).optional(),
  symptoms: z.array(z.string().max(50)).max(20).default([]),
  date: z.string().optional(),
});

// ---- Session ----
export const sessionSchema = z.object({
  day: z.number().int().min(1).max(365),
  phase: z.enum(["foundation", "build", "strengthen", "master"]),
  title: z.string().max(200).optional(),
  exercises_count: z.number().int().min(0).max(50).default(0),
  duration_seconds: z.number().int().min(0).max(7200).default(0),
});

// ---- Journal ----
export const journalSchema = z.object({
  day: z.number().int().min(1).max(365),
  milestone: z.string().max(200).optional(),
  text: z.string().min(1).max(5000),
  mood: z.number().int().min(1).max(10).optional(),
});

// ---- Favorite ----
export const favoriteSchema = z.object({
  type: z.enum(["meal", "exercise"]),
  name: z.string().min(1).max(200),
});

// ---- Achievement ----
export const achievementSchema = z.object({
  achievement_id: z.string().min(1).max(100),
});

// ---- Subscription ----
export const subscriptionSchema = z.object({
  plan: z.enum(["glow", "elite"]),
});

// ---- Profile update ----
export const profileSchema = z.object({
  quizData: z.record(z.string(), z.unknown()).nullable().optional(),
  plan: z.enum(["free", "glow", "elite"]).default("free"),
  premium: z.boolean().default(false),
  currentDay: z.number().int().min(1).max(365).default(1),
  purchaseDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
});

// ---- Lead capture ----
export const leadSchema = z.object({
  email: z.string().email().max(320),
  source: z.string().max(100).optional(),
});

// ---- Reminder ----
export const reminderSchema = z.object({
  reminder_type: z.enum(["exercise", "checkin", "supplements", "water", "sleep"]),
  time_of_day: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format"),
  enabled: z.boolean().default(true),
  days_of_week: z.array(z.number().int().min(1).max(7)).default([1, 2, 3, 4, 5, 6, 7]),
});

// ============================================================
// HELPER — parse request body with Zod, return typed result or error
// ============================================================
import { NextResponse } from "next/server";

export async function validateBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<{ data: z.infer<T>; error: null } | { data: null; error: NextResponse }> {
  try {
    const raw = await request.json();
    const result = schema.safeParse(raw);

    if (!result.success) {
      const messages = result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return {
        data: null,
        error: NextResponse.json(
          { error: "Validation failed", details: messages },
          { status: 400 }
        ),
      };
    }

    return { data: result.data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }
}
