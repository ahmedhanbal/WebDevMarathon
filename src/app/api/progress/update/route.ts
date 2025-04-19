import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { VideoProgress } from "@prisma/client";

// Define the update progress schema
const UpdateProgressSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  watchedSeconds: z.number().min(0, "Watched seconds must be a non-negative number"),
  isCompleted: z.boolean().optional(),
  totalDuration: z.number().min(0, "Total duration must be a non-negative number"),
});

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

    // Parse request body
    const body = await req.json();
    const validatedFields = UpdateProgressSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { videoId, courseId, watchedSeconds, isCompleted = false, totalDuration } = validatedFields.data;

    // Check if the user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Find or create a course progress record
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

    // Find or update video progress
    const existingVideoProgress = courseProgress.videoProgress.find(
      (vp: VideoProgress) => vp.videoId === videoId
    );

    let videoProgress;
    if (existingVideoProgress) {
      videoProgress = await db.videoProgress.update({
        where: { id: existingVideoProgress.id },
        data: {
          watchedSeconds,
          lastPosition: watchedSeconds,
          completed: isCompleted || watchedSeconds >= totalDuration * 0.9, // Mark as completed if watched 90% of video
          updatedAt: new Date(),
        },
      });
    } else {
      videoProgress = await db.videoProgress.create({
        data: {
          videoId,
          progressId: courseProgress.id,
          watchedSeconds,
          lastPosition: watchedSeconds,
          completed: isCompleted || watchedSeconds >= totalDuration * 0.9,
        },
      });
    }

    // Update the overall course progress
    // Get all videos in the course
    const courseVideos = await db.video.findMany({
      where: { courseId },
      orderBy: { position: "asc" },
    });

    // Get all video progress records for this course
    const allVideoProgress = await db.videoProgress.findMany({
      where: { progressId: courseProgress.id },
    });

    // Calculate overall progress percentage
    const totalVideos = courseVideos.length;
    const completedVideos = allVideoProgress.filter((vp: VideoProgress) => vp.completed).length;
    const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

    // Update course progress
    await db.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        progress: progressPercentage,
        lastAccessed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      videoProgress,
      courseProgress: {
        id: courseProgress.id,
        progress: progressPercentage,
      },
    });
  } catch (error) {
    console.error("[PROGRESS_UPDATE_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 