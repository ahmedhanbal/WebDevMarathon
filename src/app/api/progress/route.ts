import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for tracking progress
const ProgressSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  watchedSeconds: z.number().int().nonnegative(),
  position: z.number().int().nonnegative(),
  completed: z.boolean().optional(),
});

// Update video progress
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = ProgressSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { videoId, watchedSeconds, position, completed } = validatedFields.data;

    // Get the video to find the course
    const video = await db.video.findUnique({
      where: { id: videoId },
      select: { courseId: true },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const courseId = video.courseId;

    // Check if the user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment && session.user.role !== "TUTOR") {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Get or create course progress
    let courseProgress = await db.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      include: {
        videoProgress: true,
      },
    });

    if (!courseProgress) {
      courseProgress = await db.courseProgress.create({
        data: {
          userId: session.user.id,
          courseId,
          progress: 0,
        },
        include: {
          videoProgress: true,
        },
      });
    }

    // Update or create video progress
    const existingVideoProgress = courseProgress.videoProgress.find(
      (p) => p.videoId === videoId
    );

    if (existingVideoProgress) {
      // Update existing progress
      await db.videoProgress.update({
        where: { id: existingVideoProgress.id },
        data: {
          watchedSeconds: Math.max(existingVideoProgress.watchedSeconds, watchedSeconds),
          lastPosition: position,
          completed: completed ?? existingVideoProgress.completed,
        },
      });
    } else {
      // Create new progress
      await db.videoProgress.create({
        data: {
          videoId,
          progressId: courseProgress.id,
          watchedSeconds,
          lastPosition: position,
          completed: completed ?? false,
        },
      });
    }

    // Recalculate overall course progress
    const allVideos = await db.video.findMany({
      where: { courseId },
      select: { id: true },
    });

    const updatedVideoProgress = await db.videoProgress.findMany({
      where: {
        progressId: courseProgress.id,
        videoId: { in: allVideos.map((v) => v.id) },
      },
    });

    // Calculate percentage of completed videos
    const videosCount = allVideos.length;
    const completedCount = updatedVideoProgress.filter((p) => p.completed).length;
    const overallProgress = videosCount > 0 ? (completedCount / videosCount) * 100 : 0;

    // Update course progress
    await db.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        progress: overallProgress,
        lastAccessed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      progress: {
        courseId,
        videoId,
        completed: completed ?? existingVideoProgress?.completed ?? false,
        watchedSeconds,
        lastPosition: position,
        overallProgress,
      },
    });
  } catch (error) {
    console.error("[PROGRESS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
