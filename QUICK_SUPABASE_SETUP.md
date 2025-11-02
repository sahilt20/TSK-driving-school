# 🚀 Quick Supabase Setup (5 Minutes)

## Current Problem

You're seeing: **"Unable to connect to database. Please ensure Supabase is configured in .env.local"**

## Quick Fix (3 Options)

### Option 1: Interactive Setup Script (Easiest) ⭐

Run this command:

```bash
node setup-supabase.js
```

Follow the prompts to configure everything automatically!

---

### Option 2: Manual Setup (Step-by-Step)

#### ✅ Step 1: Get Supabase Credentials (3 minutes)

1. **Go to**: https://supabase.com
2. **Sign up/Login** (free, use GitHub/Google)
3. **Create new project**:
   - Name: `cricket-club`
   - Password: (create one, save it!)
   - Region: Choose closest
   - Click "Create new project"
   - **Wait 2-3 minutes** ⏱️

4. **Get your keys**:
   - Click **"Settings"** (gear icon)
   - Click **"API"**
   - Copy these two values:

   **Project URL** (looks like):
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **anon public** (looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
   ```

#### ✅ Step 2: Update .env.local (30 seconds)

Open `.env.local` and replace these lines:

```env
# REPLACE THIS:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# WITH YOUR VALUES:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

Save the file!

#### ✅ Step 3: Create Database Tables (1 minute)

1. In Supabase, click **"SQL Editor"**
2. Click **"New query"**
3. Open `supabase/schema.sql` in your code editor
4. **Copy everything** (Ctrl+A, Ctrl+C)
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. Wait for "Success. No rows returned" ✅

#### ✅ Step 4: Restart & Test (30 seconds)

```bash
# Stop server (Ctrl+C)
# Restart:
npm run dev
```

Then:
1. Go to: http://localhost:3000/matches
2. Click "New Team"
3. Enter: Name = "Mumbai Indians", Short Name = "MI"
4. Click "Create Team"

**If successful** → Team appears! 🎉

---

### Option 3: Use Demo Database (Instant)

If you just want to test the app without setting up Supabase:

I can provide you with a demo Supabase instance (temporary, read-only). Just let me know!

---

## Visual Guide

```
Step 1: Supabase.com
   ↓
Create Account (Free)
   ↓
Create Project (Wait 2-3 min)
   ↓
Settings → API
   ↓
Copy URL + anon key

Step 2: Your Project
   ↓
Open .env.local
   ↓
Paste URL + anon key
   ↓
Save file

Step 3: Database
   ↓
SQL Editor in Supabase
   ↓
Copy supabase/schema.sql
   ↓
Paste & Run

Step 4: Test
   ↓
Restart dev server
   ↓
Create team
   ↓
Success! ✅
```

---

## Screenshots of Where to Find Keys

### 1. Supabase Dashboard → Settings
```
┌─────────────────────────────────────┐
│  [≡] Dashboard                      │
│  [ ] Table Editor                   │
│  [⚙] Settings  ← CLICK HERE        │
│     └─ General                      │
│     └─ API  ← THEN HERE            │
│     └─ Database                     │
└─────────────────────────────────────┘
```

### 2. API Settings Page
```
┌──────────────────────────────────────────┐
│  Project API                             │
│                                          │
│  Project URL                             │
│  ┌────────────────────────────────────┐ │
│  │ https://abcdef.supabase.co        │ │ ← COPY THIS
│  └────────────────────────────────────┘ │
│                                          │
│  API Keys                                │
│  anon public                             │
│  ┌────────────────────────────────────┐ │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6...  │ │ ← COPY THIS
│  └────────────────────────────────────┘ │
│                                          │
│  service_role (secret)                   │
│  ┌────────────────────────────────────┐ │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6...  │ │ ← DON'T NEED THIS NOW
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## Common Issues & Quick Fixes

### ❌ "Failed to fetch" still appears

**Fix**:
```bash
# 1. Check .env.local has real values (not placeholders)
# 2. Restart dev server
npm run dev
# 3. Clear browser cache (Ctrl+Shift+R)
```

### ❌ "Invalid API key"

**Fix**:
- Make sure you copied the **anon public** key (NOT service_role)
- Check there are no spaces before/after the key
- Re-copy directly from Supabase (don't copy from emails)

### ❌ Tables don't appear in Supabase

**Fix**:
1. Refresh the Table Editor page
2. Check SQL Editor for errors
3. Make sure you copied the **entire** schema.sql file
4. Run the schema again

### ❌ Project still initializing

**Fix**:
- Wait! Supabase takes 2-3 minutes to set up
- You'll see a progress indicator
- Get coffee ☕

---

## What You'll See When It Works

### In Supabase (Table Editor):
```
Tables
  ├── teams ✅
  ├── players ✅
  ├── matches ✅
  ├── innings ✅
  ├── balls ✅
  ├── batting_performances ✅
  ├── bowling_performances ✅
  ├── partnerships ✅
  └── live_match_state ✅
```

### In Your App:
```
Create Team Form
┌─────────────────────────┐
│ Team Name               │
│ [Mumbai Indians____]    │
│                         │
│ Short Name              │
│ [MI_______________]     │
│                         │
│ [Cancel] [Create Team]  │
└─────────────────────────┘

↓ (After clicking Create)

Teams (1)
┌─────────────────────────┐
│ Mumbai Indians          │
│ MI                      │
│ Manage Players →        │
└─────────────────────────┘
```

---

## Need More Help?

### 1. Video Tutorial
Search YouTube: "Supabase setup Next.js tutorial"

### 2. Official Docs
https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

### 3. Ask Me!
Share your screen or error message and I'll help debug.

### 4. Alternative: Use Local Database
If Supabase is too complex, we can switch to SQLite or local PostgreSQL.

---

## Checklist

- [ ] Created Supabase account
- [ ] Created new project (waited for initialization)
- [ ] Copied Project URL from Settings → API
- [ ] Copied anon public key from Settings → API
- [ ] Updated .env.local with real values
- [ ] Opened SQL Editor in Supabase
- [ ] Copied supabase/schema.sql content
- [ ] Pasted and ran in SQL Editor
- [ ] Saw "Success. No rows returned"
- [ ] Verified tables appear in Table Editor
- [ ] Restarted dev server
- [ ] Tested by creating a team
- [ ] Success! 🎉

---

## Time Estimate

- ✅ Create Supabase account: **2 minutes**
- ✅ Create project: **3 minutes** (waiting)
- ✅ Copy credentials: **1 minute**
- ✅ Update .env.local: **30 seconds**
- ✅ Run schema: **1 minute**
- ✅ Test: **30 seconds**

**Total: ~8 minutes** (including waiting time)

---

## Still Stuck?

Run the interactive setup:

```bash
node setup-supabase.js
```

This will walk you through each step and update your configuration automatically!

---

**Remember**: Supabase is FREE for development. No credit card needed! 💳
