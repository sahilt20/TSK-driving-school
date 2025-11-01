'use client'

import { useCamera } from '@/lib/hooks/useCamera'
import { useStreamStore } from '@/lib/stores/streamStore'
import { Loader2, Camera, AlertCircle } from 'lucide-react'

export default function CameraPreview() {
  const { videoRef, status } = useCamera()
  const { error } = useStreamStore()

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Loading State */}
      {status === 'initializing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <p className="text-white text-lg">Initializing camera...</p>
        </div>
      )}

      {/* Idle State */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <Camera className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-300 text-lg">Camera not started</p>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90">
          <AlertCircle className="w-16 h-16 text-white mb-4" />
          <p className="text-white text-lg font-semibold mb-2">Camera Error</p>
          <p className="text-red-200 text-sm px-4 text-center">{error}</p>
        </div>
      )}

      {/* Recording Indicator */}
      {status === 'streaming' && (
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold">LIVE</span>
          </div>
        </div>
      )}

      {/* Stream Info Overlay */}
      {status === 'streaming' && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
            <StreamInfo />
          </div>
        </div>
      )}
    </div>
  )
}

function StreamInfo() {
  const { settings, stats } = useStreamStore()

  return (
    <div className="text-white text-xs space-y-1">
      <div className="flex justify-between">
        <span className="text-gray-300">Resolution:</span>
        <span className="font-semibold">
          {settings.resolution.width}x{settings.resolution.height}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-300">FPS:</span>
        <span className="font-semibold">{settings.framerate}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-300">Bitrate:</span>
        <span className="font-semibold">
          {(settings.bitrate / 1000000).toFixed(1)} Mbps
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-300">Connection:</span>
        <span className={`font-semibold ${
          stats.connectionQuality === 'excellent' ? 'text-green-400' :
          stats.connectionQuality === 'good' ? 'text-blue-400' :
          stats.connectionQuality === 'fair' ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {stats.connectionQuality.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
