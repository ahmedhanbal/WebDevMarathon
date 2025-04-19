import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for video creation
const CreateVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional(),
  duration: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
  transcriptContent: z.string().optional(),
});

// Add a video to a course
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const courseId = params.id;

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the course to check ownership
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
      select: { tutorId: true },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the user is the course owner
    if (existingCourse.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - You do not have permission to add videos to this course" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = CreateVideoSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, url, thumbnailUrl, duration, position, transcriptContent } = validatedFields.data;

    // Get the count of existing videos for positioning if not specified
    let videoPosition = position;
    if (videoPosition === undefined) {
      const videosCount = await db.video.count({
        where: { courseId },
      });
      videoPosition = videosCount;
    }

    // Create transcript if provided
    let transcriptId;
    if (transcriptContent) {
      const transcript = await db.transcript.create({
        data: {
          content: transcriptContent,
        },
      });
      transcriptId = transcript.id;
    }

    // Create the video
    const video = await db.video.create({
      data: {
        title,
        description,
        url,
        thumbnailUrl,
        duration,
        position: videoPosition,
        courseId,
        ...(transcriptId && { transcriptId }),
      },
      include: {
        transcript: true,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("[VIDEO_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get videos for a course
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const session = await auth();

    // Get the course to check access
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        tutorId: true,
        id: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if the user has access to the videos
    let hasAccess = false;

    if (session?.user) {
      // Tutor always has access
      if (session.user.id === course.tutorId) {
        hasAccess = true;
      } else {
        // Check if student is enrolled
        const enrollment = await db.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: session.user.id,
              courseId: course.id,
            },
          },
        });

        hasAccess = !!enrollment;
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You must be enrolled to access this course's videos" },
        { status: 403 }
      );
    }

    // Get videos with transcripts
    const videos = await db.video.findMany({
      where: { courseId },
      orderBy: { position: "asc" },
      include: {
        transcript: true,
      },
    });

    // For students, also include their progress for each video
    let videosWithProgress = videos;

    if (session?.user && session.user.id !== course.tutorId) {
      // Get the course progress record
      const courseProgress = await db.courseProgress.findUnique({
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

      if (courseProgress) {
        // Map progress to videos
        videosWithProgress = videos.map(video => {
          const progress = courseProgress.videoProgress.find(
            p => p.videoId === video.id
          );

          return {
            ...video,
            progress: progress ? {
              completed: progress.completed,
              watchedSeconds: progress.watchedSeconds,
              lastPosition: progress.lastPosition,
            } : null,
          };
        });
      }
    }

    return NextResponse.json(videosWithProgress);
  } catch (error) {
    console.error("[VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
