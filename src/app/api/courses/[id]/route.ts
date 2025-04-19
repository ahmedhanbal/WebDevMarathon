import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

// Schema for course update
const UpdateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  longDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().nonnegative().optional(),
  duration: z.string().optional(),
});

// Get a single course by ID
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    // Get course with all related data
    const course = await db.course.findUnique({
      where: { id },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            expertise: true,
          },
        },
        tags: true,
        videos: {
          orderBy: { position: "asc" },
          include: {
            transcript: true,
          },
        },
        chatSession: {
          select: {
            id: true,
          }
        },
        _count: {
          select: {
            enrollments: true,
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

    // Check if the current user is enrolled in this course
    const session = await auth();
    let isEnrolled = false;

    if (session?.user) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: session.user.id,
            courseId: id,
          },
        },
      });

      isEnrolled = !!enrollment;
    }

    // Format response
    const formattedCourse = {
      ...course,
      isEnrolled,
      enrollmentsCount: course._count.enrollments,
      isTutor: session?.user?.id === course.tutorId,
      _count: undefined,
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error("[COURSE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a course
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Verify authentication and authorization
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the course to check ownership
    const existingCourse = await db.course.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the user is the course tutor
    if (existingCourse.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to update this course" },
        { status: 403 }
      );
    }

    // Validate the request body
    const body = await req.json();
    const validatedFields = UpdateCourseSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, longDescription, thumbnail, tags, price, duration } = validatedFields.data;

    // Update course basic info
    const updateData: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(longDescription !== undefined && { longDescription }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(price !== undefined && { price }),
      ...(duration !== undefined && { duration }),
    };

    // Update tags if provided
    if (tags) {
      // Delete existing tags
      await db.courseTag.deleteMany({
        where: { courseId: id },
      });

      // Add new tags
      updateData.tags = {
        create: tags.map(tag => ({
          name: tag,
        })),
      };
    }

    // Perform the update
    const updatedCourse = await db.course.update({
      where: { id },
      data: updateData,
      include: {
        tags: true,
        videos: {
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a course
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Verify authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the course to check ownership
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Verify the user is the course tutor or an admin
    if (existingCourse.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to delete this course" },
        { status: 403 }
      );
    }

    // Delete the course (cascade will handle related data)
    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
