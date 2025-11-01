'use client'

import { useStreamStore } from '@/lib/stores/streamStore'
import { useCamera } from '@/lib/hooks/useCamera'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Camera,
  Play,
  Square,
  RotateCw,
  Settings as SettingsIcon
} from 'lucide-react'
import { useState } from 'react'

interface StreamControlsProps {
  onSettingsClick?: () => void
}

export default function StreamControls({ onSettingsClick }: StreamControlsProps) {
  const { status, settings, toggleAudio, toggleVideo, switchCamera } = useStreamStore()
  const { startCamera, stopCamera } = useCamera()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartStop = async () => {
    if (status === 'idle' || status === 'error') {
      setIsStarting(true)
      await startCamera()
      setIsStarting(false)
    } else if (status === 'streaming') {
      await stopCamera()
    }
  }

  const handleSwitchCamera = async () => {
    switchCamera()
    if (status === 'streaming') {
      await stopCamera()
      await startCamera()
    }
  }

  const isStreaming = status === 'streaming'
  const isDisabled = status === 'initializing' || isStarting

  return (
    <div className="space-y-4">
      {/* Main Control Button */}
      <button
        onClick={handleStartStop}
        disabled={isDisabled}
        className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
          isStreaming
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isDisabled ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Starting...</span>
          </>
        ) : isStreaming ? (
          <>
            <Square className="w-6 h-6 fill-current" />
            <span>Stop Streaming</span>
          </>
        ) : (
          <>
            <Play className="w-6 h-6 fill-current" />
            <span>Start Streaming</span>
          </>
        )}
      </button>

      {/* Control Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          disabled={!isStreaming}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
            settings.videoEnabled
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-red-500 bg-red-50 text-red-700'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {settings.videoEnabled ? (
            <Video className="w-8 h-8" />
          ) : (
            <VideoOff className="w-8 h-8" />
          )}
          <span className="text-sm font-medium">
            {settings.videoEnabled ? 'Video On' : 'Video Off'}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          disabled={!isStreaming}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
            settings.audioEnabled
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-red-500 bg-red-50 text-red-700'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {settings.audioEnabled ? (
            <Mic className="w-8 h-8" />
          ) : (
            <MicOff className="w-8 h-8" />
          )}
          <span className="text-sm font-medium">
            {settings.audioEnabled ? 'Audio On' : 'Audio Off'}
          </span>
        </button>

        {/* Switch Camera */}
        <button
          onClick={handleSwitchCamera}
          disabled={isDisabled}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCw className="w-8 h-8" />
          <span className="text-sm font-medium">Switch Camera</span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          disabled={isStreaming}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-500 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SettingsIcon className="w-8 h-8" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className={`p-3 rounded-lg text-center text-sm font-medium ${
        status === 'streaming' ? 'bg-green-100 text-green-800' :
        status === 'initializing' ? 'bg-blue-100 text-blue-800' :
        status === 'error' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-600'
      }`}>
        {status === 'streaming' && 'Streaming Active'}
        {status === 'initializing' && 'Initializing...'}
        {status === 'error' && 'Error - Check camera permissions'}
        {status === 'idle' && 'Ready to stream'}
      </div>
    </div>
  )
}
