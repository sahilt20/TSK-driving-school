# 🏏 Supabase Setup Cheat Sheet

## ❌ Current Error
```
Unable to connect to database. Please ensure Supabase is configured in .env.local
```

## ✅ The Fix (3 Steps)

### 1️⃣ Get Supabase (2 min)

```
https://supabase.com → Sign Up → New Project
```

Wait 2-3 minutes ⏱️

### 2️⃣ Copy Keys (1 min)

In Supabase:
```
Settings → API → Copy these:
```

- **Project URL**: `https://xxxxx.supabase.co`
- **anon public**: `eyJhbGci...` (very long key)

### 3️⃣ Update .env.local (30 sec)

Replace in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4️⃣ Run Schema (1 min)

In Supabase:
```
SQL Editor → New Query → Paste supabase/schema.sql → Run
```

### 5️⃣ Test (30 sec)

```bash
npm run dev
# Go to http://localhost:3000/matches
# Click "New Team" → Create team
# Success! ✅
```

---

## 🤖 Or Use Interactive Setup

```bash
node setup-supabase.js
```

This will guide you through everything!

---

## 📚 Full Guides

- **Quick Guide**: `QUICK_SUPABASE_SETUP.md`
- **Complete Guide**: `SUPABASE_SETUP_COMPLETE.md`
- **UI Fixes**: `UI_FIXES_SUMMARY.md`

---

## 🆘 Need Help?

1. Supabase not free? → YES, it's FREE forever (no credit card)
2. Can't find API settings? → Settings (gear icon) → API
3. Schema errors? → Copy ENTIRE supabase/schema.sql file
4. Still not working? → Run `node setup-supabase.js`

---

**Total Time**: 5-8 minutes ⏱️
**Cost**: FREE 💰
**Difficulty**: Easy 👍
