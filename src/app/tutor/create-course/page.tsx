"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Check,
  Video,
  Clock,
  Tag,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<
    {
      id: number;
      title: string;
      file: File | null;
      uploadProgress: number;
      thumbnailUrl: string | null;
      duration: string;
    }[]
  >([]);

  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnail(imageUrl);
    }
  };

  // Add a tag
  const addTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Add a video
  const addVideo = () => {
    const newVideo = {
      id: Date.now(),
      title: "",
      file: null,
      uploadProgress: 0,
      thumbnailUrl: null,
      duration: "00:00",
    };
    setUploadedVideos([...uploadedVideos, newVideo]);
  };

  // Remove a video
  const removeVideo = (id: number) => {
    setUploadedVideos(uploadedVideos.filter(video => video.id !== id));
  };

  // Handle video file selection
  const handleVideoFileChange = (id: number, file: File | null) => {
    setUploadedVideos(
      uploadedVideos.map(video => {
        if (video.id === id) {
          // In a real app, we'd upload to a server and get back a proper thumbnail and duration
          return {
            ...video,
            file,
            uploadProgress: 0,
            thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            duration: "12:34",
          };
        }
        return video;
      })
    );

    // Simulate upload progress
    if (file) {
      simulateUploadProgress(id);
    }
  };

  // Simulate video upload progress
  const simulateUploadProgress = (id: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 100) {
        clearInterval(interval);
        return;
      }

      setUploadedVideos(
        uploadedVideos.map(video => {
          if (video.id === id) {
            return { ...video, uploadProgress: progress };
          }
          return video;
        })
      );
    }, 300);
  };

  // Handle video title change
  const handleVideoTitleChange = (id: number, title: string) => {
    setUploadedVideos(
      uploadedVideos.map(video => {
        if (video.id === id) {
          return { ...video, title };
        }
        return video;
      })
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      alert("Please enter a course title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a course description");
      return;
    }

    if (!thumbnail) {
      alert("Please upload a course thumbnail");
      return;
    }

    if (uploadedVideos.length === 0) {
      alert("Please upload at least one video");
      return;
    }

    // Check if all videos have titles
    const missingTitles = uploadedVideos.some(video => !video.title.trim());
    if (missingTitles) {
      alert("Please provide titles for all videos");
      return;
    }

    // In a real app, we'd submit the form data to a server
    alert("Course created successfully! Redirecting to dashboard...");
  };

  return (
    <div className="container py-8 pt-24">
      <div className="mb-6">
        <Link href="/tutor/dashboard" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your course. You can upload videos and set up course information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <div className="space-y-8">
            {/* Course Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Web Development"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your course and what students will learn..."
                  className="h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Course Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g. Beginner, JavaScript)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Video Upload */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Course Videos</h2>
                <Button
                  type="button"
                  onClick={addVideo}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Video
                </Button>
              </div>

              {uploadedVideos.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Video className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">No videos added yet</p>
                    <p className="mb-6 max-w-md text-center text-muted-foreground">
                      Add videos to your course by clicking the "Add Video" button above.
                      Each video will be automatically transcribed using AI.
                    </p>
                    <Button type="button" onClick={addVideo}>
                      Add Your First Video
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {uploadedVideos.map((video, index) => (
                    <Card key={video.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </span>
                            <Input
                              placeholder="Video title"
                              value={video.title}
                              onChange={(e) => handleVideoTitleChange(video.id, e.target.value)}
                              className="border-0 px-0 text-lg shadow-none focus-visible:ring-0"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVideo(video.id)}
                            className="rounded-full p-1 hover:bg-muted"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                          <div>
                            {video.thumbnailUrl ? (
                              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title || "Video thumbnail"}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                                  {video.duration}
                                </div>
                              </div>
                            ) : (
                              <div className="flex aspect-video items-center justify-center rounded-md border border-dashed">
                                <Video className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div>
                            <Label htmlFor={`video-${video.id}`} className="mb-2 block">Upload Video</Label>
                            {video.file ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{video.file.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {Math.round(video.uploadProgress)}%
                                  </span>
                                </div>
                                <Progress value={video.uploadProgress} className="h-2" />
                                {video.uploadProgress === 100 && (
                                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                    <Check className="h-4 w-4" />
                                    Video uploaded successfully
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <Input
                                  id={`video-${video.id}`}
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleVideoFileChange(video.id, file);
                                  }}
                                />
                              </div>
                            )}

                            {video.uploadProgress === 100 && (
                              <div className="mt-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>AI transcription will be generated automatically</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div>
            <div className="sticky top-24 space-y-6">
              {/* Course Thumbnail */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold">Course Thumbnail</h2>
                <div className="overflow-hidden rounded-lg border border-dashed">
                  {thumbnail ? (
                    <div className="relative aspect-video">
                      <img
                        src={thumbnail}
                        alt="Course thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                        onClick={() => setThumbnail(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center p-4 text-center">
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="mb-1 font-medium">Upload thumbnail</p>
                      <p className="text-sm text-muted-foreground">
                        Recommended: 1280x720px
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  )}
                </div>
              </motion.div>

              <Separator />

              {/* Summary */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold">Course Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium">{title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Videos</span>
                    <span className="font-medium">{uploadedVideos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tags</span>
                    <span className="font-medium">{tags.length || "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thumbnail</span>
                    <span className="font-medium">{thumbnail ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg">
                    Create Course
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
