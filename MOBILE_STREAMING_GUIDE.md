# Mobile Streaming Guide

## Overview

The Cricket Club Platform now includes a complete Progressive Web App (PWA) for mobile streaming with camera access, real-time recording, and stream quality monitoring.

## Features

### ✅ Implemented Features

1. **PWA Support**
   - Installable as mobile app
   - Offline fallback page
   - Service worker for caching
   - Manifest for app metadata

2. **Camera Access**
   - Front/back camera switching
   - Real-time preview
   - Permission handling
   - Device capability detection

3. **Stream Quality Settings**
   - Low (640x480 @ 15fps, 500kbps)
   - Medium (1280x720 @ 30fps, 1.5Mbps) - Recommended
   - High (1280x720 @ 30fps, 2.5Mbps)
   - HD (1920x1080 @ 30fps, 4.5Mbps)

4. **Recording**
   - Local video recording using MediaRecorder API
   - Real-time statistics (duration, bitrate, data transferred)
   - Download recorded streams
   - Connection quality monitoring

5. **Stream Health Monitoring**
   - Real-time bitrate monitoring
   - Connection quality indicator (Excellent/Good/Fair/Poor)
   - Network status detection
   - Frame rate monitoring

6. **Mobile Optimizations**
   - Wake lock to prevent screen sleep
   - Touch-optimized controls
   - Responsive design for all screen sizes
   - Battery-efficient streaming

## Getting Started

### Prerequisites

- Modern mobile browser (Chrome, Safari, Firefox)
- Camera and microphone permissions
- Stable internet connection (5+ Mbps recommended)

### Installation

#### Option 1: Use in Browser
1. Navigate to your deployed app URL
2. Go to `/mobile-stream`
3. Grant camera/microphone permissions when prompted

#### Option 2: Install as PWA (Recommended)
1. Open the app in your mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. The app will appear on your home screen like a native app

### Testing on Local Network

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Find Your Local IP**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet address)
   - Example: `192.168.1.100`

3. **Access from Mobile Device**
   - Connect phone to same WiFi network
   - Open browser and go to: `http://YOUR_IP:3000/mobile-stream`
   - Example: `http://192.168.1.100:3000/mobile-stream`

4. **Grant Permissions**
   - Allow camera access when prompted
   - Allow microphone access when prompted
   - On iOS, you may need to use Safari browser

## Usage Instructions

### Basic Workflow

1. **Open Mobile Streaming Page**
   - Navigate to `/mobile-stream`
   - Review device capabilities displayed at bottom

2. **Adjust Settings (Before Starting Camera)**
   - Tap "Settings" button
   - Select quality based on your internet speed:
     - Slow (2-5 Mbps): Low quality
     - Average (5-10 Mbps): Medium quality (Recommended)
     - Fast (10-20 Mbps): High quality
     - Very Fast (20+ Mbps): HD quality
   - Save settings

3. **Start Camera**
   - Tap "Start Streaming" button
   - Grant permissions if prompted
   - Camera preview will appear

4. **Control Camera**
   - **Switch Camera**: Toggle between front/back cameras
   - **Toggle Video**: Turn camera on/off (audio continues)
   - **Toggle Audio**: Mute/unmute microphone
   - Camera controls update in real-time

5. **Start Recording**
   - Once camera is active, tap "Start Recording"
   - Recording indicator appears (red dot + LIVE badge)
   - Stream monitor shows real-time stats

6. **Monitor Stream Health**
   - Check connection quality indicator:
     - 🟢 **Excellent**: >90% of target bitrate
     - 🔵 **Good**: 70-90% of target bitrate
     - 🟡 **Fair**: 50-70% of target bitrate
     - 🔴 **Poor**: <50% of target bitrate
   - Monitor duration and data transferred
   - Watch for frame drops

7. **Stop Recording**
   - Tap "Stop Recording" button
   - Recording data is saved in memory

8. **Download Recording**
   - Tap "Download Recording" button
   - Video saves to your device as `.webm` file
   - File name includes timestamp

9. **Stop Camera**
   - Tap "Stop Streaming" to release camera
   - Wake lock is released
   - Camera LED turns off

## Testing Checklist

### Device Testing

- [ ] Test on Android phone (Chrome browser)
- [ ] Test on iPhone (Safari browser)
- [ ] Test on tablet (both orientations)
- [ ] Test PWA installation ("Add to Home Screen")
- [ ] Test app launch from home screen

### Camera Testing

- [ ] Front camera works
- [ ] Back camera works
- [ ] Camera switch works smoothly
- [ ] Video preview displays correctly
- [ ] Camera LED indicator shows when active

### Permissions Testing

- [ ] Camera permission request appears
- [ ] Microphone permission request appears
- [ ] Permission denial shows clear error message
- [ ] Re-granting permissions works after initial denial

### Quality Settings Testing

- [ ] Low quality records successfully
- [ ] Medium quality records successfully
- [ ] High quality records successfully
- [ ] HD quality records successfully
- [ ] Settings persist across sessions
- [ ] Settings cannot be changed during streaming

### Recording Testing

- [ ] Recording starts successfully
- [ ] LIVE indicator appears when recording
- [ ] Timer updates every second
- [ ] Data transferred updates in real-time
- [ ] Bitrate calculation is accurate
- [ ] Recording stops cleanly
- [ ] Download produces playable video file

### Network Testing

- [ ] Works on WiFi
- [ ] Works on 4G/5G
- [ ] Handles network interruption gracefully
- [ ] Shows offline indicator when no internet
- [ ] Auto-reconnects when network restored
- [ ] Connection quality indicator is accurate

### UI/UX Testing

- [ ] All buttons are touch-friendly (min 44x44px)
- [ ] Text is readable on small screens
- [ ] Layout works in portrait orientation
- [ ] Layout works in landscape orientation
- [ ] Colors contrast well in bright sunlight
- [ ] Loading states are clear
- [ ] Error messages are helpful

### Performance Testing

- [ ] App loads quickly (<3 seconds)
- [ ] Camera preview is smooth (30fps minimum)
- [ ] No UI lag during recording
- [ ] Battery drain is reasonable
- [ ] Phone doesn't overheat during long recordings
- [ ] Memory usage stays stable

### Offline/Error Testing

- [ ] Offline page displays when no network
- [ ] Browser not supported message shows on old browsers
- [ ] Permission denied error is clear
- [ ] Camera busy error is handled
- [ ] Recording error doesn't crash app
- [ ] Error boundary catches unexpected errors

## Troubleshooting

### Camera Not Working

**Issue**: "Camera not detected" or permission errors

**Solutions**:
1. Check browser permissions in phone settings
2. Close other apps using the camera
3. Restart the browser
4. Try incognito/private mode
5. Ensure HTTPS or localhost (required for camera API)

### Poor Video Quality

**Issue**: Video is pixelated or laggy

**Solutions**:
1. Lower quality setting (Settings → Quality → Low/Medium)
2. Check internet speed (use speedtest.net)
3. Move closer to WiFi router
4. Close background apps
5. Ensure good lighting for camera

### Recording Fails

**Issue**: Recording won't start or stops unexpectedly

**Solutions**:
1. Check available storage space
2. Close and restart the app
3. Clear browser cache
4. Try a different browser
5. Check for browser updates

### App Not Installing

**Issue**: "Add to Home Screen" doesn't appear

**Solutions**:
1. Ensure you're using HTTPS (required for PWA)
2. Check browser supports PWA (Chrome, Safari, Edge)
3. Try desktop mode in browser settings
4. Clear browser cache and cookies
5. Visit root domain first, then navigate to /mobile-stream

### Screen Turns Off During Streaming

**Issue**: Phone screen locks while streaming

**Solutions**:
1. Wake lock should prevent this automatically
2. If not working, disable auto-lock in phone settings
3. Keep phone plugged in to power
4. Check wake lock permission in browser settings

## Technical Details

### Browser Support

| Browser | Camera API | Recording | PWA Install | Wake Lock |
|---------|-----------|-----------|-------------|-----------|
| Chrome (Android) | ✅ | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ✅ | ⚠️ Limited |
| Firefox (Android) | ✅ | ✅ | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ | ✅ |
| Edge (Android) | ✅ | ✅ | ✅ | ✅ |

### Supported Video Codecs

The app automatically selects the best codec:
1. VP9 with Opus (best quality)
2. VP8 with Opus (good compatibility)
3. H.264 with Opus (fallback)

### Data Usage

Approximate data usage per hour:

| Quality | Resolution | Bitrate | Data/Hour |
|---------|-----------|---------|-----------|
| Low | 640x480 | 500kbps | ~220 MB |
| Medium | 1280x720 | 1.5Mbps | ~675 MB |
| High | 1280x720 | 2.5Mbps | ~1.1 GB |
| HD | 1920x1080 | 4.5Mbps | ~2.0 GB |

### Battery Usage

Expected battery drain:
- Low quality: ~10-15% per hour
- Medium quality: ~15-20% per hour
- High quality: ~20-25% per hour
- HD quality: ~25-35% per hour

*Keep phone plugged in for extended streaming*

## Advanced Features

### Future Enhancements (Not Yet Implemented)

1. **YouTube Direct Streaming**
   - WebRTC connection to YouTube ingestion server
   - RTMPS forwarding via backend server
   - Stream key management

2. **Multi-Camera Support**
   - Picture-in-picture mode
   - Switch between multiple angles
   - Simultaneous recording from multiple devices

3. **Advanced Effects**
   - Score overlay integration
   - Real-time filters
   - Graphics overlays

4. **Cloud Upload**
   - Automatic upload to cloud storage
   - Resume interrupted uploads
   - Background upload when app is closed

## Production Deployment

### Before Going Live

1. **Replace Placeholder Icons**
   - See `public/icons/README.md`
   - Use professional cricket-themed icons
   - Ensure all sizes are provided (72px to 512px)

2. **Configure HTTPS**
   - Camera API requires HTTPS in production
   - Use Let's Encrypt for free SSL certificate
   - Configure Vercel/Netlify automatic HTTPS

3. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_STREAM_SERVER_URL=wss://stream.yourdomain.com
   ```

4. **Test on Real Devices**
   - Multiple Android devices
   - Multiple iOS devices
   - Different screen sizes
   - Various network conditions

5. **Performance Optimization**
   - Enable production PWA caching
   - Optimize image assets
   - Minimize JavaScript bundles
   - Enable CDN for static assets

### Deployment Platforms

**Recommended: Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Alternative: Netlify**
```bash
npm run build
# Drag and drop .next folder to Netlify
```

## Support

For issues or questions:
1. Check this guide first
2. Review console logs in browser (F12 → Console)
3. Test on different device/browser
4. Check GitHub issues
5. Contact support with error details

## Credits

Built with:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- next-pwa (PWA support)
- MediaRecorder API
- getUserMedia API

---

**Last Updated**: November 2025
**Version**: 1.0.0
