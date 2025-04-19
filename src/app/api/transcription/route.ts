import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for transcription request
const TranscriptionSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  audioUrl: z.string().url("Must be a valid audio URL"),
});

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
    if (video.course.tutorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - You do not have permission to transcribe this video" },
        { status: 403 }
      );
    }

    // In a real app, we would download the audio and send it to OpenAI Whisper API
    // For this implementation, we'll simulate it with a placeholder

    // Simulated API call to OpenAI Whisper
    // In a real app, you would use something like:
    /*
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    const transcriptContent = data.text;
    */

    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a transcript with timestamps (in real app, Whisper would provide this)
    const transcriptContent = [
      { time: "0:00", text: "Welcome to this lesson on web development fundamentals." },
      { time: "0:10", text: "Today we'll be covering HTML, CSS, and JavaScript basics." },
      { time: "0:20", text: "HTML or Hypertext Markup Language is the standard markup language for documents designed to be displayed in a web browser." },
      { time: "0:35", text: "It defines the structure of web content through a series of elements." },
      { time: "0:45", text: "Let's start by creating a simple HTML document." },
      // ... more transcript lines
    ].map(item => `${item.time} - ${item.text}`).join("\n\n");

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
