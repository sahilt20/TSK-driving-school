import { StreamSettings, StreamStats } from '@/types/streaming'

export interface RecorderConfig {
  stream: MediaStream
  settings: StreamSettings
  onDataAvailable?: (data: Blob) => void
  onStats?: (stats: StreamStats) => void
  onError?: (error: Error) => void
}

export class StreamRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private stream: MediaStream
  private settings: StreamSettings
  private stats: StreamStats
  private startTime: number = 0
  private statsInterval: NodeJS.Timeout | null = null
  private chunks: Blob[] = []

  private onDataAvailable?: (data: Blob) => void
  private onStats?: (stats: StreamStats) => void
  private onError?: (error: Error) => void

  constructor(config: RecorderConfig) {
    this.stream = config.stream
    this.settings = config.settings
    this.onDataAvailable = config.onDataAvailable
    this.onStats = config.onStats
    this.onError = config.onError

    this.stats = {
      bytesTransferred: 0,
      duration: 0,
      framesEncoded: 0,
      framesDropped: 0,
      bitrate: 0,
      connectionQuality: 'excellent'
    }
  }

  /**
   * Start recording the media stream
   */
  async start(): Promise<void> {
    try {
      // Determine the best codec
      const mimeType = this.getSupportedMimeType()

      if (!mimeType) {
        throw new Error('No supported video codec found')
      }

      // Create MediaRecorder with optimal settings
      const options: MediaRecorderOptions = {
        mimeType,
        videoBitsPerSecond: this.settings.bitrate,
        audioBitsPerSecond: 128000 // 128 kbps for audio
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options)

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data)
          this.stats.bytesTransferred += event.data.size

          // Call callback with data
          if (this.onDataAvailable) {
            this.onDataAvailable(event.data)
          }
        }
      }

      this.mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event)
        const error = new Error('MediaRecorder error occurred')
        if (this.onError) {
          this.onError(error)
        }
      }

      this.mediaRecorder.onstart = () => {
        console.log('Recording started')
        this.startTime = Date.now()
        this.startStatsMonitoring()
      }

      this.mediaRecorder.onstop = () => {
        console.log('Recording stopped')
        this.stopStatsMonitoring()
      }

      // Start recording with 1 second timeslice
      // This means data will be available every 1 second
      this.mediaRecorder.start(1000)

    } catch (error) {
      console.error('Error starting recorder:', error)
      throw error
    }
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      this.stopStatsMonitoring()
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
    }
  }

  /**
   * Get current recording state
   */
  getState(): RecordingState {
    return this.mediaRecorder?.state || 'inactive'
  }

  /**
   * Get all recorded chunks as a single Blob
   */
  getRecordedBlob(): Blob | null {
    if (this.chunks.length === 0) return null

    const mimeType = this.getSupportedMimeType()
    return new Blob(this.chunks, { type: mimeType || 'video/webm' })
  }

  /**
   * Download the recorded video
   */
  downloadRecording(filename: string = 'cricket-stream.webm'): void {
    const blob = this.getRecordedBlob()
    if (!blob) {
      console.warn('No recording to download')
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Get current stats
   */
  getStats(): StreamStats {
    return { ...this.stats }
  }

  /**
   * Start monitoring stats
   */
  private startStatsMonitoring(): void {
    this.statsInterval = setInterval(() => {
      this.updateStats()
    }, 1000) // Update every second
  }

  /**
   * Stop monitoring stats
   */
  private stopStatsMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval)
      this.statsInterval = null
    }
  }

  /**
   * Update recording stats
   */
  private updateStats(): void {
    const now = Date.now()
    this.stats.duration = Math.floor((now - this.startTime) / 1000)

    // Calculate current bitrate (bytes per second * 8 to get bits per second)
    if (this.stats.duration > 0) {
      this.stats.bitrate = Math.floor(
        (this.stats.bytesTransferred * 8) / this.stats.duration
      )
    }

    // Estimate connection quality based on bitrate vs target bitrate
    const targetBitrate = this.settings.bitrate
    const actualRatio = this.stats.bitrate / targetBitrate

    if (actualRatio >= 0.9) {
      this.stats.connectionQuality = 'excellent'
    } else if (actualRatio >= 0.7) {
      this.stats.connectionQuality = 'good'
    } else if (actualRatio >= 0.5) {
      this.stats.connectionQuality = 'fair'
    } else {
      this.stats.connectionQuality = 'poor'
    }

    // Call stats callback
    if (this.onStats) {
      this.onStats({ ...this.stats })
    }
  }

  /**
   * Get supported MIME type for recording
   */
  private getSupportedMimeType(): string | null {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return null
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop()
    this.chunks = []
    this.mediaRecorder = null
  }
}

/**
 * WebSocket-based streaming to backend server
 * This would connect to a backend that forwards to YouTube RTMPS
 */
export class WebSocketStreamer {
  private ws: WebSocket | null = null
  private recorder: StreamRecorder | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000

  constructor(
    private serverUrl: string,
    private config: RecorderConfig
  ) {}

  /**
   * Connect to streaming server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl)

        this.ws.onopen = () => {
          console.log('Connected to streaming server')
          this.reconnectAttempts = 0

          // Send configuration
          this.ws?.send(JSON.stringify({
            type: 'config',
            settings: this.config.settings
          }))

          resolve()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(new Error('Failed to connect to streaming server'))
        }

        this.ws.onclose = () => {
          console.log('Disconnected from streaming server')
          this.handleDisconnect()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Start streaming
   */
  async startStreaming(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to streaming server')
    }

    // Create recorder that sends data via WebSocket
    this.recorder = new StreamRecorder({
      ...this.config,
      onDataAvailable: (data) => {
        this.sendStreamData(data)
      }
    })

    await this.recorder.start()
  }

  /**
   * Stop streaming
   */
  stopStreaming(): void {
    if (this.recorder) {
      this.recorder.stop()
      this.recorder = null
    }

    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'stop' }))
    }
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    this.stopStreaming()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * Send stream data to server
   */
  private sendStreamData(data: Blob): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      data.arrayBuffer().then(buffer => {
        this.ws?.send(buffer)
      })
    }
  }

  /**
   * Handle WebSocket disconnect
   */
  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`)

      setTimeout(() => {
        this.reconnectAttempts++
        this.connect().catch(console.error)
      }, this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
      if (this.config.onError) {
        this.config.onError(new Error('Connection lost'))
      }
    }
  }

  /**
   * Handle messages from server
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data)

      switch (message.type) {
        case 'stats':
          if (this.config.onStats) {
            this.config.onStats(message.stats)
          }
          break
        case 'error':
          console.error('Server error:', message.error)
          if (this.config.onError) {
            this.config.onError(new Error(message.error))
          }
          break
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing server message:', error)
    }
  }
}
