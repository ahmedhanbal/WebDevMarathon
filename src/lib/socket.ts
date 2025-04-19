import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

type Socket = {
  server: NetServer;
};

type NextApiResponse = {
  socket: Socket;
};

export const initSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    // Create a new Socket.io server
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Define socket.io connection handlers
    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join a course chat room
      socket.on("join-course", (courseId: string) => {
        socket.join(`course-${courseId}`);
        console.log(`Socket ${socket.id} joined course-${courseId}`);
      });

      // Leave a course chat room
      socket.on("leave-course", (courseId: string) => {
        socket.leave(`course-${courseId}`);
        console.log(`Socket ${socket.id} left course-${courseId}`);
      });

      // Handle new chat message
      socket.on("send-message", (message: {
        courseId: string;
        content: string;
        userId: string;
        userName: string;
        userImage?: string;
        userRole: string;
      }) => {
        // Broadcast the message to the course room
        io.to(`course-${message.courseId}`).emit("new-message", {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
        });
      });

      // Handle typing indicator
      socket.on("typing", (data: { courseId: string; userName: string }) => {
        socket.to(`course-${data.courseId}`).emit("user-typing", data.userName);
      });

      // Handle stop typing indicator
      socket.on("stop-typing", (courseId: string) => {
        socket.to(`course-${courseId}`).emit("user-stop-typing");
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    // Assign the socket server instance to the response object
    res.socket.server.io = io;
  }

  // Return the existing socket server instance
  return res.socket.server.io;
};
