# Cricket Club Platform - Complete Setup Guide

This guide will walk you through setting up the entire cricket club streaming and scoring platform from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Supabase Setup](#supabase-setup)
3. [Local Development Setup](#local-development-setup)
4. [YouTube Streaming Setup](#youtube-streaming-setup)
5. [OBS Configuration](#obs-configuration)
6. [Testing the Complete Flow](#testing-the-complete-flow)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### For Development
- Node.js 18.x or higher
- npm 9.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

### For Streaming
- Mobile device with camera (iOS/Android) OR
- Laptop with webcam
- Stable internet connection (minimum 5 Mbps upload)
- OBS Studio (free) OR StreamYard

## Supabase Setup

### 1. Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email

### 2. Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name**: cricket-club-platform (or your choice)
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for starting
3. Click "Create new project"
4. Wait 2-3 minutes for project initialization

### 3. Get API Credentials

1. In your project dashboard, click "Settings" (gear icon in sidebar)
2. Navigate to "API" section
3. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (⚠️ Keep this secret!)

### 4. Run Database Migrations

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Open `supabase/schema.sql` from your project
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. Verify success: You should see "Success. No rows returned"

### 5. Verify Database Tables

1. Click "Table Editor" in sidebar
2. You should see these tables:
   - teams
   - players
   - matches
   - innings
   - batting_performances
   - bowling_performances
   - balls
   - partnerships
   - live_match_state

### 6. Enable Realtime

1. Go to "Database" > "Replication"
2. Find these tables and enable replication:
   - `balls`
   - `innings`
   - `live_match_state`
3. These tables will now support real-time subscriptions

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd cricket-field-planner

# Install dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local with your favorite editor
# On Windows:
notepad .env.local

# On Mac/Linux:
nano .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Verify Setup

You should see:
- Landing page with cricket club features
- Navigation working
- No console errors in browser DevTools

## YouTube Streaming Setup

### 1. Enable YouTube Live Streaming

1. Go to https://studio.youtube.com
2. Click "Create" > "Go Live"
3. If first time:
   - You'll need to verify your account
   - Enable live streaming (may take 24 hours)

### 2. Get Stream Key

1. In YouTube Studio, click "Create" > "Go Live"
2. Choose "Stream" (for streaming software)
3. Click "Create stream"
4. Set stream details:
   - **Title**: Your match name
   - **Visibility**: Public, Unlisted, or Private
   - **Category**: Sports
5. Copy the **Stream Key** (⚠️ Keep this secret!)
6. Copy the **Stream URL** (usually `rtmps://a.rtmps.youtube.com:443/live2`)

### 3. Configure Stream Settings

Recommended settings based on your internet speed:

#### For 5-10 Mbps Upload
- Resolution: 1280x720 (720p)
- Frame Rate: 30 fps
- Bitrate: 2500-4000 kbps

#### For 10-20 Mbps Upload
- Resolution: 1920x1080 (1080p)
- Frame Rate: 30 fps
- Bitrate: 4000-6000 kbps

#### For 20+ Mbps Upload
- Resolution: 1920x1080 (1080p)
- Frame Rate: 60 fps
- Bitrate: 6000-9000 kbps

## OBS Configuration

### 1. Download and Install OBS

1. Go to https://obsproject.com
2. Download for your OS (Windows/Mac/Linux)
3. Install OBS Studio
4. Run OBS

### 2. Configure Stream Settings

1. In OBS, click "Settings"
2. Go to "Stream" section:
   - **Service**: YouTube - RTMPS
   - **Server**: Primary YouTube ingest server
   - **Stream Key**: Paste your YouTube stream key
3. Click "Apply"

### 3. Configure Output Settings

1. Still in Settings, go to "Output"
2. Set:
   - **Output Mode**: Simple
   - **Video Bitrate**: 4500 kbps (adjust based on your internet)
   - **Encoder**: x264 (or hardware encoder if available)
   - **Audio Bitrate**: 160 kbps
3. Click "Apply"

### 4. Configure Video Settings

1. Go to "Video" section:
   - **Base Resolution**: 1920x1080
   - **Output Resolution**: 1920x1080 (or 1280x720 for lower bandwidth)
   - **FPS**: 30
2. Click "Apply" > "OK"

### 5. Add Video Source

1. In "Sources" panel, click "+"
2. Choose:
   - "Video Capture Device" (for webcam/camera)
   - "Display Capture" (for screen)
   - "Window Capture" (for specific window)
3. Configure your camera/source
4. Position and resize as needed

### 6. Add Score Overlay

This is the key feature for showing live scores!

1. Start a match in your platform (we'll add this feature next)
2. Get the overlay URL: `http://localhost:3000/overlay?match=MATCH_ID`
3. In OBS Sources, click "+"
4. Select "Browser"
5. Name it "Score Overlay"
6. Configure:
   - **URL**: `http://localhost:3000/overlay?match=MATCH_ID`
   - **Width**: 1920
   - **Height**: 1080
   - **FPS**: 30
   - **Custom CSS**: (leave empty for now)
7. Click "OK"
8. Position the overlay at the bottom of your scene

### 7. Test Your Setup

1. Click "Start Streaming" in OBS
2. Go to YouTube Studio > Stream
3. You should see your stream going live
4. Check if video and audio are working

## Testing the Complete Flow

### 1. Create Sample Data (Manual for now)

Until we build the UI, you can add sample data directly in Supabase:

1. Go to Supabase > Table Editor
2. Create a team:
   - Table: teams
   - Insert row: name = "Team A", short_name = "TMA"
3. Create another team:
   - name = "Team B", short_name = "TMB"
4. Create a match:
   - Table: matches
   - team_a_id = Team A's ID
   - team_b_id = Team B's ID
   - match_type = "T20"
   - overs_per_innings = 20
   - match_status = "live"

### 2. Test Score Updates

Once we build the scoring interface:
1. Open the scoring page
2. Enter balls, runs, wickets
3. Watch the overlay update in real-time
4. Verify the score appears correctly on stream

### 3. Verify Real-time Sync

1. Open overlay in one browser tab
2. Open scoring interface in another tab
3. Make score changes
4. Overlay should update within 100ms

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Sign up/login with GitHub
4. Click "Import Project"
5. Select your repository
6. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: .next
7. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_APP_URL (your vercel domain)
8. Click "Deploy"
9. Wait 2-3 minutes for deployment

### Update OBS Overlay URL

After deployment, update OBS overlay URL to:
```
https://your-app.vercel.app/overlay?match=MATCH_ID
```

## Troubleshooting

### Supabase Connection Issues

**Error**: "Invalid API key"
- Double-check your .env.local file
- Ensure no extra spaces in keys
- Restart dev server after changing .env.local

**Error**: "Failed to fetch"
- Check Supabase project is active
- Verify URL is correct
- Check internet connection

### Streaming Issues

**Stream won't start**
- Verify YouTube account is verified
- Wait 24 hours if you just enabled streaming
- Check stream key is correct
- Ensure no other app is streaming to YouTube

**Poor stream quality**
- Lower bitrate in OBS settings
- Reduce resolution to 720p
- Close other bandwidth-heavy apps
- Use wired ethernet instead of WiFi

**Stream buffering/lagging**
- Test upload speed (needs 5+ Mbps)
- Lower FPS to 30
- Reduce bitrate by 500-1000 kbps
- Check CPU usage in OBS stats

### Overlay Not Showing

**Overlay is blank**
- Verify overlay URL is correct
- Check match ID exists in database
- Open browser console for errors
- Try refreshing the browser source

**Overlay not updating**
- Check Supabase Realtime is enabled
- Verify tables have replication enabled
- Check browser console for WebSocket errors
- Restart OBS browser source

### Development Server Issues

**Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Build failures**
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. Build match management UI
2. Build live scoring interface
3. Create score overlay component
4. Test complete streaming workflow
5. Add authentication for scorers
6. Deploy to production

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review error messages in browser console
3. Check Supabase logs
4. Open an issue on GitHub

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OBS Studio Guide](https://obsproject.com/wiki/)
- [YouTube Streaming Guide](https://support.google.com/youtube/topic/9257891)
