import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for transcription request
const TranscriptionSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  audioUrl: z.string().url("Must be a valid audio URL"),
});

// Define user roles
type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

// Process video transcription
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated and is a tutor
    if (!session || !session.user || session.user.role !== "TUTOR") {
      return NextResponse.json(
        { error: "Unauthorized - Only tutors can request transcriptions" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedFields = TranscriptionSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten() },
        { status: 400 }
      );
    }

    const { videoId, audioUrl } = validatedFields.data;

    // Check if the video exists and belongs to the tutor
    const video = await db.video.findUnique({
      where: { id: videoId },
      include: {
        course: {
          select: {
            tutorId: true
          }
        }
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Verify the tutor owns the course
    const isOwner = video.course.tutorId === session.user.id;
    const userRole = session.user.role as UserRole;
    const isAdmin = userRole === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - You do not have permission to transcribe this video" },
        { status: 403 }
      );
    }

    // Download the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download audio file" },
        { status: 500 }
      );
    }
    
    const audioBlob = await audioResponse.blob();
    
    // Prepare form data for OpenAI API
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mp3");
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities", "segment");
    
    // Call OpenAI Whisper API
    const openAIResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      
      return NextResponse.json(
        { error: "Transcription service error", details: errorData },
        { status: 500 }
      );
    }
    
    const transcriptionData = await openAIResponse.json();
    
    // Format transcription with timestamps
    let transcriptContent = "";
    
    if (transcriptionData.segments) {
      // Process segments with timestamps
      transcriptContent = transcriptionData.segments.map((segment: any) => {
        const startTime = formatTime(segment.start);
        return `${startTime} - ${segment.text.trim()}`;
      }).join("\n\n");
    } else {
      // Fallback to just the text if no segments
      transcriptContent = transcriptionData.text;
    }

    // Create or update the transcript
    let transcript;
    if (video.transcriptId) {
      // Update existing transcript
      transcript = await db.transcript.update({
        where: { id: video.transcriptId },
        data: { content: transcriptContent },
      });
    } else {
      // Create new transcript
      transcript = await db.transcript.create({
        data: { content: transcriptContent },
      });

      // Link transcript to video
      await db.video.update({
        where: { id: videoId },
        data: { transcriptId: transcript.id },
      });
    }

    return NextResponse.json({
      success: true,
      transcript,
      message: "Transcription completed successfully",
    });
  } catch (error) {
    console.error("[TRANSCRIPTION_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format time in MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
