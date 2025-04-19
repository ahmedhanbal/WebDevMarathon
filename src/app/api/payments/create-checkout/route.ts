import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { z } from "zod";

// Schema for checkout session creation
const CheckoutSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Create a checkout session for course enrollment
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

    // Only students can purchase courses
    if (session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can purchase courses" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = CheckoutSchema.safeParse(body);

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
      include: {
        tutor: {
          select: {
            name: true,
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

    // Check that the course has a price
    if (!course.price) {
      return NextResponse.json(
        { error: "Course has no price" },
        { status: 400 }
      );
    }

    // Get the client's origin URL for redirects
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(course.price * 100), // Convert to cents
            product_data: {
              name: course.title,
              description: course.description,
              images: course.thumbnail ? [course.thumbnail] : [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId,
        userId: session.user.id,
      },
      mode: "payment",
      success_url: `${origin}/dashboard?success=true&course=${courseId}`,
      cancel_url: `${origin}/courses/${courseId}?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
