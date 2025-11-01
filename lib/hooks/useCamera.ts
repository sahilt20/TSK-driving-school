import { useEffect, useRef, useState } from 'react'
import { useStreamStore } from '@/lib/stores/streamStore'
import {
  getMediaStream,
  stopMediaStream,
  requestWakeLock,
  releaseWakeLock
} from '@/lib/streaming/mediaDevices'

export function useCamera() {
  const {
    mediaStream,
    settings,
    status,
    setMediaStream,
    setStatus,
    setError
  } = useStreamStore()

  const videoRef = useRef<HTMLVideoElement>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  // Initialize camera
  const startCamera = async (deviceId?: string) => {
    try {
      setStatus('initializing')
      setError(null)

      const stream = await getMediaStream(settings, deviceId)
      setMediaStream(stream)

      // Acquire wake lock
      wakeLockRef.current = await requestWakeLock()

      setStatus('streaming')
    } catch (error) {
      console.error('Error starting camera:', error)
      setError((error as Error).message)
      setStatus('error')
    }
  }

  // Stop camera
  const stopCamera = async () => {
    stopMediaStream(mediaStream)
    setMediaStream(null)

    // Release wake lock
    await releaseWakeLock(wakeLockRef.current)
    wakeLockRef.current = null

    setStatus('idle')
  }

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream(mediaStream)
      releaseWakeLock(wakeLockRef.current)
    }
  }, [])

  // Re-acquire wake lock if it's released (e.g., page becomes visible again)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && status === 'streaming' && !wakeLockRef.current) {
        wakeLockRef.current = await requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [status])

  return {
    videoRef,
    mediaStream,
    status,
    startCamera,
    stopCamera
  }
}
