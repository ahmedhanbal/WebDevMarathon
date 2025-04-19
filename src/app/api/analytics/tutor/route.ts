import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated and is a tutor or admin
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "TUTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only tutors and admins can access analytics" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const tutorId = url.searchParams.get("tutorId") || session.user.id;
    const period = url.searchParams.get("period") || "all"; // all, week, month, year

    // Only admins can view other tutor's analytics
    if (tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only view your own analytics" },
        { status: 403 }
      );
    }

    // Get date range based on period
    let dateFilter: any = {};
    const now = new Date();
    
    if (period === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (period === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    } else if (period === "year") {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { gte: yearAgo };
    }

    // Get all courses by the tutor
    const courses = await db.course.findMany({
      where: {
        tutorId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            videos: true,
          },
        },
      },
    });

    // Get enrollment data
    const enrollments = await db.enrollment.findMany({
      where: {
        course: {
          tutorId,
        },
        ...(Object.keys(dateFilter).length > 0 ? {
          createdAt: dateFilter,
        } : {}),
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true,
        courseId: true,
        status: true,
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    // Calculate metrics
    const totalCourses = courses.length;
    const totalVideos = courses.reduce((sum, course) => sum + course._count.videos, 0);
    const totalEnrollments = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
    const periodEnrollments = enrollments.length;

    // Group enrollments by day for chart data
    const enrollmentsByDate: Record<string, number> = {};
    
    enrollments.forEach(enrollment => {
      const date = enrollment.createdAt.toISOString().split('T')[0];
      enrollmentsByDate[date] = (enrollmentsByDate[date] || 0) + 1;
    });

    // Format chart data
    const chartData = Object.entries(enrollmentsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // Get course popularity data
    const coursePopularity = await Promise.all(
      courses.map(async (course) => {
        const activeEnrollments = await db.enrollment.count({
          where: {
            courseId: course.id,
            status: "ACTIVE",
          },
        });

        return {
          id: course.id,
          title: course.title,
          totalEnrollments: course._count.enrollments,
          activeEnrollments,
          videosCount: course._count.videos,
        };
      })
    );

    return NextResponse.json({
      summary: {
        totalCourses,
        totalVideos,
        totalEnrollments,
        periodEnrollments,
      },
      enrollmentTrend: chartData,
      coursePopularity: coursePopularity.sort((a, b) => b.totalEnrollments - a.totalEnrollments),
    });
  } catch (error) {
    console.error("[TUTOR_ANALYTICS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 