"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  BookOpenCheck,
  User,
  Users,
  PlusCircle,
  Clock,
  DollarSign,
  LineChart,
  MessageSquare,
  Bell,
  ChevronRight,
  Video,
  Plus,
  FileText
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Mock data for created courses
const CREATED_COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.",
    thumbnail: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "published",
    createdAt: "2 months ago",
    enrollments: 248,
    revenue: 12400,
    messages: 15,
    videos: 10,
    lastUpdated: "3 days ago",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React patterns including hooks, context, and performance optimization techniques.",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    status: "draft",
    createdAt: "1 week ago",
    enrollments: 0,
    revenue: 0,
    messages: 0,
    videos: 3,
    lastUpdated: "1 day ago",
  },
];

// Mock data for notifications
const NOTIFICATIONS = [
  {
    id: 1,
    type: "message",
    content: "New question in Introduction to Web Development",
    details: "Emma Rodriguez: Can you explain how CSS specificity works again?",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "enrollment",
    content: "New student enrolled in your course",
    details: "Introduction to Web Development",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    type: "payment",
    content: "You received a payment of $49.99",
    details: "From a course enrollment",
    time: "3 days ago",
    read: true,
  },
];

// Mock analytics data
const ANALYTICS = {
  totalStudents: 248,
  totalRevenue: 12400,
  totalCourses: 2,
  activeStudents: 186,
  completionRate: 72,
  averageRating: 4.7,
  monthlyEnrollments: [12, 24, 36, 42, 53, 48, 61, 75, 84, 98, 110, 125],
  monthlyRevenue: [600, 1200, 1800, 2100, 2650, 2400, 3050, 3750, 4200, 4900, 5500, 6250],
};

export default async function TutorDashboardPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login");
  }

  // Redirect to student dashboard if not a tutor
  if (session.user.role !== "TUTOR") {
    redirect("/dashboard");
  }

  // Fetch tutor's courses with enrollment counts
  const courses = await db.course.findMany({
    where: {
      tutorId: session.user.id,
    },
    include: {
      _count: {
        select: {
          enrollments: true,
          videos: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate total enrollments, courses, and videos
  const totalEnrollments = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
  const totalCourses = courses.length;
  const totalVideos = courses.reduce((sum, course) => sum + course._count.videos, 0);

  // Get recent enrollments
  const recentEnrollments = await db.enrollment.findMany({
    where: {
      course: {
        tutorId: session.user.id,
      },
    },
    take: 5,
    orderBy: {
      enrolledAt: "desc",
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and track enrollments</p>
        </div>
        <Button className="mt-4 sm:mt-0" asChild>
          <Link href="/tutor/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {totalEnrollments === 1 ? "Student enrolled" : "Students enrolled"} in your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Courses Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {totalCourses === 1 ? "Course" : "Courses"} published by you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              {totalVideos === 1 ? "Video" : "Videos"} uploaded across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="enrollments">Recent Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed p-10 text-center">
                <h3 className="mb-2 text-lg font-medium">You haven't created any courses yet</h3>
                <p className="mb-6 text-muted-foreground">
                  Create your first course to share your knowledge with students.
                </p>
                <Button asChild>
                  <Link href="/tutor/courses/new">Create Course</Link>
                </Button>
              </div>
            ) : (
              courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <img
                      src={course.thumbnail || "https://placehold.co/600x400/e2e8f0/cccccc?text=Course+Thumbnail"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 text-white">
                        {course._count.enrollments} {course._count.enrollments === 1 ? "student" : "students"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span>
                          {course._count.videos} {course._count.videos === 1 ? "video" : "videos"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration || "Self-paced"}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/courses/${course.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <Link href={`/tutor/courses/${course.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <div className="rounded-lg border">
            {recentEnrollments.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="mb-2 text-lg font-medium">No enrollments yet</h3>
                <p className="text-muted-foreground">
                  Once students enroll in your courses, they'll appear here.
                </p>
              </div>
            ) : (
              recentEnrollments.map((enrollment, i) => (
                <div
                  key={enrollment.id}
                  className={`flex items-center justify-between p-4 ${
                    i < recentEnrollments.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={enrollment.student.image || undefined}
                        alt={enrollment.student.name || "Student"}
                      />
                      <AvatarFallback>{enrollment.student.name?.[0] || "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{enrollment.student.name}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.student.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{enrollment.course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {recentEnrollments.length > 0 && (
              <div className="flex items-center justify-center p-4">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/tutor/enrollments">
                    View All Enrollments
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
