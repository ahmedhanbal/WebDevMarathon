"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    videos: 10,
    revenue: 12400,
    messages: 15,
    duration: "12 hours",
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
    videos: 3,
    revenue: 0,
    messages: 0,
    duration: "8 hours",
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

// Mock data for recent enrollments
const RECENT_ENROLLMENTS = [
  {
    id: 1,
    student: {
      id: "user1",
      name: "Emma Rodriguez",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "emma.r@example.com"
    },
    course: {
      id: 1,
      title: "Introduction to Web Development"
    },
    enrolledAt: "2 days ago"
  },
  {
    id: 2,
    student: {
      id: "user2",
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      email: "michael.c@example.com"
    },
    course: {
      id: 1,
      title: "Introduction to Web Development"
    },
    enrolledAt: "3 days ago"
  }
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

export default function TutorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      // Check if user is not a tutor
      if (session?.user?.role !== "TUTOR") {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Calculate summary stats from mock data
  const totalEnrollments = CREATED_COURSES.reduce((sum, course) => sum + course.enrollments, 0);
  const totalCourses = CREATED_COURSES.length;
  const totalVideos = CREATED_COURSES.reduce((sum, course) => sum + course.videos, 0);

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
            {CREATED_COURSES.length === 0 ? (
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
              CREATED_COURSES.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 text-white">
                        {course.enrollments} {course.enrollments === 1 ? "student" : "students"}
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
                          {course.videos} {course.videos === 1 ? "video" : "videos"}
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
                      <Link href={`/tutor/courses/${course.id}`}>
                        Manage
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/tutor/courses/${course.id}/edit`}>
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
            {RECENT_ENROLLMENTS.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No recent enrollments yet.</p>
              </div>
            ) : (
              <div className="divide-y">
                {RECENT_ENROLLMENTS.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={enrollment.student.image} alt={enrollment.student.name} />
                        <AvatarFallback>{enrollment.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{enrollment.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled in {enrollment.course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{enrollment.enrolledAt}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tutor/students/${enrollment.student.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
