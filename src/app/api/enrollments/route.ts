import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for enrolling in a course
const EnrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

// Enroll in a course
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

    // Only students can enroll in courses
    if (session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can enroll in courses" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = EnrollmentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { courseId } = validatedFields.data;

    // Check if the course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // If course has a price and price > 0, do not permit direct enrollment
    if (course.price && course.price > 0) {
      return NextResponse.json(
        { error: "This is a paid course. Please complete payment to enroll." },
        { status: 403 }
      );
    }

    // Check if the user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        studentId: session.user.id,
        courseId,
      },
    });

    // Create course progress record
    await db.courseProgress.create({
      data: {
        userId: session.user.id,
        courseId,
        progress: 0,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("[ENROLLMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user enrollments
export async function GET(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    // Get all enrollments for the user with course details
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId: session.user.id,
      },
      include: {
        course: {
          include: {
            tutor: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            tags: {
              select: {
                name: true,
              },
            },
            videos: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // Get progress data
    const progressData = await db.courseProgress.findMany({
      where: {
        userId: session.user.id,
        courseId: {
          in: enrollments.map(e => e.courseId),
        },
      },
    });

    // Map progress to enrollments
    const enrollmentsWithProgress = enrollments.map(enrollment => {
      const progress = progressData.find(p => p.courseId === enrollment.courseId);
      const videosCount = enrollment.course.videos.length;

      // Format the response
      return {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          thumbnail: enrollment.course.thumbnail,
          tutor: enrollment.course.tutor,
          tags: enrollment.course.tags.map(tag => tag.name),
          videosCount,
        },
        progress: progress?.progress || 0,
      };
    });

    // Filter by status if specified
    let filteredEnrollments = enrollmentsWithProgress;
    if (status === "completed") {
      filteredEnrollments = enrollmentsWithProgress.filter(e => e.progress === 100);
    } else if (status === "in-progress") {
      filteredEnrollments = enrollmentsWithProgress.filter(e => e.progress > 0 && e.progress < 100);
    } else if (status === "not-started") {
      filteredEnrollments = enrollmentsWithProgress.filter(e => e.progress === 0);
    }

    return NextResponse.json(filteredEnrollments);
  } catch (error) {
    console.error("[ENROLLMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
