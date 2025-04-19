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
  Bell
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

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  useEffect(() => {
    // Count unread notifications
    setUnreadNotifications(NOTIFICATIONS.filter(n => !n.read).length);
  }, []);

  // Redirect if not logged in
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }

  // If the user is a student, redirect to student dashboard
  if (session?.user?.role === "STUDENT") {
    redirect("/dashboard");
    return null;
  }

  return (
    <div className="container py-8 pt-24 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "Tutor"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="relative" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.[0] || "T"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold">{ANALYTICS.totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">${ANALYTICS.totalRevenue}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Courses</p>
              <h3 className="text-2xl font-bold">{ANALYTICS.totalCourses}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center p-6">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <LineChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-2xl font-bold">{ANALYTICS.completionRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Button className="flex items-center gap-2" asChild>
          <Link href="/tutor/create-course">
            <PlusCircle className="h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="courses" className="mb-8">
        <TabsList>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {unreadNotifications}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">My Courses</h2>
          {CREATED_COURSES.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
              <p className="mb-4 text-muted-foreground">
                You haven't created any courses yet. Create your first course to start teaching.
              </p>
              <Button asChild>
                <Link href="/tutor/create-course">Create Your First Course</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {CREATED_COURSES.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-1">
                            {course.description}
                          </CardDescription>
                        </div>
                        <Badge variant={course.status === "published" ? "default" : "secondary"}>
                          {course.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Students</p>
                          <p className="font-semibold">{course.enrollments}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold">${course.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Videos</p>
                          <p className="font-semibold">{course.videos}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Messages</p>
                          <p className="font-semibold">{course.messages}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        <Clock className="mr-1 inline-block h-3 w-3" />
                        Updated {course.lastUpdated}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tutor/courses/${course.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/tutor/courses/${course.id}`}>
                            Manage
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">My Students</h2>
          {ANALYTICS.totalStudents === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No students yet</h3>
              <p className="mb-4 text-muted-foreground">
                You don't have any enrolled students yet. Publish a course to get started.
              </p>
              <Button asChild>
                <Link href="/tutor/create-course">Create a Course</Link>
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>
                  You have {ANALYTICS.totalStudents} students enrolled across your courses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Active Students</span>
                      <span>{ANALYTICS.activeStudents} of {ANALYTICS.totalStudents}</span>
                    </div>
                    <Progress value={(ANALYTICS.activeStudents / ANALYTICS.totalStudents) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                        <div className="text-2xl font-bold">{ANALYTICS.completionRate}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Avg. Rating</div>
                        <div className="text-2xl font-bold">{ANALYTICS.averageRating}/5.0</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Revenue per Student</div>
                        <div className="text-2xl font-bold">${(ANALYTICS.totalRevenue / ANALYTICS.totalStudents).toFixed(2)}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">Monthly Enrollments</h3>
                    <div className="h-[200px] w-full bg-muted flex items-end">
                      {ANALYTICS.monthlyEnrollments.map((enrollment, index) => (
                        <div
                          key={index}
                          className="w-full bg-primary mr-1 transition-all duration-500"
                          style={{
                            height: `${(enrollment / Math.max(...ANALYTICS.monthlyEnrollments)) * 100}%`,
                            marginRight: index === ANALYTICS.monthlyEnrollments.length - 1 ? '0' : '4px'
                          }}
                        >
                          <div className="h-full relative group">
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                              {enrollment} enrollments
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/tutor/students">
                    View Detailed Student Analytics
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Notifications</h2>
          <div className="rounded-lg border divide-y">
            {NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  {notification.type === "message" && <MessageSquare className="h-5 w-5" />}
                  {notification.type === "enrollment" && <User className="h-5 w-5" />}
                  {notification.type === "payment" && <DollarSign className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.details} • {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="ml-auto">New</Badge>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
