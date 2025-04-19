import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for course creation
const CreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().nonnegative().optional(),
  duration: z.string().optional(),
});

// Get all courses (with optional filtering)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const tag = url.searchParams.get("tag") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const tutorId = url.searchParams.get("tutorId") || undefined;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
      ...(tutorId ? { tutorId } : {}),
    };

    // Add tag filtering if provided
    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      };
    }

    // Get courses with tutor info and relations
    const courses = await db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            videos: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await db.course.count({ where });

    // Format response data
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      longDescription: course.longDescription,
      thumbnail: course.thumbnail,
      price: course.price,
      duration: course.duration,
      tutorId: course.tutorId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      tutor: course.tutor,
      tags: course.tags.map(tag => tag.name),
      enrollmentsCount: course._count.enrollments,
      videosCount: course._count.videos,
    }));

    return NextResponse.json({
      courses: formattedCourses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new course
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated and is a tutor
    if (!session || !session.user || session.user.role !== "TUTOR") {
      return NextResponse.json(
        { error: "Unauthorized. Only tutors can create courses." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedFields = CreateCourseSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, longDescription, thumbnail, tags, price, duration } = validatedFields.data;

    // Create course
    const course = await db.course.create({
      data: {
        title,
        description,
        longDescription,
        thumbnail,
        price,
        duration,
        tutorId: session.user.id,
        // Create tags if provided
        ...(tags?.length ? {
          tags: {
            create: tags.map(tag => ({
              name: tag,
            })),
          },
        } : {}),
        // Create a chat session for the course
        chatSession: {
          create: {
            participants: {
              connect: {
                id: session.user.id // Add the tutor as initial participant
              }
            }
          }
        }
      },
      include: {
        tags: true,
        chatSession: true
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
