# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Cricket Club Platform** is a complete solution for local cricket clubs to stream matches live to YouTube, manage ball-by-ball scoring, display real-time score overlays on streams, and analyze match/player performance.

The original field planner has been moved to `/field-planner` as a sub-feature of the larger platform.

### Vision
Enable any local cricket club to professionally broadcast their matches with minimal equipment (just a mobile phone) while providing comprehensive scoring, analytics, and field planning tools.

## Architecture

### Tech Stack (DECIDED)
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Real-time**: Supabase Realtime + WebSocket for <100ms score updates
- **Authentication**: Supabase Auth
- **Streaming**: Progressive Web App (PWA) with RTMPS to YouTube
- **Deployment**: Vercel (recommended)
- **UI Components**: Lucide React icons, Framer Motion animations

### Architecture Decisions Rationale
1. **Next.js over separate MERN**: Single codebase, SSR for SEO, API routes for backend
2. **Supabase over self-hosted**: Built-in real-time, auth, and PostgreSQL. Free tier sufficient
3. **PWA over React Native**: Faster MVP, works on all devices, no app store approval
4. **TypeScript**: Type safety for complex cricket scoring logic and real-time data

## Current Status

### ✅ COMPLETED (MVP Foundation)

1. **Project Setup & Infrastructure**
   - ✅ Next.js 14 with TypeScript and Tailwind CSS initialized
   - ✅ Folder structure created (app/, components/, lib/, types/, public/)
   - ✅ Dependencies installed (@supabase/supabase-js, @supabase/ssr, socket.io-client, etc.)
   - ✅ Build verified (compiles successfully)
   - ✅ .gitignore, .env.local.example, config files created

2. **Database Architecture**
   - ✅ Complete PostgreSQL schema designed in `supabase/schema.sql`
   - ✅ Tables: teams, players, matches, innings, balls, batting_performances, bowling_performances, partnerships, live_match_state
   - ✅ Row Level Security (RLS) policies defined
   - ✅ Triggers for updated_at timestamps
   - ✅ Real-time publication configured for critical tables
   - ✅ TypeScript types generated in `types/database.ts`

3. **Supabase Integration**
   - ✅ Client-side Supabase client created (`lib/supabase/client.ts`)
   - ✅ Server-side Supabase client with cookie handling (`lib/supabase/server.ts`)
   - ✅ Full database type definitions for type-safe queries

4. **Landing Page**
   - ✅ Professional landing page with feature showcase (`app/page.tsx`)
   - ✅ Sections: Hero, Features Grid, How It Works, CTA, Footer
   - ✅ Navigation to future pages (matches, overlay, stream-setup, analytics)
   - ✅ Responsive design with Tailwind CSS

5. **Field Planner Migration**
   - ✅ Original field planner moved to `public/field-planner/`
   - ✅ Accessible via `/field-planner` route
   - ✅ Iframe integration in Next.js page

6. **Documentation**
   - ✅ README.md with quick start guide
   - ✅ SETUP_GUIDE.md with comprehensive Supabase, YouTube, and OBS setup
   - ✅ .env.local.example with required environment variables

### 🚧 IN PROGRESS / NEXT STEPS

## Detailed Implementation Plan

### Phase 1: Core Match & Scoring System (Next Priority)

#### 1. Match Management Interface (`app/matches/page.tsx`)

**Purpose**: Allow users to create teams, players, and matches.

**Implementation Details**:
- **Route**: `/matches`
- **Components to Build**:
  - `components/teams/TeamList.tsx` - Display all teams
  - `components/teams/TeamForm.tsx` - Create/edit team (name, logo, players)
  - `components/players/PlayerForm.tsx` - Add player (name, role, batting/bowling style)
  - `components/matches/MatchList.tsx` - Show upcoming/live/completed matches
  - `components/matches/CreateMatchForm.tsx` - Create new match
  - `components/matches/TossForm.tsx` - Conduct toss and set batting order

**Database Operations**:
```typescript
// Example: Create team
await supabase.from('teams').insert({
  name: 'Mumbai Indians',
  short_name: 'MI',
  club_id: user.id
})

// Example: Create match
await supabase.from('matches').insert({
  team_a_id: teamA.id,
  team_b_id: teamB.id,
  match_type: 'T20',
  overs_per_innings: 20,
  venue: 'Wankhede Stadium',
  match_date: '2025-11-01',
  created_by: user.id
})
```

**UI/UX Requirements**:
- Card-based layout for teams and matches
- Quick actions: "Create Team", "New Match", "Start Match"
- Status badges: upcoming (blue), live (green pulse), completed (gray)
- Search and filter matches by date/status

**State Management**:
- Use Zustand for global match state
- Create `lib/stores/matchStore.ts`:
```typescript
interface MatchState {
  currentMatch: Match | null
  setCurrentMatch: (match: Match) => void
  clearMatch: () => void
}
```

#### 2. Live Scoring Interface (`app/matches/[id]/score/page.tsx`)

**Purpose**: Real-time ball-by-ball scoring interface for scorers.

**Route**: `/matches/[id]/score`

**Components**:
- `components/scoring/ScoreHeader.tsx` - Current score, overs, RR
- `components/scoring/BatsmanPanel.tsx` - Select/display current batsmen
- `components/scoring/BowlerPanel.tsx` - Select/display current bowler
- `components/scoring/BallInput.tsx` - Main scoring input (0,1,2,3,4,6,W)
- `components/scoring/ExtrasInput.tsx` - Wide, No-ball, Bye, Leg-bye
- `components/scoring/WicketModal.tsx` - Dismissal type, fielder selection
- `components/scoring/Scoreboard.tsx` - Full scorecard display
- `components/scoring/UndoButton.tsx` - Undo last ball

**Scoring Logic** (`lib/scoring/ballScoring.ts`):
```typescript
async function recordBall(ballData: BallInput) {
  // 1. Insert ball record
  const { data: ball } = await supabase.from('balls').insert({
    innings_id,
    over_number,
    ball_number,
    batsman_id,
    bowler_id,
    runs_scored,
    is_wicket,
    // ... other fields
  })

  // 2. Update innings totals
  await supabase.from('innings')
    .update({
      total_runs: innings.total_runs + runsToAdd,
      total_wickets: innings.total_wickets + (isWicket ? 1 : 0),
      total_balls: innings.total_balls + (isLegal ? 1 : 0)
    })
    .eq('id', innings_id)

  // 3. Update batting performance
  await updateBatsmanStats(batsman_id, runs, balls)

  // 4. Update bowling performance
  await updateBowlerStats(bowler_id, runs, wicket)

  // 5. Update partnership
  await updatePartnership(batsman1_id, batsman2_id, runs, balls)

  // 6. Update live_match_state for real-time sync
  await supabase.from('live_match_state')
    .upsert({
      match_id,
      current_score: newScore,
      current_wickets: newWickets,
      last_ball_event: `${runs} runs`,
      updated_at: new Date()
    })
}
```

**Real-time Subscription**:
```typescript
// In scoring interface, subscribe to live updates
useEffect(() => {
  const channel = supabase
    .channel(`match:${matchId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'balls',
      filter: `innings_id=eq.${inningsId}`
    }, (payload) => {
      // Update UI with new ball
      updateScoreDisplay(payload.new)
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [matchId])
```

**UI Layout**:
```
┌─────────────────────────────────────────┐
│  Team A: 145/3  (15.2 overs)  RR: 9.5  │
├─────────────────────────────────────────┤
│  Batsmen:                               │
│  ⭐ Player A: 45 (30) [4x4, 2x6]        │
│     Player B: 23 (18) [2x4]            │
│                                         │
│  Bowler: Player C  3-0-24-1             │
├─────────────────────────────────────────┤
│  This Over: [ 1 • 4 W 0 2 ]            │
├─────────────────────────────────────────┤
│  [0] [1] [2] [3] [4] [6] [W]           │
│  [WD] [NB] [BYE] [LB]                  │
│                                         │
│  [↶ Undo]  [⚙ Options]                 │
└─────────────────────────────────────────┘
```

**Key Features**:
- Keyboard shortcuts: 0-6 for runs, W for wicket
- Auto-advance to next over after 6 legal balls
- Auto-swap batsmen on odd runs
- Highlight striker with star (⭐)
- Ball-by-ball commentary generation
- Auto-save every ball (crash recovery)

#### 3. Score Overlay for OBS (`app/overlay/page.tsx`)

**Purpose**: Browser source for OBS showing live scores with <100ms updates.

**Route**: `/overlay?match=[matchId]&theme=[theme]`

**Implementation**:
```typescript
// app/overlay/page.tsx
'use client'

export default function ScoreOverlay() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')
  const theme = searchParams.get('theme') || 'default'

  const [liveState, setLiveState] = useState<LiveMatchState>()

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`overlay:${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_match_state',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setLiveState(payload.new)
      })
      .subscribe()

    // Initial fetch
    fetchCurrentState()

    return () => supabase.removeChannel(channel)
  }, [matchId])

  return (
    <div className="overlay-container">
      <ScoreTicker liveState={liveState} theme={theme} />
      <BatsmanStats batsmen={batsmen} />
      <BowlerStats bowler={bowler} />
      <LastBall event={liveState?.last_ball_event} />
    </div>
  )
}
```

**Overlay Components**:
- `components/overlay/ScoreTicker.tsx` - Main score bar
- `components/overlay/BatsmanStats.tsx` - Current batsmen
- `components/overlay/BowlerStats.tsx` - Current bowler
- `components/overlay/Partnership.tsx` - Partnership runs/balls
- `components/overlay/TargetInfo.tsx` - Required RR in chase

**Themes** (`components/overlay/themes/`):
- Default theme (green/white)
- Dark theme (black/gold)
- Custom theme support (team colors from database)

**Overlay Layout** (1920x1080):
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                  [VIDEO CONTENT]                 │
│                                                  │
│                                                  │
│                                                  │
├──────────────────────────────────────────────────┤
│  TEAM A: 145/3 (15.2)   Target: 180   Req: 10.5 │
│  Batsman A: 45(30)  Batsman B: 23(18)           │
│  Bowler: Player C 3-0-24-1    Last: 4 FOUR!     │
└──────────────────────────────────────────────────┘
```

**Animation Requirements**:
- Fade in/out transitions (Framer Motion)
- Pulse effect on wickets (red flash)
- Bounce effect on fours/sixes
- Smooth number updates (not jumpy)

**Performance Optimization**:
- Memoize components with React.memo
- Debounce rapid updates (max 30 fps)
- Use CSS transforms for animations (GPU accelerated)

### Phase 2: Streaming & Analytics

#### 4. Streaming Setup Guide (`app/stream-setup/page.tsx`)

**Purpose**: Step-by-step guide for setting up mobile streaming to YouTube.

**Content**:
- YouTube account setup and verification
- Stream key generation
- OBS configuration for desktop streaming
- PWA camera access for mobile streaming (Phase 3 feature)
- Troubleshooting common issues

**Components**:
- `components/streaming/SetupSteps.tsx` - Step wizard
- `components/streaming/StreamKeyInput.tsx` - Secure stream key input
- `components/streaming/QRCodeShare.tsx` - Share overlay URL via QR
- `components/streaming/TestStream.tsx` - Test stream health

#### 5. Match Analytics (`app/matches/[id]/analytics/page.tsx`)

**Purpose**: Post-match analysis and statistics.

**Features**:
- Match summary (winner, margin, MOTM)
- Batting scorecard with strike rates
- Bowling figures with economy rates
- Partnerships breakdown
- Wagon wheel (future: Phase 3)
- Manhattan graph (future: Phase 3)
- Fall of wickets chart
- Run rate progression

**Queries**:
```typescript
// Get batting performances
const { data: batting } = await supabase
  .from('batting_performances')
  .select('*, players(*)')
  .eq('innings_id', inningsId)
  .order('batting_position')

// Get bowling performances
const { data: bowling } = await supabase
  .from('bowling_performances')
  .select('*, players(*)')
  .eq('innings_id', inningsId)
  .order('wickets_taken', { ascending: false })

// Calculate economy rate, strike rate, etc.
```

### Phase 3: Advanced Features (Future)

#### 6. Authentication System

**Routes**:
- `/auth/login` - Email/password login
- `/auth/signup` - User registration
- `/auth/forgot-password` - Password reset

**Implementation**:
- Use Supabase Auth
- Email verification required
- Social login (Google, GitHub) optional

**Protected Routes**:
- Only authenticated users can create matches
- Public can view live scores and overlays
- Admins can manage teams

#### 7. Mobile Streaming PWA

**Implementation**:
- `next.config.js` - Enable PWA support
- Service worker for offline capability
- Camera access API
- RTMPS client (using WebRTC or native libs)

**Features**:
- Select camera (front/back)
- Zoom and focus controls
- Connection strength indicator
- Auto-reconnect on network issues

#### 8. Advanced Analytics

**Features**:
- Wagon wheel (shot placement visualization)
- Manhattan graph (run rate by over)
- Pitch map (bowling line and length)
- Player comparison tools
- Head-to-head statistics
- Tournament leaderboards

**Libraries**:
- Chart.js or Recharts for graphs
- D3.js for advanced visualizations

#### 9. Tournament Management

**Tables** (add to schema):
- tournaments
- tournament_teams
- tournament_matches
- tournament_standings

**Features**:
- Round-robin and knockout formats
- Points table auto-update
- Fixture generation
- Prize distribution tracking

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Database Schema Reference

**Critical Tables**:
- `teams`: Team info (name, logo, club_id)
- `players`: Player info (name, role, batting/bowling style)
- `matches`: Match details (teams, venue, format, status)
- `innings`: Innings totals (runs, wickets, overs, extras)
- `balls`: Ball-by-ball records (batsman, bowler, runs, wicket)
- `batting_performances`: Batsman stats per innings
- `bowling_performances`: Bowler stats per innings
- `partnerships`: Partnership records
- `live_match_state`: Current match state for real-time

**Real-time Enabled**:
- balls (INSERT events)
- innings (UPDATE events)
- live_match_state (UPDATE events)

## Key Files & Their Purpose

**Configuration**:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `next.config.js` - Next.js settings

**Database**:
- `supabase/schema.sql` - Complete database schema
- `types/database.ts` - TypeScript types for database
- `lib/supabase/client.ts` - Client-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client

**Pages** (Next.js App Router):
- `app/page.tsx` - Landing page
- `app/layout.tsx` - Root layout
- `app/field-planner/page.tsx` - Field planner iframe
- `app/matches/page.tsx` - Match list (TO BUILD)
- `app/matches/[id]/score/page.tsx` - Scoring interface (TO BUILD)
- `app/overlay/page.tsx` - OBS overlay (TO BUILD)

**Components** (TO BUILD):
- `components/scoring/*` - Scoring interface components
- `components/overlay/*` - Overlay components
- `components/teams/*` - Team management
- `components/players/*` - Player management
- `components/matches/*` - Match management

**Libraries** (TO BUILD):
- `lib/scoring/ballScoring.ts` - Ball scoring logic
- `lib/scoring/calculations.ts` - Strike rate, economy rate, etc.
- `lib/stores/matchStore.ts` - Global match state (Zustand)
- `lib/utils/cricket.ts` - Cricket-specific utilities

## Common Tasks for Future Development

### Adding a New Feature
1. Create component in `components/[feature]/`
2. Add route in `app/[feature]/page.tsx`
3. Define types in `types/` if needed
4. Add database queries in component
5. Subscribe to real-time if applicable
6. Update navigation in `app/page.tsx`

### Adding Database Tables
1. Update `supabase/schema.sql`
2. Run SQL in Supabase SQL Editor
3. Update `types/database.ts` with new table types
4. Enable RLS policies
5. Enable real-time if needed

### Real-time Subscription Pattern
```typescript
useEffect(() => {
  const channel = supabase
    .channel('channel-name')
    .on('postgres_changes', {
      event: 'INSERT',  // or UPDATE, DELETE, *
      schema: 'public',
      table: 'table_name',
      filter: 'column=eq.value'  // optional
    }, (payload) => {
      // Handle update
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [dependencies])
```

### Testing Strategy
1. Manual testing in browser for UI
2. Database integrity tests with sample data
3. Real-time latency tests (should be <100ms)
4. Load testing with multiple scorers
5. Stream quality testing with OBS

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)
- [OBS Studio](https://obsproject.com/)
- [YouTube RTMPS Streaming](https://developers.google.com/youtube/v3/live/)
- [Cricket Scoring Rules](https://www.icc-cricket.com/about/cricket/rules-and-regulations)

## Notes for Future AI Sessions

- Original field planner is in `public/field-planner/` - do not modify
- Database schema is comprehensive - review before adding new tables
- Real-time is critical - test latency for all live features
- MVP focus: Match creation → Scoring → Overlay → Stream setup
- PWA streaming is Phase 3 - start with OBS guide
- Keep overlay lightweight (<500KB) for fast loading in OBS
- Use Zustand for state, not Redux (simpler for this use case)
- All scoring logic must handle edge cases (retired hurt, mankad, etc.)
- Follow ICC cricket rules for dismissal types and scoring