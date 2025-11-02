# ⚡ Quick Deployment Checklist for Netlify

Use this checklist to deploy in **under 10 minutes**.

---

## ✅ Pre-Deployment (5 minutes)

### 1. Supabase Setup
- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New project created
- [ ] Run database schema from `supabase/schema.sql`
- [ ] Copy **Project URL** and **Anon Key** from Settings → API

### 2. GitHub Repository
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or Netlify has access

### 3. Verify Local Build Works
```bash
npm install
npm run build
```
- [ ] Build completes without errors

---

## 🚀 Deployment (3 minutes)

### 1. Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository

### 2. Configure Build Settings
Auto-detected settings (verify these):
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions`

### 3. Add Environment Variables
Click **"Add environment variables"** before deploying:

| Variable Name | Value | Where to Get It |
|---------------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase → Settings → API |

### 4. Deploy!
- [ ] Click **"Deploy site"**
- [ ] Wait 3-5 minutes for build
- [ ] Get your Netlify URL (e.g., `random-name-123.netlify.app`)

---

## ⚙️ Post-Deployment (2 minutes)

### 1. Configure Supabase URLs
In Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `https://your-netlify-url.netlify.app`
3. Add **Redirect URL:** `https://your-netlify-url.netlify.app/**`

### 2. Test Critical Features
- [ ] Visit your Netlify URL
- [ ] Create a test match
- [ ] Start scoring (add a few balls)
- [ ] Open overlay: `https://your-url.netlify.app/overlay?match=1`
- [ ] Verify scores update in real-time

---

## 🎯 Done!

Your site is live at: `https://your-netlify-url.netlify.app`

### Next Steps:
1. **Rename site:** Netlify Dashboard → Site settings → Change site name
2. **Custom domain:** Site settings → Domain management → Add custom domain
3. **Share overlay URL** for OBS: `https://your-url.netlify.app/overlay?match=[id]`

---

## 🚨 If Something Goes Wrong

### Build Fails?
1. Check build logs in Netlify
2. Verify `package.json` has all dependencies
3. Try locally: `rm -rf node_modules && npm install && npm run build`

### Environment Variables Not Working?
1. Variables must be set in **Netlify Dashboard**, not in code
2. Rebuild site after adding variables
3. Check variable names (no typos!)

### Real-time Not Working?
1. Verify Supabase URL configuration (step Post-Deployment #1)
2. Check browser console for errors
3. Ensure RLS policies are enabled in Supabase

---

## 📞 Need Help?

- **Full Guide:** See `NETLIFY_DEPLOYMENT.md`
- **Supabase Setup:** See `QUICK_SUPABASE_SETUP.md`
- **Errors:** See `COMMON_ERRORS.md`

---

**Total Time:** ~10 minutes ⏱️

You're ready to stream cricket matches! 🏏🎥
