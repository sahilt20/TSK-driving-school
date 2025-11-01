'use client'

import { useState, useEffect } from 'react'
import CameraPreview from '@/components/streaming/CameraPreview'
import StreamControls from '@/components/streaming/StreamControls'
import StreamSettings from '@/components/streaming/StreamSettings'
import ConnectionStatus from '@/components/streaming/ConnectionStatus'
import StreamMonitor from '@/components/streaming/StreamMonitor'
import { useStreamStore } from '@/lib/stores/streamStore'
import { useStreamRecorder } from '@/lib/hooks/useStreamRecorder'
import { getStreamingCapabilities, isMediaDevicesSupported } from '@/lib/streaming/mediaDevices'
import { ArrowLeft, Info, AlertTriangle, Play, Square } from 'lucide-react'
import Link from 'next/link'

export default function MobileStreamPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [capabilities, setCapabilities] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)
  const { status, mediaStream } = useStreamStore()
  const { isRecording, startRecording, stopRecording } = useStreamRecorder()

  useEffect(() => {
    // Check if media devices are supported
    const supported = isMediaDevicesSupported()
    setIsSupported(supported)

    if (supported) {
      // Get streaming capabilities
      getStreamingCapabilities().then(caps => {
        setCapabilities(caps)
      })
    }
  }, [])

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Browser Not Supported
          </h1>
          <p className="text-gray-600 mb-6">
            Your browser does not support camera access. Please use a modern browser like Chrome, Safari, or Firefox.
          </p>
          <Link
            href="/stream-setup"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View Setup Guide
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/stream-setup"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold">Mobile Streaming</h1>
                <p className="text-sm text-red-100">Cricket Club Platform</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-blue-600 text-white px-4 py-3 text-sm">
          <div className="container mx-auto">
            <p className="mb-2 font-semibold">Streaming Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-100">
              <li>Grant camera and microphone permissions when prompted</li>
              <li>Adjust quality settings based on your internet speed</li>
              <li>Keep your phone charged or connected to power</li>
              <li>Ensure stable WiFi or 4G/5G connection</li>
              <li>Position phone on a tripod or stable mount</li>
            </ol>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-2 text-sm underline"
            >
              Hide Instructions
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Connection Status */}
          <ConnectionStatus />

          {/* Camera Preview */}
          <div className="bg-white rounded-xl p-4 shadow-xl">
            <CameraPreview />
          </div>

          {/* Stream Controls */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Stream Controls</h2>
            <StreamControls onSettingsClick={() => setSettingsOpen(true)} />
          </div>

          {/* Recording Controls */}
          {status === 'streaming' && (
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recording</h2>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!mediaStream}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-6 h-6 fill-current" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>Start Recording</span>
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-3 text-center">
                {isRecording
                  ? 'Recording in progress. Video will be saved locally.'
                  : 'Start recording to save the stream locally.'}
              </p>
            </div>
          )}

          {/* Stream Monitor */}
          {isRecording && <StreamMonitor />}

          {/* Capabilities Info */}
          {capabilities && (
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Device Capabilities</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${capabilities.hasCamera ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    Camera {capabilities.hasCamera ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${capabilities.hasMicrophone ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    Microphone {capabilities.hasMicrophone ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${capabilities.hasMultipleCameras ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-gray-700">
                    {capabilities.hasMultipleCameras ? 'Multiple Cameras' : 'Single Camera'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${capabilities.supportedCodecs.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    {capabilities.supportedCodecs.length} Codec(s)
                  </span>
                </div>
              </div>

              {!capabilities.hasCamera && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    No camera detected. Please ensure camera permissions are granted.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-3">Pro Tips for Best Quality</h3>
            <ul className="space-y-2 text-sm text-green-50">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Use landscape orientation for wider coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Position camera to capture full field view</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Avoid shooting directly into the sun</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Test stream quality before match starts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Have backup battery or charger ready</span>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="flex gap-4 pb-6">
            <Link
              href="/matches"
              className="flex-1 text-center px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Matches
            </Link>
            <Link
              href="/stream-setup"
              className="flex-1 text-center px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Setup Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <StreamSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Prevent screen sleep during streaming */}
      <style jsx global>{`
        body {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  )
}
