# Mobile Streaming Architecture with Embedded Score Overlay

## Overview

This document outlines the architecture for streaming cricket matches directly from a mobile device to YouTube Live with real-time score overlays embedded in the video stream.

## Architecture Goals

1. **Direct Mobile to YouTube**: Stream video directly from mobile camera to YouTube Live using RTMPS
2. **Embedded Overlay**: Render live cricket scores on top of the video feed before transmission
3. **Real-time Updates**: Score overlay updates in <100ms when scorers update the match
4. **Low Latency**: Minimize delay between capture and YouTube broadcast
5. **Battery Efficient**: Optimize for extended streaming sessions (3-4 hours for a match)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE DEVICE                           │
│                                                             │
│  ┌──────────────┐        ┌────────────────────┐            │
│  │   Camera     │───────►│  MediaStream       │            │
│  │   Input      │        │  (Video + Audio)   │            │
│  └──────────────┘        └─────────┬──────────┘            │
│                                    │                        │
│                                    ▼                        │
│                         ┌──────────────────────┐            │
│                         │   Canvas Element     │            │
│                         │  (Video Compositor)  │            │
│                         │                      │            │
│  ┌──────────────┐       │  ┌────────────────┐ │            │
│  │   Score      │──────►│  │  Video Frame   │ │            │
│  │   Overlay    │       │  └────────────────┘ │            │
│  │  Component   │       │  ┌────────────────┐ │            │
│  │              │       │  │  Score Overlay │ │            │
│  │  (React)     │       │  │  (HTML/CSS)    │ │            │
│  └──────┬───────┘       │  └────────────────┘ │            │
│         │               └──────────┬───────────┘            │
│         │                          │                        │
│  ┌──────▼───────┐                 │                        │
│  │  Supabase    │                 │                        │
│  │  Realtime    │                 ▼                        │
│  │  Subscribe   │      ┌──────────────────────┐            │
│  └──────────────┘      │  MediaRecorder /     │            │
│                        │  Canvas.captureStream│            │
│                        └──────────┬───────────┘            │
│                                   │                        │
│                                   ▼                        │
│                        ┌──────────────────────┐            │
│                        │   WebRTC / RTMP      │            │
│                        │   Encoder            │            │
│                        └──────────┬───────────┘            │
│                                   │                        │
└───────────────────────────────────┼────────────────────────┘
                                    │
                                    │ RTMPS Stream
                                    │ (H.264 Video + AAC Audio)
                                    ▼
                        ┌──────────────────────┐
                        │   YouTube Live       │
                        │   Ingestion Server   │
                        │   (rtmps://a.rtmp    │
                        │   .youtube.com/live2)│
                        └──────────────────────┘
```

## Technical Implementation

### 1. Video Capture & Compositing

**Technology**: HTML5 Canvas API + MediaStream API

**Process**:
1. Capture camera feed using `navigator.mediaDevices.getUserMedia()`
2. Create a `<canvas>` element to composite video + overlay
3. Draw video frames to canvas using `requestAnimationFrame()`
4. Render React overlay component on top of video using DOM rendering
5. Capture composite as `MediaStream` using `canvas.captureStream()`

**Code Example**:
```typescript
// lib/streaming/videoCompositor.ts
export class VideoCompositor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private videoElement: HTMLVideoElement
  private overlayElement: HTMLElement
  private stream: MediaStream | null = null

  constructor(width = 1920, height = 1080, fps = 30) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')!

    this.videoElement = document.createElement('video')
    this.overlayElement = document.getElementById('score-overlay')!
  }

  async startCompositing(cameraStream: MediaStream) {
    this.videoElement.srcObject = cameraStream
    await this.videoElement.play()

    // Start drawing loop
    this.drawFrame()

    // Capture canvas as stream
    this.stream = this.canvas.captureStream(30) // 30 fps

    // Add audio from camera
    const audioTrack = cameraStream.getAudioTracks()[0]
    if (audioTrack) {
      this.stream.addTrack(audioTrack)
    }

    return this.stream
  }

  private drawFrame = () => {
    // Draw video frame
    this.ctx.drawImage(
      this.videoElement,
      0, 0,
      this.canvas.width,
      this.canvas.height
    )

    // Draw overlay using html2canvas or direct canvas drawing
    this.renderOverlay()

    // Continue loop
    requestAnimationFrame(this.drawFrame)
  }

  private renderOverlay() {
    // Option 1: Use html2canvas to convert React component to canvas
    // Option 2: Draw overlay elements directly with Canvas API
    // For simplicity, we'll use direct drawing

    // Draw score box
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, this.canvas.height - 150, this.canvas.width, 150)

    // Draw score text (this would come from React state)
    this.ctx.fillStyle = 'white'
    this.ctx.font = 'bold 36px Arial'
    this.ctx.fillText('Score: 145/3 (15.2 overs)', 50, this.canvas.height - 100)
  }

  stopCompositing() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
    this.videoElement.pause()
  }
}
```

### 2. Real-time Overlay Updates

**Technology**: Supabase Realtime + React State

**Process**:
1. Subscribe to `live_match_state` table changes
2. Update React overlay component state on every ball
3. Canvas compositor picks up updated overlay in next frame

**Code Example**:
```typescript
// components/streaming/LiveScoreOverlay.tsx
'use client'

export function LiveScoreOverlay({ matchId }: { matchId: string }) {
  const [liveState, setLiveState] = useState<LiveMatchState>()

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`stream-overlay:${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_match_state',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setLiveState(payload.new as LiveMatchState)
      })
      .subscribe()

    // Initial fetch
    supabase
      .from('live_match_state')
      .select('*')
      .eq('match_id', matchId)
      .single()
      .then(({ data }) => data && setLiveState(data))

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  if (!liveState) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-6">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          {liveState.current_score}/{liveState.current_wickets}
        </div>
        <div className="text-xl">
          {(liveState.current_over + liveState.current_ball / 6).toFixed(1)} overs
        </div>
      </div>
      <div className="text-sm mt-2 opacity-80">
        Last ball: {liveState.last_ball_event}
      </div>
    </div>
  )
}
```

### 3. Streaming to YouTube

**Technology Options**:

#### Option A: WebRTC-based (Recommended for PWA)
- **Library**: `@api.stream/studio` or `webrtc-streamer`
- **Pros**: Native browser support, no external dependencies
- **Cons**: Requires WebRTC-to-RTMP bridge server

**Implementation**:
```typescript
// lib/streaming/youtubeStreamer.ts
import { Peer } from 'simple-peer'

export class YouTubeStreamer {
  private peer: Peer | null = null

  async startStream(compositeStream: MediaStream, streamKey: string) {
    // Connect to WebRTC-RTMP bridge
    this.peer = new Peer({
      initiator: true,
      stream: compositeStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      }
    })

    // Send offer to bridge server
    this.peer.on('signal', async (offer) => {
      const response = await fetch('https://your-bridge-server.com/start-stream', {
        method: 'POST',
        body: JSON.stringify({
          streamKey,
          offer
        })
      })

      const { answer } = await response.json()
      this.peer!.signal(answer)
    })

    this.peer.on('connect', () => {
      console.log('Streaming to YouTube!')
    })
  }

  stopStream() {
    this.peer?.destroy()
  }
}
```

#### Option B: Native RTMP (Requires Native App)
- **Library**: React Native + `react-native-nodemediaclient`
- **Pros**: Direct RTMPS connection, better performance
- **Cons**: Requires React Native app (not PWA)

**Implementation**:
```typescript
// For React Native only
import NodeCameraView from 'react-native-nodemediaclient'

<NodeCameraView
  style={{ flex: 1 }}
  ref={vb => { this.vb = vb }}
  outputUrl={`rtmps://a.rtmp.youtube.com:443/live2/${streamKey}`}
  camera={{ cameraId: 1, cameraFrontMirror: true }}
  audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
  video={{
    preset: 12, // 1080p
    bitrate: 4000000,
    profile: 1,
    fps: 30,
    videoFrontMirror: false
  }}
  autopreview={true}
/>
```

#### Option C: MediaRecorder API + Server Upload (Hybrid Approach)
- **Library**: Built-in MediaRecorder API
- **Pros**: Browser native, simple implementation
- **Cons**: Requires server to relay chunks to YouTube

**Implementation**:
```typescript
// lib/streaming/mediaRecorderStreamer.ts
export class MediaRecorderStreamer {
  private recorder: MediaRecorder | null = null
  private ws: WebSocket | null = null

  async startStream(compositeStream: MediaStream, streamKey: string) {
    // Connect to relay server
    this.ws = new WebSocket(`wss://your-relay-server.com/stream/${streamKey}`)

    // Create recorder
    this.recorder = new MediaRecorder(compositeStream, {
      mimeType: 'video/webm;codecs=h264,opus',
      videoBitsPerSecond: 4000000 // 4 Mbps
    })

    // Send chunks to server
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(event.data)
      }
    }

    // Start recording in 1-second chunks
    this.recorder.start(1000)
  }

  stopStream() {
    this.recorder?.stop()
    this.ws?.close()
  }
}
```

### 4. YouTube Live Setup

**Prerequisites**:
1. YouTube channel with live streaming enabled
2. Stream key from YouTube Studio
3. RTMPS ingestion URL: `rtmps://a.rtmp.youtube.com:443/live2/<stream-key>`

**Recommended Settings**:
- **Video**: H.264, 1080p @ 30fps, 4-6 Mbps bitrate
- **Audio**: AAC, 128 kbps, 44.1 kHz
- **Keyframe Interval**: 2 seconds
- **Latency**: Low latency mode (3-5 seconds delay)

## Recommended Implementation Stack

### For PWA (Browser-based):

```
Mobile Browser
  ├─ Camera Input (MediaStream API)
  ├─ Video Compositor (Canvas API)
  │   ├─ Video Feed
  │   └─ React Overlay Component
  ├─ Composite Stream (canvas.captureStream())
  └─ WebRTC Bridge → RTMP Server → YouTube
```

**Required Components**:
1. **Frontend** (PWA):
   - `lib/streaming/videoCompositor.ts` - Canvas-based compositor
   - `components/streaming/LiveScoreOverlay.tsx` - Overlay React component
   - `lib/streaming/youtubeStreamer.ts` - WebRTC client

2. **Bridge Server** (Node.js):
   - WebRTC receiver (using `wrtc` library)
   - FFmpeg to transcode WebRTC → RTMPS
   - Push to YouTube ingestion server

**Bridge Server Example**:
```javascript
// server/rtmp-bridge.js
const express = require('express')
const wrtc = require('wrtc')
const ffmpeg = require('fluent-ffmpeg')

app.post('/start-stream', async (req, res) => {
  const { streamKey, offer } = req.body

  const peer = new wrtc.RTCPeerConnection()

  peer.ontrack = (event) => {
    const stream = event.streams[0]

    // Pipe stream to FFmpeg
    ffmpeg()
      .input('pipe:0')
      .inputFormat('webm')
      .output(`rtmps://a.rtmp.youtube.com:443/live2/${streamKey}`)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('flv')
      .on('start', () => console.log('Streaming to YouTube'))
      .on('error', (err) => console.error(err))
      .run()
  }

  await peer.setRemoteDescription(offer)
  const answer = await peer.createAnswer()
  await peer.setLocalDescription(answer)

  res.json({ answer })
})
```

### For React Native App (Recommended for Production):

```
React Native App
  ├─ Camera Component (react-native-camera)
  ├─ Native Video Compositor
  │   ├─ Camera Feed
  │   └─ Native Overlay (SVG/Native Components)
  └─ RTMP Pusher → YouTube
       (react-native-nodemediaclient)
```

**Advantages**:
- Direct RTMPS connection (no bridge needed)
- Better performance and battery life
- Hardware encoding support
- Stable long-duration streaming

## Performance Optimizations

### 1. Battery Life
- Use hardware encoding when available
- Reduce canvas resolution during low battery
- Pause overlay updates when screen is off
- Use Wake Lock API to prevent sleep

```typescript
// Request wake lock
const wakeLock = await navigator.wakeLock.request('screen')
```

### 2. Network Adaptation
- Monitor connection quality
- Dynamically adjust bitrate
- Buffer for unstable connections

```typescript
// Monitor connection
const connection = navigator.connection
connection.addEventListener('change', () => {
  if (connection.effectiveType === '4g') {
    // Use high quality
    setBitrate(6000000) // 6 Mbps
  } else {
    // Use lower quality
    setBitrate(2000000) // 2 Mbps
  }
})
```

### 3. Overlay Rendering
- Use CSS transforms for animations (GPU accelerated)
- Debounce rapid score updates
- Memoize overlay components

```typescript
// Debounce score updates
const debouncedUpdate = useMemo(
  () => debounce((newState) => setLiveState(newState), 100),
  []
)
```

## Testing Checklist

- [ ] Camera permissions work on iOS and Android
- [ ] Overlay updates in <100ms on score change
- [ ] Stream maintains 1080p @ 30fps consistently
- [ ] Battery lasts 3+ hours while streaming
- [ ] Network interruptions don't crash the stream
- [ ] Overlay is readable on YouTube playback
- [ ] Audio is in sync with video
- [ ] Portrait and landscape modes work
- [ ] Works on poor network (3G/4G)

## Future Enhancements

1. **Multi-camera Support**: Switch between cameras during stream
2. **Graphics Package**: Professional score graphics templates
3. **Replay System**: Instant replay capability
4. **Stats Overlay**: Show player stats on demand
5. **Chat Integration**: Display YouTube live chat on stream
6. **Auto-highlight**: AI-based highlight detection
7. **Multi-platform**: Stream to Facebook, Twitch simultaneously

## Security Considerations

1. **Stream Key Protection**: Store YouTube stream keys securely (encrypted)
2. **User Authentication**: Only authorized users can start streams
3. **Rate Limiting**: Prevent stream spam
4. **Encryption**: Use RTMPS (not plain RTMP)

## Cost Estimate

### PWA Approach:
- **Bridge Server**: $10-20/month (Digital Ocean droplet)
- **YouTube**: Free (monetization available)
- **Total**: ~$20/month

### React Native Approach:
- **App Store fees**: $99/year (iOS) + $25 (Android one-time)
- **YouTube**: Free
- **Total**: ~$100-125/year

## Conclusion

For immediate MVP, recommend **PWA approach with WebRTC bridge** as it:
- Works on all devices without app install
- Faster development cycle
- Easier updates (no app store approval)

For production, recommend **React Native app** for:
- Better performance and reliability
- Professional-grade streaming
- Better user experience
- Hardware encoding support
