import { create } from 'zustand'
import {
  StreamState,
  StreamSettings,
  StreamStatus,
  StreamStats,
  QUALITY_PRESETS,
  StreamQuality,
  ConnectionQuality
} from '@/types/streaming'

interface StreamStore extends StreamState {
  // Actions
  setStatus: (status: StreamStatus) => void
  setMediaStream: (stream: MediaStream | null) => void
  setSettings: (settings: Partial<StreamSettings>) => void
  setQuality: (quality: StreamQuality) => void
  setError: (error: string | null) => void
  updateStats: (stats: Partial<StreamStats>) => void
  toggleAudio: () => void
  toggleVideo: () => void
  switchCamera: () => void
  reset: () => void
}

const defaultSettings: StreamSettings = {
  quality: 'medium',
  cameraFacing: 'environment',
  audioEnabled: true,
  videoEnabled: true,
  bitrate: QUALITY_PRESETS.medium.bitrate,
  framerate: QUALITY_PRESETS.medium.framerate,
  resolution: QUALITY_PRESETS.medium.resolution
}

const defaultStats: StreamStats = {
  bytesTransferred: 0,
  duration: 0,
  framesEncoded: 0,
  framesDropped: 0,
  bitrate: 0,
  connectionQuality: 'excellent'
}

const initialState: StreamState = {
  status: 'idle',
  settings: defaultSettings,
  stats: defaultStats,
  mediaStream: null,
  error: null
}

export const useStreamStore = create<StreamStore>((set, get) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setMediaStream: (mediaStream) => set({ mediaStream }),

  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),

  setQuality: (quality) => {
    const preset = QUALITY_PRESETS[quality]
    set((state) => ({
      settings: {
        ...state.settings,
        quality,
        bitrate: preset.bitrate,
        framerate: preset.framerate,
        resolution: preset.resolution
      }
    }))
  },

  setError: (error) => set({ error }),

  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats }
    })),

  toggleAudio: () => {
    const { mediaStream, settings } = get()
    const newAudioState = !settings.audioEnabled

    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = newAudioState
      })
    }

    set((state) => ({
      settings: { ...state.settings, audioEnabled: newAudioState }
    }))
  },

  toggleVideo: () => {
    const { mediaStream, settings } = get()
    const newVideoState = !settings.videoEnabled

    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = newVideoState
      })
    }

    set((state) => ({
      settings: { ...state.settings, videoEnabled: newVideoState }
    }))
  },

  switchCamera: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        cameraFacing: state.settings.cameraFacing === 'user' ? 'environment' : 'user'
      }
    }))
  },

  reset: () => set(initialState)
}))

// Helper function to calculate connection quality based on stats
export function calculateConnectionQuality(stats: StreamStats): ConnectionQuality {
  const dropRate = stats.framesEncoded > 0
    ? stats.framesDropped / stats.framesEncoded
    : 0

  if (dropRate < 0.01 && stats.bitrate > stats.bitrate * 0.9) {
    return 'excellent'
  } else if (dropRate < 0.05 && stats.bitrate > stats.bitrate * 0.7) {
    return 'good'
  } else if (dropRate < 0.15 && stats.bitrate > stats.bitrate * 0.5) {
    return 'fair'
  } else {
    return 'poor'
  }
}
