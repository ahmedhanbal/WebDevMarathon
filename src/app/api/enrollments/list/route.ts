import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface EnrollmentWithRelations {
  id: string;
  courseId: string;
  studentId: string;
  status: string;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    duration: string | null;
    tutorId: string;
    createdAt: Date;
    tutor: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      videos: number;
    };
  };
  progress?: Array<{
    progress: number;
    lastAccessed: Date | null;
  }>;
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get enrollments with course details
    const enrollments = await db.enrollment.findMany({
      where: {
        studentId: session.user.id,
        status: "ACTIVE",
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            duration: true,
            tutorId: true,
            createdAt: true,
            tutor: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                videos: true,
              },
            },
          },
        },
        progress: {
          select: {
            progress: true,
            lastAccessed: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await db.enrollment.count({
      where: {
        studentId: session.user.id,
        status: "ACTIVE",
      },
    });

    // Format the response
    const formattedEnrollments = enrollments.map((enrollment: EnrollmentWithRelations) => ({
      id: enrollment.id,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        duration: enrollment.course.duration,
        tutorId: enrollment.course.tutorId,
        tutor: enrollment.course.tutor,
        videosCount: enrollment.course._count.videos,
      },
      progress: enrollment.progress?.[0] || { progress: 0, lastAccessed: null },
    }));

    return NextResponse.json({
      enrollments: formattedEnrollments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ENROLLMENTS_LIST_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 