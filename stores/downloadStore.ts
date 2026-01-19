import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  progress: number;
  downloaded: number;
  total: number;
  status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
  error?: string;
}

interface DownloadState {
  downloads: DownloadItem[];
  currentDownload: DownloadItem | null;
  
  addDownload: (url: string, filename: string) => void;
  updateProgress: (id: string, progress: number, downloaded: number) => void;
  setStatus: (id: string, status: DownloadItem['status']) => void;
  setCurrent: (download: DownloadItem | null) => void;
  removeDownload: (id: string) => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  downloads: [],
  currentDownload: null,
  
  addDownload: (url, filename) => set((state) => {
    const newDownload: DownloadItem = {
      id: Date.now().toString(),
      url,
      filename,
      progress: 0,
      downloaded: 0,
      total: 0,
      status: 'idle',
    };
    return {
      downloads: [...state.downloads, newDownload],
      currentDownload: newDownload,
    };
  }),
  
  updateProgress: (id, progress, downloaded) => set((state) => ({
    downloads: state.downloads.map((d) =>
      d.id === id ? { ...d, progress, downloaded } : d
    ),
    currentDownload: state.currentDownload?.id === id
      ? { ...state.currentDownload, progress, downloaded }
      : state.currentDownload,
  })),
  
  setStatus: (id, status) => set((state) => ({
    downloads: state.downloads.map((d) =>
      d.id === id ? { ...d, status } : d
    ),
    currentDownload: state.currentDownload?.id === id
      ? { ...state.currentDownload, status }
      : state.currentDownload,
  })),
  
  setCurrent: (download) => set({ currentDownload: download }),
  
  removeDownload: (id) => set((state) => ({
    downloads: state.downloads.filter((d) => d.id !== id),
    currentDownload: state.currentDownload?.id === id ? null : state.currentDownload,
  })),
}));
