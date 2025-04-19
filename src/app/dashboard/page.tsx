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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">My Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome back, {session?.user?.name || "User"}! Here's your learning update.
      </p>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="recent">Recently Accessed</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENROLLED_COURSES.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed p-10 text-center">
                <h3 className="mb-2 text-lg font-medium">You haven't enrolled in any courses yet</h3>
                <p className="mb-6 text-muted-foreground">
                  Explore our course catalog to find something that interests you.
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              ENROLLED_COURSES.map((course) => {
                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <img
                        src={course.thumbnail || "https://placehold.co/600x400/e2e8f0/cccccc?text=Course+Thumbnail"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-black/60 text-white">
                          {Math.round(course.progress)}% Complete
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={course.tutor.avatar} alt={course.tutor.name} />
                          <AvatarFallback>{course.tutor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardDescription>{course.tutor.name}</CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-[1rem_1fr] items-start gap-x-2 gap-y-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last accessed {course.lastAccessed}</span>
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next: {course.nextLesson}</span>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/courses/${course.id}`}>
                          Continue Learning
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENROLLED_COURSES.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription>Last accessed: {course.lastAccessed}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>Resume</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
