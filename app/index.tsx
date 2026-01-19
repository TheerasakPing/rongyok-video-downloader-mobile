import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useVideoDownloader } from '../hooks/useVideoDownloader';
import { useDownloadStore } from '../stores/downloadStore';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const { currentDownload, downloads } = useDownloadStore();
  const { startDownload, pauseDownload, resumeDownload, cancelDownload } = useVideoDownloader();

  const handleStart = () => {
    if (!url.trim()) return;
    const finalFilename = filename.trim() || 'video.mp4';
    startDownload({
      url,
      filename: finalFilename,
      onComplete: (path) => console.log('Saved to:', path),
      onError: (error) => console.error('Error:', error),
    });
  };

  const isDownloading = currentDownload?.status === 'downloading';
  const isPaused = currentDownload?.status === 'paused';

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Video Downloader
          </Text>
          <Text className="text-slate-400">
            Download videos with pause and resume
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-slate-300 mb-2 font-medium">Video URL</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
            placeholder="https://example.com/video.mp4"
            placeholderTextColor="#64748b"
            value={url}
            onChangeText={setUrl}
          />
        </View>

        <View className="mb-6">
          <Text className="text-slate-300 mb-2 font-medium">Filename</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
            placeholder="video.mp4"
            placeholderTextColor="#64748b"
            value={filename}
            onChangeText={setFilename}
          />
        </View>

        {currentDownload && (
          <View className="mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white font-medium">{currentDownload.filename}</Text>
              <Text className="text-slate-400">{currentDownload.progress.toFixed(1)}%</Text>
            </View>
            
            <View className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
              <View 
                className="h-full bg-violet-500 rounded-full"
                style={{ width: currentDownload.progress + '%' }}
              />
            </View>

            <View className="flex-row gap-3">
              {!isDownloading && !isPaused && (
                <TouchableOpacity onPress={handleStart} className="flex-1 bg-violet-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">Start</Text>
                </TouchableOpacity>
              )}

              {isDownloading && (
                <TouchableOpacity onPress={pauseDownload} className="flex-1 bg-amber-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">Pause</Text>
                </TouchableOpacity>
              )}

              {isPaused && (
                <TouchableOpacity onPress={resumeDownload} className="flex-1 bg-emerald-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">Resume</Text>
                </TouchableOpacity>
              )}

              {(isDownloading || isPaused) && (
                <TouchableOpacity onPress={cancelDownload} className="flex-1 bg-red-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
