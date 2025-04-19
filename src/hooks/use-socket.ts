import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

// Define socket event types for TypeScript
export interface ServerToClientEvents {
  'new-message': (message: ChatMessage) => void;
  'user-typing': (username: string) => void;
  'user-stop-typing': () => void;
}

export interface ClientToServerEvents {
  'join-course': (courseId: string) => void;
  'leave-course': (courseId: string) => void;
  'send-message': (message: {
    courseId: string;
    content: string;
    userId: string;
    userName: string;
    userImage?: string;
    userRole: string;
  }) => void;
  'typing': (data: { courseId: string; userName: string }) => void;
  'stop-typing': (courseId: string) => void;
}

export interface ChatMessage {
  id: string;
  courseId: string;
  content: string;
  userId: string;
  userName: string;
  userImage?: string;
  userRole: string;
  timestamp: string;
}

export function useSocket(courseId?: string) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/api/socket',
      autoConnect: true,
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);

      // Join course room if courseId is provided
      if (courseId) {
        socketInstance.emit('join-course', courseId);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('user-typing', (username) => {
      setTypingUser(username);
    });

    socketInstance.on('user-stop-typing', () => {
      setTypingUser(null);
    });

    setSocket(socketInstance as Socket<ServerToClientEvents, ClientToServerEvents>);

    // Clean up on unmount
    return () => {
      if (courseId) {
        socketInstance.emit('leave-course', courseId);
      }
      socketInstance.disconnect();
    };
  }, [courseId]);

  // Function to send a message
  const sendMessage = (content: string) => {
    if (socket && isConnected && session?.user && courseId) {
      const messageData = {
        courseId,
        content,
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
        userImage: session.user.image || undefined,
        userRole: session.user.role,
      };

      socket.emit('send-message', messageData);
    }
  };

  // Function to indicate user is typing
  const startTyping = () => {
    if (socket && isConnected && session?.user && courseId) {
      socket.emit('typing', {
        courseId,
        userName: session.user.name || 'Anonymous',
      });
    }
  };

  // Function to indicate user stopped typing
  const stopTyping = () => {
    if (socket && isConnected && courseId) {
      socket.emit('stop-typing', courseId);
    }
  };

  return {
    socket,
    isConnected,
    messages,
    typingUser,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
