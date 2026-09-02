import { NextResponse } from "next/server";
import { getExerciseById } from "@/domain/learning/english-a1/exercises";
import { submitExerciseAttempt } from "@/services/learning/exercise-attempt.service";
import { getCurrentUser } from "@/services/users/user.service";

type SubmitBody = {
  exerciseId?: string;
  answer?: string;
  durationMs?: number;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "loginRequired" }, { status: 401 });
  }

  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "invalidJson" }, { status: 400 });
  }

  const exerciseId = body.exerciseId?.trim() ?? "";
  const answer = body.answer?.trim() ?? "";

  if (!exerciseId || !answer) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!getExerciseById(exerciseId)) {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }

  try {
    const result = await submitExerciseAttempt(
      user.id,
      exerciseId,
      answer,
      body.durationMs ?? 0,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }
}
