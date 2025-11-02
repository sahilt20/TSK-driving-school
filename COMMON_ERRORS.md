# 🔧 Common Errors & Quick Fixes

## 1. ❌ "new row violates row-level security policy"

### Error Message:
```
new row violates row-level security policy for table "teams"
```

### Quick Fix (30 seconds):

**In Supabase SQL Editor, run:**
```sql
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

**Or use the helper file:**
- Open: `supabase/disable-rls-dev.sql`
- Copy entire content
- Paste in Supabase SQL Editor
- Click Run

**Full guide**: See `FIX_RLS_ERROR.md`

---

## 2. ❌ "Unable to connect to database"

### Error Message:
```
Unable to connect to database. Please ensure Supabase is configured in .env.local
```

### Quick Fix:

**Option 1: Interactive Setup**
```bash
node setup-supabase.js
```

**Option 2: Manual Fix**
1. Create Supabase account at https://supabase.com
2. Create new project
3. Copy URL and API key from Settings → API
4. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
5. Restart dev server

**Full guide**: See `QUICK_SUPABASE_SETUP.md`

---

## 3. ❌ "Failed to fetch"

### Error Message:
```
TypeError: Failed to fetch
```

### Quick Fix:

**This usually means Supabase isn't configured**

1. Check `.env.local` has real values (not placeholders)
2. Restart dev server: `npm run dev`
3. Clear browser cache: Ctrl+Shift+R
4. Verify Supabase URL starts with `https://`

**If still failing:**
- Go to Supabase dashboard
- Check project is active (not paused)
- Verify API keys are correct

---

## 4. ❌ Input text not visible

### Problem:
Text you type in forms is invisible or hard to see

### Fix:
**Already fixed!** Update to latest code:
```bash
git pull origin main
```

All inputs now have:
- Dark text color (`text-gray-900`)
- Proper contrast
- Visible placeholders

**Details**: See `UI_FIXES_SUMMARY.md`

---

## 5. ❌ "relation does not exist"

### Error Message:
```
relation "public.teams" does not exist
```

### Quick Fix:

**You need to run the database schema**

1. Go to Supabase → SQL Editor
2. Click "New query"
3. Open `supabase/schema-dev.sql` (for development)
4. Copy entire content
5. Paste in SQL Editor
6. Click "Run"
7. Wait for "Success" message

**Verify**:
- Click "Table Editor"
- You should see: teams, players, matches, etc.

---

## 6. ❌ Tables don't appear in Supabase

### Problem:
Ran schema but don't see tables in Table Editor

### Quick Fix:

1. **Refresh the page** - Sometimes Supabase UI lags
2. **Check for errors** - Look in SQL Editor output
3. **Run again** - Schema is idempotent (safe to rerun)
4. **Use dev schema** - Try `schema-dev.sql` instead

**Common cause**: You only copied part of the schema file. Copy ALL of it!

---

## 7. ❌ "Invalid API key"

### Error Message:
```
Invalid API key provided
```

### Quick Fix:

1. **Check you copied the RIGHT key**
   - Use **anon/public** key (NOT service_role)
   - Key should start with `eyJ`
2. **Re-copy from Supabase**
   - Settings → API
   - Copy entire key (no spaces)
3. **Check for typos**
   - No spaces before/after
   - No line breaks in the middle
4. **Restart dev server** after changing

---

## 8. ❌ Build errors

### Error Message:
```
Type error: Property 'xxx' does not exist
```

### Quick Fix:

```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**If still failing**:
- Check TypeScript version
- Verify all imports are correct
- Run `npm run lint` to see specific errors

---

## 9. ❌ "Cannot find module"

### Error Message:
```
Module not found: Can't resolve '@/components/...'
```

### Quick Fix:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Check `tsconfig.json` has**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 10. ❌ Dev server won't start

### Error Message:
```
Error: listen EADDRINUSE: address already in use
```

### Quick Fix:

**Port 3000 is already in use**

```bash
# Option 1: Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

---

## 🆘 Still Stuck?

### Troubleshooting Checklist

- [ ] Supabase project created and active
- [ ] `.env.local` has real values (not placeholders)
- [ ] Database schema run in Supabase
- [ ] Tables visible in Table Editor
- [ ] RLS disabled (for development)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] No other process on port 3000

### Get Help

1. **Check specific guides**:
   - Supabase setup: `QUICK_SUPABASE_SETUP.md`
   - RLS errors: `FIX_RLS_ERROR.md`
   - UI issues: `UI_FIXES_SUMMARY.md`

2. **Run diagnostics**:
```bash
# Check environment
node -v  # Should be 18+
npm -v   # Should be 9+

# Check Supabase config
cat .env.local | grep SUPABASE

# Test build
npm run build
```

3. **Share details**:
   - What command did you run?
   - What's the exact error message?
   - Screenshot of error (hide API keys!)
   - Console errors (F12 → Console)

---

## 💡 Pro Tips

### Prevent Issues

1. **Always restart** dev server after changing `.env.local`
2. **Use dev schema** (`schema-dev.sql`) for local development
3. **Disable RLS** during development, enable for production
4. **Clear browser cache** when seeing old data
5. **Check Supabase status** at https://status.supabase.com

### Quick Commands

```bash
# Fresh start
rm -rf .next node_modules
npm install
npm run dev

# Check Supabase connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# View logs
npm run dev 2>&1 | tee dev.log
```

---

## 📚 Reference Guides

| Guide | When to Use |
|-------|-------------|
| `QUICK_SUPABASE_SETUP.md` | First time setup |
| `FIX_RLS_ERROR.md` | Security policy errors |
| `UI_FIXES_SUMMARY.md` | Input/form issues |
| `SETUP_CHEATSHEET.md` | Quick reference |
| `COMMON_ERRORS.md` | This file! |

---

**Remember**: Most errors are either:
1. Missing Supabase config → Run `node setup-supabase.js`
2. RLS blocking access → Run `supabase/disable-rls-dev.sql`
3. Need to restart → Stop server, run `npm run dev` again
