"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Star,
  Users,
  Clock,
  MessageSquare,
  User,
  Send,
  BookOpen,
  Download,
  List
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/hooks/useSocket";
import { Message as ChatMessage } from "@/types/chat";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Mock data - single course details
const COURSE = {
  id: 1,
  title: "Introduction to Web Development",
  description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications from scratch. This comprehensive course covers everything from basic syntax to advanced techniques for creating responsive, interactive websites.",
  longDescription: `
    <p>This course is designed for beginners who want to start a career in web development. You'll learn the core technologies that power the web and gain hands-on experience building real projects.</p>
    <p>By the end of this course, you'll be able to:</p>
    <ul>
      <li>Create structured web pages with HTML5</li>
      <li>Style web pages using CSS3 and responsive design techniques</li>
      <li>Add interactivity with JavaScript</li>
      <li>Build forms and handle user input</li>
      <li>Connect to APIs and work with data</li>
      <li>Deploy your websites to the internet</li>
    </ul>
    <p>Each section includes practical exercises and a final project to apply what you've learned.</p>
  `,
  tutor: {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Full-stack developer with 10+ years of experience and a passion for teaching. Currently leading development at TechCorp and dedicated to helping beginners break into tech.",
    rating: 4.8,
  },
  thumbnail: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  duration: "8 weeks",
  students: 1248,
  rating: 4.7,
  tags: ["Web Development", "Beginner", "HTML", "CSS", "JavaScript"],
  price: 49.99,
  videos: [
    {
      id: 101,
      title: "Introduction to HTML",
      duration: "12:34",
      watched: true,
      thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 102,
      title: "HTML Structure and Elements",
      duration: "18:22",
      watched: true,
      thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 103,
      title: "Introduction to CSS",
      duration: "22:45",
      watched: false,
      thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 104,
      title: "CSS Selectors and Properties",
      duration: "20:18",
      watched: false,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 105,
      title: "CSS Layout and Positioning",
      duration: "24:56",
      watched: false,
      thumbnail: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ],
  progress: 28,
  // Simulated AI transcript
  transcript: [
    { time: "0:00", text: "Hello and welcome to this lesson on HTML fundamentals." },
    { time: "0:05", text: "HTML stands for HyperText Markup Language, and it's the standard markup language for creating web pages." },
    { time: "0:15", text: "Every webpage you see on the internet uses HTML to structure its content." },
    { time: "0:23", text: "In this video, we'll cover the basic structure of an HTML document and learn about important elements." },
    { time: "0:35", text: "Let's start by creating a new HTML file. You can use any text editor for this." },
    { time: "0:45", text: "Every HTML document starts with a DOCTYPE declaration followed by an HTML element." },
    { time: "0:55", text: "The HTML element contains two main sections: the head and the body." },
    { time: "1:05", text: "The head contains meta-information about the document, while the body contains the visible content." },
    { time: "1:15", text: "Now, let's write our first HTML code together..." },
    // Additional lines...
  ],
  // Simulated chat messages
  chatMessages: [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "tutor",
      },
      message: "Welcome to the course everyone! Feel free to ask any questions here.",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      user: {
        name: "Emma Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        role: "student",
      },
      message: "Hi Alex! I'm having trouble with the CSS selectors exercise. Could you clarify how specificity works again?",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      user: {
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "tutor",
      },
      message: "Sure Emma! CSS specificity is a way of determining which styles should be applied to an element when there are conflicting rules. It's calculated based on the type of selector used, with inline styles having the highest specificity, followed by IDs, classes, and then elements. I'll post a detailed explanation with examples in the next lesson.",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      user: {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "student",
      },
      message: "Thanks for the explanation! This helps me understand why some of my styles weren't being applied.",
      timestamp: "22 hours ago",
    },
  ],
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  const [activeVideo, setActiveVideo] = useState(COURSE.videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(COURSE.chatMessages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const { data: session } = useSession();
  
  // Initialize socket connection
  const { isConnected, messages, sendMessage: socketSendMessage, usersTyping, startTyping, stopTyping } = 
    useSocket(params?.id);
  
  // Update chat messages when new messages arrive from socket
  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages((prev) => [...prev, ...messages]);
    }
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    const hasUsersTyping = usersTyping.length > 0;
    setIsTyping(hasUsersTyping);
  }, [usersTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (session?.user?.name && params?.id) {
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Send typing event
      startTyping(params.id, session.user.name);
      
      // Set timeout to stop typing indicator
      const timeout = setTimeout(() => {
        stopTyping(params.id);
      }, 3000);
      
      setTypingTimeout(timeout);
    }
  };

  useEffect(() => {
    // In a real app, fetch course data based on courseId
    console.log(`Fetching course with ID: ${courseId}`);
  }, [courseId]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const sendMessage = () => {
    if (message.trim() === "" || !session?.user || !params?.id) return;

    // Send message via socket
    socketSendMessage(
      params.id,
      message,
      {
        id: session.user.id as string,
        name: session.user.name || "Anonymous",
        image: session.user.image,
        role: session.user.role as string || "STUDENT",
      }
    );

    // Clear message
    setMessage("");
    
    // Stop typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    stopTyping(params.id);
    
    // Show toast if not connected
    if (!isConnected) {
      toast.error("Not connected to chat. Please refresh the page.");
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="container py-6">
          <Link href="/courses" className="mb-4 inline-flex items-center text-sm text-white/80 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>

          {/* Video Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {/* Video placeholder - in a real app, this would be a video player */}
            <img
              src={activeVideo.thumbnail}
              alt={activeVideo.title}
              className="h-full w-full object-cover"
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white transition-transform hover:scale-110"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 pl-1" />
                )}
              </button>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>

                <button onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>

                <Progress value={32} className="h-1 flex-grow" />

                <span className="text-sm text-white">3:24 / {activeVideo.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-4 text-3xl font-bold">{COURSE.title}</h1>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <Badge className="px-2 py-1">
                  <Clock className="mr-1 h-3 w-3" />
                  {COURSE.duration}
                </Badge>
                <Badge variant="secondary" className="px-2 py-1">
                  <Users className="mr-1 h-3 w-3" />
                  {COURSE.students.toLocaleString()} students
                </Badge>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{COURSE.rating}</span>
                  <span className="ml-1 text-muted-foreground">({Math.floor(COURSE.students * 0.35)} reviews)</span>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={COURSE.tutor.avatar} alt={COURSE.tutor.name} />
                  <AvatarFallback>{COURSE.tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{COURSE.tutor.name}</p>
                  <p className="text-sm text-muted-foreground">Course Instructor</p>
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="content" className="mt-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  AI Transcript
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold">About This Course</h2>
                  {/* HTML content is rendered safely server-side in a real app */}
                  <div className="mb-6 space-y-4 text-muted-foreground">
                    <p>This course is designed for beginners who want to start a career in web development. You'll learn the core technologies that power the web and gain hands-on experience building real projects.</p>
                    <p>By the end of this course, you'll be able to:</p>
                    <ul className="ml-6 list-disc space-y-1">
                      <li>Create structured web pages with HTML5</li>
                      <li>Style web pages using CSS3 and responsive design techniques</li>
                      <li>Add interactivity with JavaScript</li>
                      <li>Build forms and handle user input</li>
                      <li>Connect to APIs and work with data</li>
                      <li>Deploy your websites to the internet</li>
                    </ul>
                    <p>Each section includes practical exercises and a final project to apply what you've learned.</p>
                  </div>
                  <h3 className="mb-4 text-lg font-semibold">Course Content</h3>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{COURSE.videos.length} lessons • {COURSE.duration}</p>
                      <p className="text-sm text-muted-foreground">{Math.round(COURSE.progress)}% complete</p>
                    </div>
                    <Progress value={COURSE.progress} className="w-24" />
                  </div>

                  <div className="space-y-2">
                    {COURSE.videos.map((video) => (
                      <button
                        key={video.id}
                        className={`flex w-full items-center justify-between rounded-md p-3 text-left transition-colors ${
                          video.id === activeVideo.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setActiveVideo(video)}
                      >
                        <div className="flex items-center gap-3">
                          {video.watched ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground">
                              <Play className="h-3 w-3 pl-0.5" />
                            </div>
                          )}
                          <span className={video.watched ? "text-muted-foreground" : ""}>
                            {video.title}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{video.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transcript" className="mt-4">
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">AI-Generated Transcript</h2>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-4">
                    {COURSE.transcript.map((item) => (
                      <div key={`${item.time}-${item.text.substring(0, 10)}`} className="flex gap-3">
                        <span className="flex w-12 shrink-0 text-muted-foreground">{item.time}</span>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <div className="flex h-[60vh] flex-col rounded-lg border bg-card">
                  <div className="border-b p-4">
                    <h2 className="font-semibold">Course Discussion</h2>
                    <p className="text-sm text-muted-foreground">
                      Chat with the instructor and other students
                    </p>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4">
                    <div className="space-y-6">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.userImage} alt={msg.userName} />
                            <AvatarFallback>{msg.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{msg.userName}</span>
                              {msg.userRole === "TUTOR" && (
                                <Badge variant="outline" className="text-xs">Instructor</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {isTyping && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {usersTyping.join(", ")} {usersTyping.length === 1 ? "is" : "are"} typing...
                      </div>
                    )}
                  </div>

                  <div className="border-t p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={session?.user?.image || ""} 
                          alt={session?.user?.name || "User"} 
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <Textarea
                          placeholder="Ask a question or start a discussion..."
                          className="min-h-24 resize-none"
                          value={message}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {isConnected ? (
                              <span className="flex items-center">
                                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span> Connected
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span> Disconnected
                              </span>
                            )}
                          </span>
                          <Button onClick={sendMessage} className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="sticky top-24 rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">${COURSE.price}</h2>
                <Button className="mb-4 w-full">Enroll Now</Button>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{COURSE.videos.length} video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>AI-generated transcripts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Real-time chat with instructor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>Certificate of completion</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-2 font-medium">This course includes:</h3>
                  <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Full lifetime access</span>
                  </p>
                  <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>Downloadable resources</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Direct instructor support</span>
                  </p>
                </div>

                <Separator className="my-6" />

                <p className="text-center text-sm text-muted-foreground">
                  30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
