'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Video, VideoOff, Square, Circle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function BrowserStreamContent() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLIFrameElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState('')
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    // Get available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(deviceList => {
        const cameras = deviceList.filter(d => d.kind === 'videoinput')
        setDevices(cameras)
        if (cameras.length > 0) {
          setDeviceId(cameras[0].deviceId)
        }
      })
  }, [])

  async function startCamera() {
    try {
      setError('')

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      setIsStreaming(true)
      startCompositing(mediaStream)
    } catch (err: any) {
      setError(`Camera Error: ${err.message}`)
      console.error('Camera error:', err)
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
    setIsStreaming(false)
    setIsRecording(false)
  }

  function startCompositing(mediaStream: MediaStream) {
    const canvas = canvasRef.current
    const video = videoRef.current
    const overlay = overlayRef.current

    if (!canvas || !video || !overlay) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function drawFrame() {
      if (!isStreaming) return

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Draw overlay (we'll composite the iframe content)
      // Note: Direct iframe drawing requires same-origin or CORS
      // For production, overlay should be rendered directly on canvas

      requestAnimationFrame(drawFrame)
    }

    drawFrame()
  }

  async function startRecording() {
    const canvas = canvasRef.current
    if (!canvas || !stream) return

    try {
      // Capture canvas stream
      const canvasStream = canvas.captureStream(30) // 30 fps

      // Add audio from original stream
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        canvasStream.addTrack(audioTrack)
      }

      // Create recorder
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 4000000 // 4 Mbps
      }

      const mediaRecorder = new MediaRecorder(canvasStream, options)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)

        // Download the recording
        const a = document.createElement('a')
        a.href = url
        a.download = `cricket-stream-${Date.now()}.webm`
        a.click()
      }

      mediaRecorder.start(1000) // Collect data every 1 second
      setRecorder(mediaRecorder)
      setIsRecording(true)
    } catch (err: any) {
      setError(`Recording Error: ${err.message}`)
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
      setIsRecording(false)
    }
  }

  const overlayUrl = matchId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/stream-overlay?match=${matchId}` : ''

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/stream" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Browser Live Streaming (Beta)</h1>
              <p className="text-white text-sm">Direct camera + overlay streaming</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Warning */}
        <div className="bg-yellow-900/50 border-2 border-yellow-600 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-yellow-200 mb-2">Beta Feature</p>
            <p className="text-sm text-yellow-100">
              This feature records video locally. For actual YouTube streaming, use the recommended mobile apps or OBS setup.
              Direct browser-to-YouTube streaming requires additional server setup.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Controls */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Camera Controls</h2>

              {!isStreaming ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      Select Camera
                    </label>
                    <select
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
                    >
                      {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${devices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={startCamera}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Start Camera
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-green-900/30 border-2 border-green-600 rounded-lg">
                    <p className="text-green-300 font-bold flex items-center gap-2">
                      <Circle className="w-4 h-4 fill-current" />
                      Camera Active
                    </p>
                  </div>

                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mb-3"
                    >
                      <Circle className="w-5 h-5 fill-current animate-pulse" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mb-3"
                    >
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </button>
                  )}

                  <button
                    onClick={stopCamera}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <VideoOff className="w-5 h-5" />
                    Stop Camera
                  </button>
                </>
              )}

              {error && (
                <div className="mt-4 bg-red-900/50 border-2 border-red-600 rounded-lg p-3">
                  <p className="text-red-200 text-sm font-bold">{error}</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold mb-3">📝 How to Use</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside text-gray-300">
                <li>Select your camera</li>
                <li>Click "Start Camera"</li>
                <li>Grant camera permissions</li>
                <li>Click "Start Recording" to save locally</li>
                <li>Recording will download when stopped</li>
              </ol>
            </div>
          </div>

          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Live Preview</h2>

              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {/* Hidden video element */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                />

                {/* Canvas for compositing */}
                <canvas
                  ref={canvasRef}
                  width={1920}
                  height={1080}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Overlay iframe */}
                {matchId && (
                  <iframe
                    ref={overlayRef}
                    src={overlayUrl}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ background: 'transparent' }}
                  />
                )}

                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Camera not started</p>
                    </div>
                  </div>
                )}

                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                    <Circle className="w-4 h-4 fill-current" />
                    RECORDING
                  </div>
                )}
              </div>

              <div className="mt-4 bg-blue-900/30 border-2 border-blue-600 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> This preview shows camera + overlay composite.
                  For actual YouTube streaming, use recommended mobile apps (Larix) or OBS Studio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowserStreamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading stream...</div>
      </div>
    }>
      <BrowserStreamContent />
    </Suspense>
  )
}
