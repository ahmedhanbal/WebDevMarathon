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
  GraduationCap,
  Star,
  Clock,
  ChevronRight,
  Play,
  MessageSquare,
  Bell
} from "lucide-react";

// Mock data for enrolled courses
const ENROLLED_COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.",
    tutor: {
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    thumbnail: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    progress: 28,
    lastAccessed: "2 days ago",
    nextLesson: "CSS Layout and Positioning",
    tags: ["Web Development", "Beginner"],
  },
  {
    id: 5,
    title: "Artificial Intelligence: Deep Learning",
    description: "Dive into neural networks, deep learning architectures, and AI implementation.",
    tutor: {
      name: "Dr. Robert Kim",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    thumbnail: "https://images.unsplash.com/photo-1677442135136-760c813558f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    progress: 12,
    lastAccessed: "5 days ago",
    nextLesson: "Introduction to Neural Networks",
    tags: ["AI", "Advanced"],
  },
];

// Mock data for recommended courses
const RECOMMENDED_COURSES = [
  {
    id: 2,
    title: "Advanced Data Science with Python",
    description: "Master data manipulation, visualization, and machine learning using Python libraries.",
    tutor: {
      name: "Emily Chen",
      rating: 4.9,
    },
    thumbnail: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Data Science", "Python", "Advanced"],
  },
  {
    id: 3,
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications for iOS and Android using React Native.",
    tutor: {
      name: "Marcus Wilson",
      rating: 4.6,
    },
    thumbnail: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Mobile Development", "React Native", "Intermediate"],
  },
  {
    id: 4,
    title: "Digital Marketing Fundamentals",
    description: "Learn the essential strategies and tools for effective digital marketing campaigns.",
    tutor: {
      name: "Sarah Patel",
      rating: 4.7,
    },
    thumbnail: "https://images.unsplash.com/photo-1569017388730-020b5f80a004?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["Marketing", "Digital", "Beginner"],
  },
];

// Mock data for notifications
const NOTIFICATIONS = [
  {
    id: 1,
    type: "message",
    content: "Alex Johnson replied to your question",
    course: "Introduction to Web Development",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 2,
    type: "course",
    content: "New lecture added: CSS Animations",
    course: "Introduction to Web Development",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    type: "achievement",
    content: "You've completed 25% of Artificial Intelligence: Deep Learning",
    course: "Artificial Intelligence: Deep Learning",
    time: "3 days ago",
    read: true,
  },
];

export default function StudentDashboard() {
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

  // If the user is a tutor, redirect to tutor dashboard
  if (session?.user?.role === "TUTOR") {
    redirect("/tutor/dashboard");
    return null;
  }

  return (
    <div className="container py-8 pt-24 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "Student"}
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
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="courses" className="mb-8">
        <TabsList>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Recommended
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
          <h2 className="mb-4 text-xl font-semibold">My Enrolled Courses</h2>
          {ENROLLED_COURSES.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
              <p className="mb-4 text-muted-foreground">
                You haven't enrolled in any courses yet. Browse our catalog to find something you're interested in.
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {ENROLLED_COURSES.map((course) => (
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
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={course.tutor.avatar} alt={course.tutor.name} />
                              <AvatarFallback>{course.tutor.name[0]}</AvatarFallback>
                            </Avatar>
                            {course.tutor.name}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        <Clock className="mr-1 inline-block h-3 w-3" />
                        Last accessed {course.lastAccessed}
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          Continue
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Recommended For You</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {RECOMMENDED_COURSES.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    by {course.tutor.name}
                    <div className="ml-2 flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{course.tutor.rating}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                  {notification.type === "course" && <Play className="h-5 w-5" />}
                  {notification.type === "achievement" && <GraduationCap className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.course} • {notification.time}
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

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/courses">
              View all courses
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {ENROLLED_COURSES.length > 0 && (
          <div className="rounded-lg border p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={ENROLLED_COURSES[0].thumbnail}
                    alt={ENROLLED_COURSES[0].title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-lg font-semibold mb-2">{ENROLLED_COURSES[0].title}</h3>
                <p className="text-muted-foreground mb-4">{ENROLLED_COURSES[0].description}</p>
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{ENROLLED_COURSES[0].progress}%</span>
                  </div>
                  <Progress value={ENROLLED_COURSES[0].progress} className="h-2" />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">Next Lesson</p>
                    <p className="text-sm text-muted-foreground">{ENROLLED_COURSES[0].nextLesson}</p>
                  </div>
                  <Button className="ml-auto" asChild>
                    <Link href={`/courses/${ENROLLED_COURSES[0].id}`}>
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
