import { CameraFacing, DeviceInfo, StreamingCapabilities, StreamSettings } from '@/types/streaming'

/**
 * Check if media devices are supported in the current browser
 */
export function isMediaDevicesSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

/**
 * Request camera and microphone permissions
 */
export async function requestMediaPermissions(
  videoEnabled: boolean = true,
  audioEnabled: boolean = true
): Promise<MediaStream> {
  if (!isMediaDevicesSupported()) {
    throw new Error('Media devices not supported in this browser')
  }

  try {
    const constraints: MediaStreamConstraints = {
      video: videoEnabled,
      audio: audioEnabled
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    console.error('Error requesting media permissions:', error)
    throw new Error(`Permission denied: ${(error as Error).message}`)
  }
}

/**
 * Get available media devices (cameras and microphones)
 */
export async function getAvailableDevices(): Promise<{
  cameras: DeviceInfo[]
  microphones: DeviceInfo[]
}> {
  if (!isMediaDevicesSupported()) {
    return { cameras: [], microphones: [] }
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()

    const cameras = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
        kind: device.kind
      }))

    const microphones = devices
      .filter(device => device.kind === 'audioinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
        kind: device.kind
      }))

    return { cameras, microphones }
  } catch (error) {
    console.error('Error enumerating devices:', error)
    return { cameras: [], microphones: [] }
  }
}

/**
 * Get media stream with specific constraints based on settings
 */
export async function getMediaStream(settings: StreamSettings, deviceId?: string): Promise<MediaStream> {
  if (!isMediaDevicesSupported()) {
    throw new Error('Media devices not supported')
  }

  const { resolution, framerate, cameraFacing, audioEnabled, videoEnabled } = settings

  const constraints: MediaStreamConstraints = {
    video: videoEnabled ? {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      facingMode: !deviceId ? cameraFacing : undefined,
      width: { ideal: resolution.width },
      height: { ideal: resolution.height },
      frameRate: { ideal: framerate }
    } : false,
    audio: audioEnabled ? {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    } : false
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    console.error('Error getting media stream:', error)
    throw new Error(`Failed to get media stream: ${(error as Error).message}`)
  }
}

/**
 * Stop all tracks in a media stream
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return

  stream.getTracks().forEach(track => {
    track.stop()
  })
}

/**
 * Switch camera (front/back) on mobile devices
 */
export async function switchCamera(
  currentStream: MediaStream,
  settings: StreamSettings
): Promise<MediaStream> {
  stopMediaStream(currentStream)

  const newFacing: CameraFacing = settings.cameraFacing === 'user' ? 'environment' : 'user'
  const newSettings = { ...settings, cameraFacing: newFacing }

  return getMediaStream(newSettings)
}

/**
 * Get streaming capabilities of the device
 */
export async function getStreamingCapabilities(): Promise<StreamingCapabilities> {
  const devices = await getAvailableDevices()

  const hasCamera = devices.cameras.length > 0
  const hasMicrophone = devices.microphones.length > 0
  const hasMultipleCameras = devices.cameras.length > 1

  // Check supported codecs
  const supportedCodecs: string[] = []
  if (typeof MediaRecorder !== 'undefined') {
    const codecs = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
    codecs.forEach(codec => {
      if (MediaRecorder.isTypeSupported(codec)) {
        supportedCodecs.push(codec)
      }
    })
  }

  const supportedResolutions = [
    '640x480',
    '1280x720',
    '1920x1080'
  ]

  return {
    hasCamera,
    hasMicrophone,
    hasMultipleCameras,
    supportedResolutions,
    supportedCodecs
  }
}

/**
 * Check if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Request screen wake lock to prevent screen from sleeping during streaming
 */
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await navigator.wakeLock.request('screen')
      console.log('Wake lock acquired')
      return wakeLock
    } catch (error) {
      console.error('Error requesting wake lock:', error)
      return null
    }
  }
  return null
}

/**
 * Release wake lock
 */
export async function releaseWakeLock(wakeLock: WakeLockSentinel | null): Promise<void> {
  if (wakeLock) {
    try {
      await wakeLock.release()
      console.log('Wake lock released')
    } catch (error) {
      console.error('Error releasing wake lock:', error)
    }
  }
}
