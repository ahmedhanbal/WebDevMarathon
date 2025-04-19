import { useState, useEffect, useRef, useCallback } from 'react';

interface VideoProgressOptions {
  videoId: string;
  courseId: string;
  duration: number;
  initialProgress?: number;
  updateInterval?: number;
  onProgressUpdate?: (progress: VideoProgress) => void;
}

interface VideoProgress {
  videoId: string;
  courseId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  lastPosition: number;
  progressPercentage: number;
}

export function useVideoProgress({
  videoId,
  courseId,
  duration,
  initialProgress = 0,
  updateInterval = 5000, // Update every 5 seconds by default
  onProgressUpdate,
}: VideoProgressOptions) {
  const [watchedSeconds, setWatchedSeconds] = useState<number>(initialProgress);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastUpdateTime = useRef<number>(Date.now());
  const progressUpdateTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (watchedSeconds / duration) * 100 : 0;
  
  // Update progress to server
  const updateProgress = useCallback(async (force = false) => {
    // Don't update if not enough time has passed and it's not forced
    const now = Date.now();
    if (!force && now - lastUpdateTime.current < updateInterval) {
      return;
    }
    
    lastUpdateTime.current = now;
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          courseId,
          watchedSeconds,
          isCompleted,
          totalDuration: duration,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update progress');
      }
      
      const data = await response.json();
      
      if (onProgressUpdate) {
        onProgressUpdate({
          videoId,
          courseId,
          watchedSeconds,
          isCompleted,
          lastPosition: watchedSeconds,
          progressPercentage,
        });
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  }, [videoId, courseId, watchedSeconds, isCompleted, duration, updateInterval, onProgressUpdate, progressPercentage]);
  
  // Start or stop progress tracking
  useEffect(() => {
    if (isPlaying) {
      // Create timer to update watched seconds while playing
      const timer = setInterval(() => {
        setWatchedSeconds(prev => {
          const newValue = prev + 1;
          // Check if video is completed (90% watched)
          if (newValue >= duration * 0.9 && !isCompleted) {
            setIsCompleted(true);
          }
          return newValue;
        });
      }, 1000);
      
      // Create timer to periodically send progress updates to server
      progressUpdateTimer.current = setInterval(() => {
        updateProgress();
      }, updateInterval);
      
      return () => {
        clearInterval(timer);
        if (progressUpdateTimer.current) {
          clearInterval(progressUpdateTimer.current);
        }
      };
    } else if (progressUpdateTimer.current) {
      // If video is paused, clear the update timer
      clearInterval(progressUpdateTimer.current);
      progressUpdateTimer.current = null;
      
      // Update progress when pausing
      updateProgress(true);
    }
  }, [isPlaying, updateProgress, duration, isCompleted, updateInterval]);
  
  // Update progress when unmounting
  useEffect(() => {
    return () => {
      updateProgress(true);
    };
  }, [updateProgress]);
  
  // Handle time updates from video player
  const handleTimeUpdate = (currentTime: number) => {
    setWatchedSeconds(currentTime);
    
    // Check if video is completed
    if (currentTime >= duration * 0.9 && !isCompleted) {
      setIsCompleted(true);
    }
  };
  
  // Handle play/pause
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  // Handle seeking
  const handleSeek = (newTime: number) => {
    setWatchedSeconds(newTime);
  };
  
  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    updateProgress(true);
  };
  
  return {
    watchedSeconds,
    progressPercentage,
    isCompleted,
    isSaving,
    error,
    updateProgress,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleSeek,
    handleEnded,
  };
} 