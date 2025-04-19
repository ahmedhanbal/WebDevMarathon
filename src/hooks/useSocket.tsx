import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';

// Define the socket client type
type SocketClient = {
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
};

type UseSocketReturn = {
  isConnected: boolean;
  messages: Message[];
  sendMessage: (courseId: string, content: string, user: {
    id: string;
    name: string;
    image?: string;
    role: string;
  }) => void;
  usersTyping: string[];
  startTyping: (courseId: string, userName: string) => void;
  stopTyping: (courseId: string) => void;
};

export function useSocket(courseId?: string): UseSocketReturn {
  const [socket, setSocket] = useState<SocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Dynamically import socket.io-client to avoid SSR issues
    const loadSocket = async () => {
      try {
        const socketIO = await import('socket.io-client');
        
        // Initialize socket connection
        const socketInstance = socketIO.default(window.location.origin, {
          path: '/api/socket',
          addTrailingSlash: false,
        });

        // Set socket state
        setSocket(socketInstance);

        // Setup event listeners
        socketInstance.on('connect', () => {
          console.log('Socket connected');
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

        socketInstance.on('new-message', (message: Message) => {
          setMessages((prev) => [...prev, message]);
        });

        socketInstance.on('user-typing', (userName: string) => {
          setUsersTyping((prev) => {
            if (!prev.includes(userName)) {
              return [...prev, userName];
            }
            return prev;
          });
        });

        socketInstance.on('user-stop-typing', () => {
          setUsersTyping([]);
        });

        // Return cleanup function
        return socketInstance;
      } catch (error) {
        console.error('Error loading socket.io client:', error);
        return null;
      }
    };

    // Load socket
    let socketInstance: any = null;
    loadSocket().then((instance) => {
      socketInstance = instance;
    });

    // Cleanup function
    return () => {
      if (socketInstance) {
        if (courseId) {
          socketInstance.emit('leave-course', courseId);
        }
        socketInstance.disconnect();
      }
    };
  }, [courseId]);

  // Send message function
  const sendMessage = useCallback(
    (courseId: string, content: string, user: {
      id: string;
      name: string;
      image?: string;
      role: string;
    }) => {
      if (socket && isConnected) {
        socket.emit('send-message', {
          courseId,
          content,
          userId: user.id,
          userName: user.name,
          userImage: user.image,
          userRole: user.role,
        });
      }
    },
    [socket, isConnected]
  );

  // Handle typing indicator
  const startTyping = useCallback(
    (courseId: string, userName: string) => {
      if (socket && isConnected) {
        socket.emit('typing', { courseId, userName });
      }
    },
    [socket, isConnected]
  );

  const stopTyping = useCallback(
    (courseId: string) => {
      if (socket && isConnected) {
        socket.emit('stop-typing', courseId);
      }
    },
    [socket, isConnected]
  );

  return {
    isConnected,
    messages,
    sendMessage,
    usersTyping,
    startTyping,
    stopTyping,
  };
} 