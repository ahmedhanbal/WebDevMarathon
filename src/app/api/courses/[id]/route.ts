import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

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

// Get a specific course
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            image: true,
            expertise: true,
          },
        },
        videos: {
          orderBy: { position: "asc" },
          include: {
            transcript: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 20,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                  },
                },
              },
            },
          },
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

    // Check if the current user is enrolled
    const session = await auth();
    let isEnrolled = false;
    let progress = 0;

    if (session?.user) {
      // If the user is the tutor, they have full access
      if (session.user.id === course.tutorId) {
        isEnrolled = true;
      } else {
        // Check if the user is enrolled
        const enrollment = await db.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: session.user.id,
              courseId: course.id,
            },
          },
        });

        isEnrolled = !!enrollment;

        // Get course progress if enrolled
        if (isEnrolled) {
          const courseProgress = await db.courseProgress.findUnique({
            where: {
              userId_courseId: {
                userId: session.user.id,
                courseId: course.id,
              },
            },
          });

          if (courseProgress) {
            progress = courseProgress.progress;
          }
        }
      }
    }

    // Format the response
    return NextResponse.json({
      ...course,
      tags: course.tags.map(tag => tag.name),
      enrollmentsCount: course._count.enrollments,
      isEnrolled,
      progress,
      _count: undefined,
    });
  } catch (error) {
    console.error("[COURSE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a course
export async function PATCH(
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
        { error: "Forbidden - You do not have permission to edit this course" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = UpdateCourseSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, longDescription, thumbnail, tags, price, duration } = validatedFields.data;

    // Update course
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(longDescription !== undefined && { longDescription }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
      },
      include: {
        tags: true,
      },
    });

    // Update tags if provided
    if (tags) {
      // Delete existing tags
      await db.courseTag.deleteMany({
        where: { courseId },
      });

      // Create new tags
      if (tags.length > 0) {
        await Promise.all(
          tags.map(tag =>
            db.courseTag.create({
              data: {
                name: tag,
                courseId,
              },
            })
          )
        );
      }
    }

    // Get the updated course with tags
    const courseWithTags = await db.course.findUnique({
      where: { id: courseId },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(courseWithTags);
  } catch (error) {
    console.error("[COURSE_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a course
export async function DELETE(
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

    // Verify the user is the course owner or an admin
    if (existingCourse.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - You do not have permission to delete this course" },
        { status: 403 }
      );
    }

    // Delete course (cascade will handle related entities)
    await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
