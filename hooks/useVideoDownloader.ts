import { useRef, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useDownloadStore } from '../stores/downloadStore';

interface DownloadOptions {
  url: string;
  filename: string;
  onProgress?: (progress: number) => void;
  onComplete?: (path: string) => void;
  onError?: (error: string) => void;
}

export function useVideoDownloader() {
  const downloadRef = useRef<FileSystem.DownloadResumable | null>(null);
  const { currentDownload, updateProgress, setStatus } = useDownloadStore();

  const startDownload = useCallback(async ({ url, filename, onProgress, onComplete, onError }: DownloadOptions) => {
    try {
      // Request notification permissions
      await Notifications.requestPermissionsAsync();

      const downloadDir = FileSystem.documentDirectory!;
      const filePath = `${downloadDir}${filename}`;
      
      // Check for existing partial download
      let resumeData = null;
      try {
        const savedData = await AsyncStorage.getItem(`resume_${filename}`);
        if (savedData) {
          resumeData = JSON.parse(savedData);
        }
      } catch (e) {
        // No saved data
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        filePath,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
          },
        },
        (progress) => {
          const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100;
          updateProgress(currentDownload?.id || '', percent, progress.totalBytesWritten);
          onProgress?.(percent);
        }
      );

      downloadRef.current = downloadResumable;

      if (resumeData) {
        // Resume from saved state
        await (downloadResumable as any).resumeAsync();
        await AsyncStorage.removeItem(`resume_${filename}`);
      } else {
        // Start fresh download
        const result = await downloadResumable.downloadAsync();
        if (result?.uri) {
          setStatus(currentDownload?.id || '', 'completed');
          onComplete?.(result.uri);
          
          // Send notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Download Complete',
              body: `${filename} has been downloaded`,
            },
            trigger: null,
          });
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Download failed';
      onError?.(errorMsg);
      setStatus(currentDownload?.id || '', 'error');
    }
  }, [currentDownload, updateProgress, setStatus]);

  const pauseDownload = useCallback(async () => {
    if (downloadRef.current) {
      try {
        const pauseResult = await downloadRef.current.pauseAsync();
        // Save resume data
        await AsyncStorage.setItem(`resume_${currentDownload?.filename}`, JSON.stringify(pauseResult));
        setStatus(currentDownload?.id || '', 'paused');
      } catch (error) {
        console.error('Pause failed:', error);
      }
    }
  }, [currentDownload, setStatus]);

  const resumeDownload = useCallback(async () => {
    if (downloadRef.current) {
      try {
        setStatus(currentDownload?.id || '', 'downloading');
        await (downloadRef.current as any).resumeAsync();
      } catch (error) {
        console.error('Resume failed:', error);
      }
    }
  }, [currentDownload, setStatus]);

  const cancelDownload = useCallback(async () => {
    if (downloadRef.current) {
      try {
        // Delete partial file
        const filePath = `${FileSystem.documentDirectory!}${currentDownload?.filename}`;
        await FileSystem.deleteAsync(filePath, { idempotent: true });
        
        // Clear resume data
        await AsyncStorage.removeItem(`resume_${currentDownload?.filename}`);
        
        setStatus(currentDownload?.id || '', 'idle');
        downloadRef.current = null;
      } catch (error) {
        console.error('Cancel failed:', error);
      }
    }
  }, [currentDownload, setStatus]);

  return {
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
  };
}
