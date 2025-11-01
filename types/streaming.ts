export type StreamQuality = 'low' | 'medium' | 'high' | 'hd'
export type CameraFacing = 'user' | 'environment'
export type StreamStatus = 'idle' | 'initializing' | 'streaming' | 'paused' | 'error' | 'disconnected'
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor'

export interface StreamSettings {
  quality: StreamQuality
  cameraFacing: CameraFacing
  audioEnabled: boolean
  videoEnabled: boolean
  bitrate: number
  framerate: number
  resolution: {
    width: number
    height: number
  }
}

export interface StreamStats {
  bytesTransferred: number
  duration: number
  framesEncoded: number
  framesDropped: number
  bitrate: number
  connectionQuality: ConnectionQuality
}

export interface StreamState {
  status: StreamStatus
  settings: StreamSettings
  stats: StreamStats
  mediaStream: MediaStream | null
  error: string | null
}

export const QUALITY_PRESETS: Record<StreamQuality, {
  resolution: { width: number; height: number }
  bitrate: number
  framerate: number
}> = {
  low: {
    resolution: { width: 640, height: 480 },
    bitrate: 500000, // 500 kbps
    framerate: 15
  },
  medium: {
    resolution: { width: 1280, height: 720 },
    bitrate: 1500000, // 1.5 Mbps
    framerate: 30
  },
  high: {
    resolution: { width: 1280, height: 720 },
    bitrate: 2500000, // 2.5 Mbps
    framerate: 30
  },
  hd: {
    resolution: { width: 1920, height: 1080 },
    bitrate: 4500000, // 4.5 Mbps
    framerate: 30
  }
}

export interface DeviceInfo {
  deviceId: string
  label: string
  kind: MediaDeviceKind
}

export interface StreamingCapabilities {
  hasCamera: boolean
  hasMicrophone: boolean
  hasMultipleCameras: boolean
  supportedResolutions: string[]
  supportedCodecs: string[]
}
