import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for handling successful payment
const SuccessPaymentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  sessionId: z.string().min(1, "Stripe Session ID is required"),
});

export async function POST(req: Request) {
  try {
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
    const validatedFields = SuccessPaymentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { courseId, sessionId } = validatedFields.data;

    // Find the course
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chatSession: {
          include: {
            participants: {
              select: {
                id: true,
              },
            },
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

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: "Already enrolled",
        enrollment: existingEnrollment,
      });
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        studentId: session.user.id,
        courseId,
        paymentId: sessionId,
        status: "ACTIVE",
      },
    });

    // Add student to course chat
    if (course.chatSession) {
      const isAlreadyParticipant = course.chatSession.participants.some(
        (participant: { id: string }) => participant.id === session.user.id
      );

      if (!isAlreadyParticipant) {
        await db.chatSession.update({
          where: { id: course.chatSession.id },
          data: {
            participants: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
      }
    }

    // Create initial course progress
    await db.courseProgress.create({
      data: {
        userId: session.user.id,
        courseId,
        progress: 0,
      },
    });

    return NextResponse.json({
      success: true,
      enrollment,
    });
  } catch (error) {
    console.error("[PAYMENT_SUCCESS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 