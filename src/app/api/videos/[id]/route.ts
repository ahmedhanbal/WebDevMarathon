import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

const UpdateVideoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.string().optional()
});

// PATCH: update video metadata
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get video + course for owner check
    const video = await db.video.findUnique({
      where: { id },
      include: { course: { select: { tutorId: true } } }
    });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    if (
      video.course.tutorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You are not authorized to update this video" },
        { status: 403 }
      );
    }
    const body = await req.json();
    const validatedFields = UpdateVideoSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }
    const { title, description, url, thumbnailUrl, duration } = validatedFields.data;
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (url !== undefined) updateData.url = url;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (duration !== undefined) updateData.duration = duration;
    const updated = await db.video.update({ where: { id }, data: updateData });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[VIDEO_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove video & associated transcript
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const video = await db.video.findUnique({
      where: { id },
      include: { course: { select: { tutorId: true } }, transcript: true }
    });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    if (
      video.course.tutorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You are not authorized to delete this video" },
        { status: 403 }
      );
    }
    // Delete the video and its transcript
    await db.$transaction([
      db.video.delete({ where: { id } }),
      video.transcriptId
        ? db.transcript.delete({ where: { id: video.transcriptId } })
        : undefined
    ].filter(Boolean));
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("[VIDEO_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
