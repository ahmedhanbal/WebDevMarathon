import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

// Define valid enrollment statuses
type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";

// Schema for updating enrollment status
const UpdateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"]),
});

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = UpdateStatusSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = validatedFields.data;

    // Find the enrollment
    const enrollment = await db.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            tutorId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Check authorization - only student or tutor can update enrollment
    const isStudent = enrollment.studentId === session.user.id;
    const isTutor = enrollment.course.tutorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isStudent && !isTutor && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to update this enrollment" },
        { status: 403 }
      );
    }

    // Apply different rules based on user role
    if (isStudent && !["PAUSED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Students can only pause or cancel enrollments" },
        { status: 400 }
      );
    }

    // Update enrollment status
    const updatedEnrollment = await db.enrollment.update({
      where: { id },
      data: { status: status as EnrollmentStatus },
    });

    // If cancelled, remove student from chat session
    if (status === "CANCELLED") {
      // Find course chat session
      const course = await db.course.findUnique({
        where: { id: enrollment.courseId },
        select: {
          chatSession: {
            select: {
              id: true,
            }
          }
        }
      });

      if (course?.chatSession) {
        await db.chatSession.update({
          where: { id: course.chatSession.id },
          data: {
            participants: {
              disconnect: {
                id: enrollment.studentId,
              }
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("[ENROLLMENT_STATUS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
 