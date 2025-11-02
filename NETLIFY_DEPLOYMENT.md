# 🚀 Deploying Cricket Club Platform to Netlify

This guide will help you deploy your Cricket Club Platform to Netlify with full functionality including real-time scoring, streaming, and overlay features.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Supabase Project**: You need a Supabase project with the database schema set up
3. **GitHub Repository**: Your code should be in a GitHub repository (or GitLab/Bitbucket)

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Install Netlify Plugin
```bash
npm install --save-dev @netlify/plugin-nextjs
```

### 1.2 Verify Files Exist
Make sure these files are in your repository:
- ✅ `netlify.toml` (configuration file)
- ✅ `package.json` (with dependencies)
- ✅ `.env.local.example` (environment variable template)

### 1.3 Commit and Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

---

## 🌐 Step 2: Deploy to Netlify

### 2.1 Import Your Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** (or your Git provider)
4. Authorize Netlify to access your repositories
5. Select your **cricket-field-planner** repository

### 2.2 Configure Build Settings

Netlify should auto-detect Next.js settings:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Functions directory** | `netlify/functions` |

If not auto-detected, enter these manually.

---

## 🔐 Step 3: Set Environment Variables

### 3.1 Required Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**, add:

#### Supabase Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional (for production):
```bash
# Node environment
NODE_ENV=production

# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1
```

### 3.2 How to Find Supabase Keys

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🏗️ Step 4: Deploy

### 4.1 Trigger Deployment

1. Click **"Deploy site"** in Netlify
2. Wait for build to complete (3-5 minutes)
3. Netlify will provide a URL like: `https://your-site-name.netlify.app`

### 4.2 Monitor Build Logs

- Watch the build logs for any errors
- Common issues and fixes below

---

## 🎯 Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `cricketclub.com`)
4. Follow DNS configuration instructions

### 5.2 Enable HTTPS

- Netlify automatically provisions SSL certificates
- HTTPS will be enabled within a few minutes

---

## ⚙️ Step 6: Post-Deployment Configuration

### 6.1 Update Supabase URLs (Important!)

In Supabase dashboard, add your Netlify URL to allowed origins:

1. Go to **Authentication** → **URL Configuration**
2. Add to **Site URL**: `https://your-site-name.netlify.app`
3. Add to **Redirect URLs**:
   - `https://your-site-name.netlify.app/auth/callback`
   - `https://your-site-name.netlify.app/**`

### 6.2 Test Real-time Features

Test these critical features:
- ✅ Create a match
- ✅ Start scoring
- ✅ Verify overlay updates in real-time
- ✅ Test mobile streaming (if applicable)
- ✅ Check PWA installation

---

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails with "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### Issue 2: Environment Variables Not Working
**Solution:**
- Verify variables are set in Netlify (not just in `.env.local`)
- Variable names must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables

### Issue 3: Real-time Not Working
**Solution:**
- Check Supabase URL configuration
- Verify RLS policies are enabled
- Check browser console for CORS errors

### Issue 4: Overlay Not Loading in OBS
**Solution:**
- Use the full Netlify URL: `https://your-site.netlify.app/overlay?match=123`
- Enable "Shutdown source when not visible" = OFF in OBS
- Check browser source dimensions (1920x1080)

### Issue 5: PWA Not Installing
**Solution:**
- Ensure site is served over HTTPS (Netlify does this automatically)
- Check `manifest.json` is accessible
- Verify service worker is registered

---

## 📊 Monitoring & Analytics

### Enable Netlify Analytics (Optional)
1. Go to **Site settings** → **Analytics**
2. Enable Netlify Analytics ($9/month)
3. View traffic, performance, and errors

### Check Function Logs
1. Go to **Functions** tab
2. View serverless function invocations
3. Monitor errors and performance

---

## 🔄 Continuous Deployment

Netlify automatically deploys on every push to `main`:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Netlify auto-deploys (2-5 minutes)
4. Check deploy status in Netlify dashboard

### Deploy Previews
- Every pull request gets a unique preview URL
- Test changes before merging
- Automatic cleanup after merge

---

## 🎨 Customize Your Deployment

### Custom Build Command
Edit `netlify.toml`:
```toml
[build]
  command = "npm run build && npm run post-build"
```

### Custom Redirects
Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

### Custom Headers
Already configured in `netlify.toml` for security and performance.

---

## 📱 Mobile Streaming Setup on Netlify

### Using Larix Broadcaster (Recommended)

1. **Get your stream overlay URL:**
   ```
   https://your-site.netlify.app/overlay?match=YOUR_MATCH_ID
   ```

2. **In OBS Studio:**
   - Add **Browser Source**
   - URL: Your overlay URL above
   - Width: 1920, Height: 1080
   - Custom CSS: `body { background-color: rgba(0, 0, 0, 0); }`

3. **Stream to YouTube:**
   - Use OBS or Larix with your YouTube stream key
   - Overlay will composite automatically

---

## 🔒 Security Checklist

Before going live:

- ✅ Environment variables set correctly
- ✅ Supabase RLS policies enabled
- ✅ HTTPS enabled (automatic on Netlify)
- ✅ Allowed origins configured in Supabase
- ✅ API keys never committed to Git
- ✅ Custom domain configured (optional)

---

## 📈 Performance Optimization

### Already Configured:
- ✅ Static asset caching (1 year)
- ✅ Service worker for PWA
- ✅ Automatic image optimization
- ✅ CDN distribution globally
- ✅ Gzip/Brotli compression

### To Monitor:
1. Check Netlify **Site speed** metrics
2. Use **Lighthouse** in Chrome DevTools
3. Monitor **Core Web Vitals**

---

## 🆘 Getting Help

### Netlify Support
- [Netlify Support Forums](https://answers.netlify.com/)
- [Next.js on Netlify Docs](https://docs.netlify.com/integrations/frameworks/next-js/)

### Application Issues
- Check browser console for errors
- Review Netlify function logs
- Verify Supabase connection

### Community
- [Netlify Discord](https://discord.gg/netlify)
- [Next.js Discord](https://discord.gg/nextjs)

---

## ✅ Deployment Checklist

Use this checklist for every deployment:

- [ ] Code pushed to GitHub
- [ ] Environment variables set in Netlify
- [ ] Build completes successfully
- [ ] Site accessible at Netlify URL
- [ ] Supabase URLs configured
- [ ] Test match creation
- [ ] Test scoring interface
- [ ] Test overlay in browser
- [ ] Test real-time updates
- [ ] PWA installable
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics enabled (optional)

---

## 🎉 You're Live!

Your Cricket Club Platform is now deployed and ready to stream matches!

**Share your deployment:**
- URL: `https://your-site.netlify.app`
- Overlay URL for OBS: `https://your-site.netlify.app/overlay?match=[id]`

**Next Steps:**
1. Create your first match
2. Start scoring
3. Add overlay to OBS
4. Stream to YouTube
5. Share with your cricket club!

---

## 📞 Support

For deployment issues specific to this platform:
- Check `COMMON_ERRORS.md` for troubleshooting
- Review `SETUP_GUIDE.md` for initial setup
- See `README.md` for feature documentation

Happy Streaming! 🏏🎥
