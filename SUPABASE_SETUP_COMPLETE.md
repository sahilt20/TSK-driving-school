# Complete Supabase Setup Guide

## Current Status

Your `.env.local` file exists but contains placeholder values. You need to replace them with actual Supabase credentials.

## Step-by-Step Setup

### Step 1: Create a Supabase Account & Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click "Start your project" or "Sign In"

2. **Sign Up/Sign In**
   - Use GitHub, Google, or Email
   - It's completely FREE for development

3. **Create New Project**
   - Click "New Project"
   - Choose your organization (or create one)
   - Fill in project details:
     - **Project Name**: `cricket-club` (or any name you like)
     - **Database Password**: Create a strong password (SAVE THIS!)
     - **Region**: Choose closest to you
     - **Pricing Plan**: Free (sufficient for development)
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

### Step 2: Get Your Supabase Credentials

Once your project is ready:

1. **Navigate to Project Settings**
   - Look for the "Settings" icon (gear) in the left sidebar
   - Click "Settings" → "API"

2. **Copy These Values**:

   **Project URL** (looks like):
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **anon/public key** (looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NTU5MCwiZXhwIjoxOTU1MTYxNTkwfQ.abcdefghijklmnopqrstuvwxyz123456789
   ```

   **service_role key** (optional for now):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM5NTg1NTkwLCJleHAiOjE5NTUxNjE1OTB9.abcdefghijklmnopqrstuvwxyz987654321
   ```

### Step 3: Update .env.local File

**IMPORTANT**: I'll create a script to help you update the file safely.

Open your `.env.local` file and replace:

```env
# BEFORE (placeholder values)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# AFTER (your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NTU5MCwiZXhwIjoxOTU1MTYxNTkwfQ.abcdefghijklmnopqrstuvwxyz123456789
```

### Step 4: Run Database Schema

1. **Open Supabase SQL Editor**
   - In your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy the Schema**
   - Open the file: `supabase/schema.sql` in your project
   - Copy ALL the content (it's the complete database schema)

3. **Execute the Schema**
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter
   - Wait for success message
   - You should see: "Success. No rows returned"

### Step 5: Verify Database Tables

1. **Check Table Editor**
   - Click "Table Editor" in left sidebar
   - You should see these tables:
     - teams
     - players
     - matches
     - innings
     - balls
     - batting_performances
     - bowling_performances
     - partnerships
     - live_match_state

2. **If tables don't appear**:
   - Refresh the page
   - Check SQL Editor for any errors
   - Make sure you ran the entire schema

### Step 6: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 7: Test the Connection

1. **Open the app**: http://localhost:3000/matches
2. **Click "New Team"**
3. **Fill in**:
   - Team Name: Mumbai Indians
   - Short Name: MI
4. **Click "Create Team"**

If successful, you'll see the team appear! ✅

---

## Quick Copy-Paste Guide

### What You Need to Copy from Supabase:

1. **Project URL** → Copy this to `NEXT_PUBLIC_SUPABASE_URL`
2. **anon public** → Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **service_role** (optional) → Copy to `SUPABASE_SERVICE_ROLE_KEY`

### Your .env.local Should Look Like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_VERY_LONG_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_VERY_LONG_SERVICE_KEY_HERE

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Troubleshooting

### Issue: "Failed to fetch" still appears

**Solution**:
1. Double-check the URL has `https://` at the start
2. Make sure there are no spaces before/after the keys
3. Restart the dev server after changing .env.local
4. Clear browser cache (Ctrl+Shift+R)

### Issue: "Invalid API key"

**Solution**:
1. Make sure you copied the **anon/public** key, not the service_role key
2. Check for any missing characters at the start/end
3. Re-copy from Supabase (don't copy from email, copy directly)

### Issue: Tables not created

**Solution**:
1. Check SQL Editor for error messages
2. Make sure you're in the right project
3. Try running schema in smaller chunks
4. Check "Table Editor" after a few seconds

### Issue: "Row Level Security" errors

**Solution**:
The schema includes RLS policies, but for development you can disable them:

1. Go to Authentication → Policies
2. Find each table
3. Click "Disable RLS" (only for development!)

---

## Video Tutorial (Alternative)

If you prefer video instructions:
1. Search YouTube: "Supabase setup Next.js"
2. Follow any recent tutorial (2024/2025)
3. The process is the same for all Next.js apps

---

## Need Help?

### Option 1: Use Pre-configured Demo
I can help you set up a demo Supabase instance if you're stuck.

### Option 2: Screenshot Sharing
Share a screenshot (with keys hidden) and I can help debug.

### Option 3: Alternative Database
If Supabase is too complex, we can switch to:
- Firebase
- MongoDB
- PostgreSQL (local)
- SQLite (for pure local dev)

---

## What Happens After Setup

Once configured, you'll be able to:
- ✅ Create teams
- ✅ Add players
- ✅ Create matches
- ✅ Start scoring
- ✅ View real-time overlays
- ✅ Stream mobile matches

All data will be stored in your Supabase database with real-time sync!

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Never share your anon key publicly (though it's safe for frontend)
- NEVER share your service_role key (has admin access)
- For production, use environment variables in Vercel/Netlify

---

**Estimated Setup Time**: 10-15 minutes
**Difficulty**: Beginner-friendly
**Cost**: FREE (Supabase free tier)

Good luck! 🚀
