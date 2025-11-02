# 🔧 Fix RLS Error - "new row violates row-level security policy"

## ❌ The Error You're Seeing

```
new row violates row-level security policy for table "teams"
```

## 🎯 What's Happening?

Supabase has **Row-Level Security (RLS)** enabled on your database tables. The current policies require authentication, but you're trying to use the app without logging in.

## ✅ Quick Fix (Choose One Method)

### Method 1: Disable RLS (Easiest - 30 seconds) ⭐

**Perfect for development/testing**

1. Go to Supabase → **SQL Editor**
2. Click **"New query"**
3. Copy and paste this:

```sql
-- Disable RLS on all tables
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE innings DISABLE ROW LEVEL SECURITY;
ALTER TABLE batting_performances DISABLE ROW LEVEL SECURITY;
ALTER TABLE bowling_performances DISABLE ROW LEVEL SECURITY;
ALTER TABLE balls DISABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_state DISABLE ROW LEVEL SECURITY;
```

4. Click **"Run"**
5. **Done!** Try creating a team again ✅

---

### Method 2: Update RLS Policies (Better for shared dev)

**Allows public access but keeps RLS enabled**

1. Go to Supabase → **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire content of: `supabase/fix-rls-policies.sql`
4. Click **"Run"**
5. **Done!** ✅

---

### Method 3: Use Development Schema (Fresh Start)

**If you haven't added data yet**

1. Go to Supabase → **SQL Editor**
2. Click **"New query"**
3. **Delete all tables first** (if they exist):

```sql
DROP TABLE IF EXISTS balls CASCADE;
DROP TABLE IF EXISTS batting_performances CASCADE;
DROP TABLE IF EXISTS bowling_performances CASCADE;
DROP TABLE IF EXISTS partnerships CASCADE;
DROP TABLE IF EXISTS innings CASCADE;
DROP TABLE IF EXISTS live_match_state CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
```

4. Click **"Run"**
5. Create new query
6. Copy and paste entire content of: `supabase/schema-dev.sql`
7. Click **"Run"**
8. **Done!** ✅ (RLS is disabled by default)

---

### Method 4: Login to the App

**If you want to use authentication**

1. Go to http://localhost:3000/auth/signup
2. Create an account
3. Verify email (check spam folder)
4. Login
5. Now you can create teams ✅

---

## 📂 Files Created for You

I've created these helper files:

1. **`supabase/disable-rls-dev.sql`** - Quick disable script (Method 1)
2. **`supabase/fix-rls-policies.sql`** - Update policies (Method 2)
3. **`supabase/schema-dev.sql`** - Development schema with RLS off (Method 3)

---

## 🚀 Recommended Approach

For **local development/testing**, use **Method 1** (disable RLS):

```bash
# It's the fastest way to get started
# Takes 30 seconds
# No authentication needed
```

For **shared development** (multiple people), use **Method 2**:

```bash
# Keeps security structure
# Allows public access
# Easy to tighten later
```

---

## 🔍 How to Verify It's Fixed

After running any fix:

1. Go to http://localhost:3000/matches
2. Click **"New Team"**
3. Enter:
   - Team Name: `Mumbai Indians`
   - Short Name: `MI`
4. Click **"Create Team"**

**If successful** → Team appears in the list! 🎉

**If still error** → Try Method 1 (disable RLS completely)

---

## 🎓 Understanding RLS

**What is Row-Level Security?**
- Security feature that controls who can access which rows
- Like saying "users can only see their own data"
- Great for production, annoying for development

**Why disable for development?**
- ✅ Faster testing
- ✅ No authentication needed
- ✅ Easy to experiment
- ✅ Can always enable later

**When to enable RLS?**
- 🚀 Production deployment
- 👥 Multi-tenant applications
- 🔒 When security matters

---

## 🔐 Re-enabling RLS Later

When you're ready for production:

```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Then add proper policies
CREATE POLICY "Users own their data" ON teams
  FOR ALL USING (auth.uid() = club_id);
```

---

## 🆘 Still Getting Errors?

### Error: "relation does not exist"
**Fix**: Run the schema first (`schema-dev.sql`)

### Error: "permission denied"
**Fix**: Make sure you're using the correct Supabase project

### Error: "syntax error"
**Fix**: Make sure you copied the **entire** SQL file

### Other errors?
1. Check Supabase SQL Editor for specific error message
2. Try refreshing Table Editor
3. Verify you're in the right project
4. Share the error with me for help!

---

## 📊 Quick Comparison

| Method | Time | Security | Best For |
|--------|------|----------|----------|
| Disable RLS | 30 sec | None | Solo dev, testing |
| Update Policies | 1 min | Public access | Shared dev |
| Dev Schema | 2 min | None | Fresh start |
| Use Auth | 5 min | Full | Production-like |

---

## 💡 Pro Tips

1. **For solo development**: Just disable RLS (Method 1)
2. **For team development**: Update policies (Method 2)
3. **For production**: Use original `schema.sql` with auth
4. **For testing**: Disable RLS, re-enable before deploying

---

## ✅ Final Checklist

- [ ] Ran one of the fix methods in Supabase SQL Editor
- [ ] Saw "Success" message
- [ ] Refreshed app in browser
- [ ] Tried creating a team
- [ ] Team appeared in list
- [ ] Celebrated! 🎉

---

**Need help?** Run Method 1 (disable RLS) - it's the most reliable fix for development!
