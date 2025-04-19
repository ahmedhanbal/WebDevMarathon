import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  position: number;
}

// Schema for video creation
const VideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Valid video URL is required"),
  thumbnailUrl: z.string().url().optional(),
  duration: z.string().optional(),
});

// Get all videos for a course
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Find the course
    const course = await db.course.findUnique({
      where: { id },
      include: {
        videos: {
          orderBy: { position: "asc" },
          include: {
            transcript: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check authorization - must be tutor or enrolled student or admin
    if (session?.user) {
      const isTutor = course.tutorId === session.user.id;
      const isAdmin = session.user.role === "ADMIN";
      
      if (isTutor || isAdmin) {
        return NextResponse.json(course.videos);
      }

      // Check if user is enrolled
      const enrollment = await db.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: session.user.id,
            courseId: id,
          },
        },
      });

      if (enrollment) {
        return NextResponse.json(course.videos);
      }
    }

    // Return limited preview data for unenrolled users
    const previewVideos = course.videos.slice(0, 1).map((video: Video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      position: video.position,
      isPreview: true,
    }));

    return NextResponse.json(previewVideos);
  } catch (error) {
    console.error("[VIDEOS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a new video to a course
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Check if user is authenticated and is the course tutor
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the course to check ownership
    const course = await db.course.findUnique({
      where: { id },
      include: {
        videos: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the user is the course tutor or an admin
    if (course.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to add videos to this course" },
        { status: 403 }
      );
    }

    // Validate the request body
    const body = await req.json();
    const validatedFields = VideoSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, url, thumbnailUrl, duration } = validatedFields.data;

    // Determine position (place at the end)
    const position = course.videos.length;

    // Create a placeholder for transcript that will be filled later
    const transcript = await db.transcript.create({
      data: {
        content: "Transcript generation in progress..."
      }
    });

    // Create the video with transcript
    const video = await db.video.create({
      data: {
        title,
        description,
        url,
        thumbnailUrl,
        duration,
        position,
        courseId: id,
        transcriptId: transcript.id
      },
      include: {
        transcript: true,
      },
    });

    // In a real application, we would trigger asynchronous transcript generation here
    // and update the transcript record when completed.
    // For example:
    // await triggerTranscription(video.id, url, transcript.id);

    // Return the newly created video
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("[VIDEOS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update video order
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Check if user is authenticated and is the course tutor
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the course to check ownership
    const course = await db.course.findUnique({
      where: { id },
      select: { tutorId: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the user is the course tutor or an admin
    if (course.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to update videos in this course" },
        { status: 403 }
      );
    }

    // Validate the request body (expecting an array of {id, position} objects)
    const body = await req.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of video positions" },
        { status: 400 }
      );
    }

    // Perform updates in a transaction to ensure consistency
    const transaction = await db.$transaction(
      body.map((item: { id: string; position: number }) => 
        db.video.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[VIDEOS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
