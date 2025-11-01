import { useEffect, useRef, useState } from 'react'
import { useStreamStore } from '@/lib/stores/streamStore'
import { StreamRecorder } from '@/lib/streaming/recorder'
import { StreamStats } from '@/types/streaming'

export function useStreamRecorder() {
  const { mediaStream, settings, status, updateStats, setError, setStatus } = useStreamStore()
  const recorderRef = useRef<StreamRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)

  /**
   * Start recording the stream
   */
  const startRecording = async () => {
    if (!mediaStream) {
      setError('No media stream available')
      return
    }

    try {
      const recorder = new StreamRecorder({
        stream: mediaStream,
        settings,
        onDataAvailable: (data) => {
          // In a production setup, this would send data to a server
          // that forwards to YouTube RTMPS endpoint
          console.log('Data chunk available:', data.size, 'bytes')
        },
        onStats: (stats: StreamStats) => {
          updateStats(stats)
          setRecordingDuration(stats.duration)
        },
        onError: (error) => {
          console.error('Recorder error:', error)
          setError(error.message)
          setIsRecording(false)
        }
      })

      await recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setStatus('streaming')

      console.log('Recording started successfully')
    } catch (error) {
      console.error('Failed to start recording:', error)
      setError((error as Error).message)
      setIsRecording(false)
    }
  }

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop()
      setIsRecording(false)
      setRecordingDuration(0)
      console.log('Recording stopped')
    }
  }

  /**
   * Download the recorded stream
   */
  const downloadRecording = () => {
    if (recorderRef.current) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      recorderRef.current.downloadRecording(`cricket-stream-${timestamp}.webm`)
    }
  }

  /**
   * Get current recording state
   */
  const getRecordingState = () => {
    return recorderRef.current?.getState() || 'inactive'
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy()
      }
    }
  }, [])

  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours, minutes, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':')
  }

  return {
    isRecording,
    recordingDuration,
    formattedDuration: formatDuration(recordingDuration),
    startRecording,
    stopRecording,
    downloadRecording,
    getRecordingState
  }
}
