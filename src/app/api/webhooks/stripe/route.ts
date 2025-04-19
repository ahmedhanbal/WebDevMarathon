import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Webhook secret for verifying the event
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Process Stripe webhooks
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    // Verify the event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle successful checkout sessions
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Extract user and course IDs from metadata
  const { userId, courseId } = session.metadata || {};

  if (!userId || !courseId) {
    console.error("Missing userId or courseId in session metadata");
    return;
  }

  try {
    // Check if the user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      console.log(`User ${userId} is already enrolled in course ${courseId}`);
      return;
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        studentId: userId,
        courseId,
      },
    });

    // Create course progress record
    await db.courseProgress.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
    });

    console.log(`Enrollment created: ${enrollment.id}`);
  } catch (error) {
    console.error("Error processing enrollment:", error);
  }
}
