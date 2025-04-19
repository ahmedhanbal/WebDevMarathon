"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Users, Star, Filter } from "lucide-react";

// Mock data for courses
const COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.",
    tutor: {
      name: "Alex Johnson",
      rating: 4.8,
    },
    thumbnail: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    duration: "8 weeks",
    students: 1248,
    rating: 4.7,
    tags: ["Web Development", "Beginner", "HTML", "CSS", "JavaScript"],
  },
  {
    id: 2,
    title: "Advanced Data Science with Python",
    description: "Master data manipulation, visualization, and machine learning using Python libraries.",
    tutor: {
      name: "Emily Chen",
      rating: 4.9,
    },
    thumbnail: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    duration: "10 weeks",
    students: 874,
    rating: 4.9,
    tags: ["Data Science", "Python", "Advanced", "Machine Learning"],
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
    duration: "6 weeks",
    students: 642,
    rating: 4.5,
    tags: ["Mobile Development", "React Native", "JavaScript", "Intermediate"],
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
    duration: "4 weeks",
    students: 1562,
    rating: 4.6,
    tags: ["Marketing", "Digital", "Beginner", "Social Media"],
  },
  {
    id: 5,
    title: "Artificial Intelligence: Deep Learning",
    description: "Dive into neural networks, deep learning architectures, and AI implementation.",
    tutor: {
      name: "Dr. Robert Kim",
      rating: 4.9,
    },
    thumbnail: "https://images.unsplash.com/photo-1677442135136-760c813558f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    duration: "12 weeks",
    students: 428,
    rating: 4.8,
    tags: ["AI", "Deep Learning", "Python", "Advanced", "Neural Networks"],
  },
  {
    id: 6,
    title: "Graphic Design for Beginners",
    description: "Master the principles of design and industry-standard software like Photoshop and Illustrator.",
    tutor: {
      name: "Lisa Moreno",
      rating: 4.8,
    },
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    duration: "8 weeks",
    students: 1105,
    rating: 4.7,
    tags: ["Design", "Graphic Design", "Beginner", "Photoshop", "Illustrator"],
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(COURSES);

  // Filter courses based on search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCourses(COURSES);
    } else {
      const filtered = COURSES.filter(
        (course) =>
          course.title.toLowerCase().includes(term.toLowerCase()) ||
          course.description.toLowerCase().includes(term.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  };

  return (
    <div className="container py-16 pt-24">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Browse Courses</h1>
        <p className="text-lg text-muted-foreground">
          Discover expert-led courses with real-time interaction and AI-enhanced learning.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-10 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for courses, topics, or keywords..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Results info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredCourses.length}</span> courses
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
            <option>Most Popular</option>
            <option>Highest Rated</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* No results */}
      {filteredCourses.length === 0 && (
        <div className="mt-10 text-center">
          <h3 className="mb-2 text-xl font-semibold">No courses found</h3>
          <p className="mb-6 text-muted-foreground">
            We couldn't find any courses matching your search criteria.
          </p>
          <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: (typeof COURSES)[0] }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{course.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              by {course.tutor.name}
              <div className="ml-2 flex items-center">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{course.tutor.rating}</span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mb-3 flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="outline" className="font-normal">
              +{course.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {course.duration}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="mr-1 h-3 w-3" />
            {course.students.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{course.rating}</span>
        </div>
      </CardFooter>

      <Link href={`/courses/${course.id}`} className="absolute inset-0">
        <span className="sr-only">View {course.title}</span>
      </Link>
    </Card>
  );
}
