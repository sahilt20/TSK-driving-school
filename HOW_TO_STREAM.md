# How to Stream Cricket Matches Live to YouTube

## Overview

Stream your cricket matches live to YouTube with real-time score overlay using your mobile phone or computer.

## Quick Setup (5 Minutes)

### Step 1: Get YouTube Stream Key

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "**Go Live**" or "**Create**" → "**Go Live**"
3. Copy your **Stream Key** (keep this private!)
4. Note the Stream URL: `rtmps://a.rtmp.youtube.com:443/live2`

### Step 2: Choose Your Streaming Method

**🎯 Recommended for Mobile:** Larix Broadcaster (Free)
**🎯 Recommended for Desktop:** OBS Studio (Free)

---

## Method 1: Mobile Streaming (Easiest)

### Using Larix Broadcaster

**Download:**
- [Android - Google Play](https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster)
- [iOS - App Store](https://apps.apple.com/app/larix-broadcaster/id1042474385)

**Setup Steps:**

1. **Open Larix Broadcaster**

2. **Add YouTube Connection:**
   - Tap Settings ⚙️
   - Tap "Connections"
   - Tap "+" to add new connection
   - Select "RTMP/RTMPS"
   - Enter:
     - **Name:** YouTube Live
     - **URL:** `rtmps://a.rtmp.youtube.com:443/live2`
     - **Stream Key:** [Your YouTube stream key]
   - Save

3. **Add Score Overlay:**
   - Go to your cricket app at: `http://localhost:3000/stream`
   - Select your match
   - Copy the overlay URL
   - In Larix, tap "Settings" → "Overlays"
   - Add "Browser Source"
   - Paste overlay URL
   - Position at bottom of screen
   - Set size to 100% width, 20% height

4. **Start Streaming:**
   - Grant camera and microphone permissions
   - Select back camera (for landscape)
   - Tap the red record button
   - Your stream is now live on YouTube!

**Pro Tips:**
- Use WiFi or 4G/5G with good signal
- Keep phone plugged into power or use power bank
- Mount phone on tripod for stable footage
- Test stream 30 minutes before match

---

## Method 2: Desktop Streaming with OBS

### Using OBS Studio

**Download:** [obsproject.com/download](https://obsproject.com/download)

**Setup Steps:**

1. **Install OBS Studio**

2. **Configure YouTube Streaming:**
   - Open OBS Studio
   - Go to **Settings** → **Stream**
   - Service: **YouTube - RTMPS**
   - Server: Keep default (Primary YouTube ingest server)
   - Stream Key: [Paste your YouTube stream key]
   - Click **OK**

3. **Add Camera Source:**
   - In "Sources" panel, click **+**
   - Select **Video Capture Device**
   - Name it "Camera"
   - Choose your camera (webcam or connected phone)
   - Set resolution to 1920x1080 (1080p)
   - Click **OK**

4. **Add Score Overlay:**
   - Go to `http://localhost:3000/stream` in browser
   - Select your match
   - Copy the overlay URL
   - In OBS Sources, click **+**
   - Select **Browser Source**
   - Name it "Score Overlay"
   - Paste overlay URL
   - Set Width: **1920**, Height: **300**
   - Check "Shutdown source when not visible"
   - Click **OK**
   - Position overlay at bottom of screen

5. **Configure Output Settings:**
   - Settings → **Output**
   - Output Mode: **Advanced**
   - Encoder: **x264** (or hardware encoder if available)
   - Bitrate: **4000-6000 Kbps** for 1080p
   - Keyframe Interval: **2 seconds**
   - Preset: **veryfast**
   - Profile: **high**

6. **Start Streaming:**
   - Click **Start Streaming** button
   - Check YouTube Studio to confirm stream is live
   - Monitor stream health (should show green)

**Recommended OBS Settings:**
```
Video:
- Base Resolution: 1920x1080
- Output Resolution: 1920x1080
- FPS: 30

Output:
- Bitrate: 4000-6000 Kbps
- Encoder: x264 (CPU) or NVENC (NVIDIA GPU)
- Keyframe: 2 seconds

Audio:
- Sample Rate: 44.1 kHz
- Bitrate: 128 kbps
```

---

## Method 3: Browser Streaming (Experimental)

For advanced users who want browser-based streaming:

1. Visit: `http://localhost:3000/stream-live?match=[match-id]`
2. Grant camera permissions
3. Click "Start Camera"
4. Click "Start Recording" to save locally

**Note:** Direct browser-to-YouTube streaming requires additional server setup. This method currently records locally.

---

## Overlay Customization

The score overlay automatically shows:
- ✅ Current score (runs/wickets)
- ✅ Overs bowled
- ✅ Current run rate
- ✅ Batsmen names and stats
- ✅ Current bowler stats
- ✅ Last ball event (FOUR, SIX, WICKET)
- ✅ Live updates (real-time)

**Accessing Overlay:**
1. Go to `/stream` page
2. Select your match
3. Copy overlay URL
4. Use in Larix or OBS as browser source

**Overlay URL Format:**
```
http://localhost:3000/stream-overlay?match=[match-id]
```

---

## Troubleshooting

### Stream Not Starting
- ✅ Check stream key is correct
- ✅ Verify internet connection (minimum 5 Mbps upload)
- ✅ Ensure YouTube account is verified for live streaming
- ✅ Check if YouTube has enabled live streaming (may take 24h for new accounts)

### Overlay Not Showing
- ✅ Verify match is started and scoring has begun
- ✅ Check overlay URL includes correct match ID
- ✅ Ensure browser source size is set correctly
- ✅ Try refreshing browser source in OBS

### Poor Stream Quality
- ✅ Reduce bitrate (try 2500-3000 Kbps)
- ✅ Switch to wired connection instead of WiFi
- ✅ Close other bandwidth-heavy applications
- ✅ Lower resolution to 720p if needed

### Overlay Not Updating
- ✅ Check if scorer is updating scores
- ✅ Verify internet connection on both devices
- ✅ Refresh browser source in streaming app
- ✅ Check Supabase realtime is working

### Audio Not Working
- ✅ Grant microphone permissions in browser/app
- ✅ Check audio input device is selected
- ✅ Verify audio levels in OBS mixer
- ✅ Test with different microphone

---

## Best Practices

### Before Match Day

1. **Test Stream**
   - Do a test stream 1-2 days before
   - Test camera angles
   - Verify overlay positioning
   - Check audio quality

2. **Equipment Checklist**
   - ✅ Phone/camera fully charged
   - ✅ Power bank or charger
   - ✅ Tripod or phone mount
   - ✅ Backup internet (mobile hotspot)
   - ✅ Sunshade for phone screen

3. **Internet Connection**
   - Test upload speed (need 5+ Mbps)
   - Have backup internet ready
   - Position near WiFi router if possible

### During Match

1. **Stream Setup** (30 mins before)
   - Start stream early
   - Test audio and video
   - Position camera for best field view
   - Verify overlay is showing correctly

2. **Monitoring**
   - Check YouTube Studio for viewer count
   - Monitor stream health indicator
   - Watch for buffering issues
   - Keep device cool and ventilated

3. **Camera Positioning**
   - Mount at elevated position
   - Landscape orientation
   - Frame entire field if possible
   - Avoid shooting into sun
   - Keep camera stable

---

## YouTube Stream Settings

**Recommended Settings for YouTube:**
```
Stream Type: Live Stream
Latency: Low Latency (3-5 seconds)
Category: Sports
Visibility: Public / Unlisted / Private
Title: [Team A] vs [Team B] - [Match Type]
Description: Live cricket match with real-time scoring
```

**Advanced YouTube Settings:**
- Enable chat
- Enable DVR (viewers can rewind)
- Auto-start recording
- Enable automatic captions
- Set reminder for subscribers

---

## Cost

**Everything is FREE!**
- ✅ YouTube Live: Free
- ✅ Larix Broadcaster: Free
- ✅ OBS Studio: Free
- ✅ Score Overlay: Free

**Optional Paid:**
- Tripod/Phone Mount: $10-30
- Power Bank: $20-50
- Better Microphone: $50-200

---

## Support

If you encounter issues:

1. **Check this guide** first
2. **YouTube Help:** [support.google.com/youtube/topic/9257891](https://support.google.com/youtube/topic/9257891)
3. **OBS Support:** [obsproject.com/wiki/](https://obsproject.com/wiki/)
4. **Larix Guide:** [softvelum.com/larix/](https://softvelum.com/larix/)

---

## Quick Reference Card

**Print this and keep during match:**

```
┌─────────────────────────────────────────┐
│   CRICKET LIVE STREAMING QUICK REF      │
├─────────────────────────────────────────┤
│ YouTube Stream URL:                     │
│ rtmps://a.rtmp.youtube.com:443/live2    │
│                                         │
│ Stream Key: ____________________        │
│                                         │
│ Overlay URL:                            │
│ http://localhost:3000/stream-overlay    │
│ ?match=[match-id]                       │
│                                         │
│ Recommended Settings:                   │
│ - Resolution: 1920x1080 (1080p)        │
│ - FPS: 30                               │
│ - Bitrate: 4000-6000 Kbps              │
│ - Keyframe: 2 seconds                   │
│                                         │
│ Checklist:                              │
│ □ Camera charged                        │
│ □ Internet tested (5+ Mbps)            │
│ □ Stream key entered                    │
│ □ Overlay added                         │
│ □ Test stream done                      │
│ □ Camera positioned                     │
│ □ Audio tested                          │
└─────────────────────────────────────────┘
```

Happy Streaming! 🏏📹
