# 🚀 Production Deployment Guide

Complete guide for deploying Cricket Club Platform to production environments.

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] Supabase account with project created
- [ ] Database schema executed (`supabase/schema.sql`)
- [ ] Domain name (optional, can use provided URLs)
- [ ] SSL certificate (provided by hosting platforms)
- [ ] Email service for authentication (Supabase provides this)

### Environment Configuration
- [ ] All environment variables set
- [ ] API keys secured
- [ ] Database connection tested
- [ ] Real-time subscriptions enabled in Supabase

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Advantages:**
- Automatic CI/CD from Git
- Global CDN
- Serverless functions
- Free SSL
- Zero configuration

**Steps:**

1. **Prepare Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)
   - Access your app at `https://your-app.vercel.app`

5. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

**Cost:** Free for hobby projects, $20/month for Pro

---

### Option 2: Docker on VPS (DigitalOcean, AWS EC2, etc.)

**Advantages:**
- Full control
- Cost-effective for high traffic
- Can run other services
- Custom configuration

**Steps:**

1. **Provision Server**
   - DigitalOcean Droplet (2GB RAM minimum)
   - AWS EC2 t3.small or larger
   - Ubuntu 22.04 LTS recommended

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Verify installation
   docker --version
   docker-compose --version
   ```

3. **Clone and Configure**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd cricket-field-planner

   # Create environment file
   cp .env.local.example .env
   nano .env  # Edit with your credentials
   ```

4. **Build and Deploy**
   ```bash
   # Build
   docker-compose build

   # Start services
   docker-compose up -d app

   # Check logs
   docker-compose logs -f app
   ```

5. **Setup Nginx Reverse Proxy**
   ```bash
   # Install Nginx
   sudo apt install nginx -y

   # Create configuration
   sudo nano /etc/nginx/sites-available/cricket-platform
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/cricket-platform /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Get certificate
   sudo certbot --nginx -d your-domain.com

   # Auto-renewal is configured automatically
   ```

**Monthly Cost:** $6-12 (DigitalOcean) or $10-20 (AWS)

---

### Option 3: Docker on Cloud Run (Google Cloud)

**Advantages:**
- Serverless containers
- Auto-scaling
- Pay only for usage
- Integrated monitoring

**Steps:**

1. **Install Google Cloud SDK**
   ```bash
   curl https://sdk.cloud.google.com | bash
   gcloud init
   ```

2. **Build and Push Image**
   ```bash
   # Build for Cloud Run
   docker build -t gcr.io/YOUR_PROJECT_ID/cricket-platform .

   # Push to Google Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/cricket-platform
   ```

3. **Deploy**
   ```bash
   gcloud run deploy cricket-platform \
     --image gcr.io/YOUR_PROJECT_ID/cricket-platform \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NEXT_PUBLIC_SUPABASE_URL=your-url,NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

**Cost:** ~$5-20/month depending on usage

---

### Option 4: Kubernetes (Advanced)

For high-availability production deployment.

**Prerequisites:**
- Kubernetes cluster (GKE, EKS, AKS)
- kubectl configured
- Helm (optional)

**Deployment Files:**

`deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cricket-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cricket-platform
  template:
    metadata:
      labels:
        app: cricket-platform
    spec:
      containers:
      - name: cricket-platform
        image: cricket-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: cricket-secrets
              key: supabase-url
        - name: NEXT_PUBLIC_SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: cricket-secrets
              key: supabase-anon-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: cricket-platform-service
spec:
  selector:
    app: cricket-platform
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

**Deploy:**
```bash
# Create secrets
kubectl create secret generic cricket-secrets \
  --from-literal=supabase-url=your-url \
  --from-literal=supabase-anon-key=your-key

# Apply deployment
kubectl apply -f deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

---

## 🔒 Security Configuration

### 1. Environment Variables
Never commit `.env` files. Use platform-specific secret management:
- Vercel: Environment Variables in dashboard
- Docker: Docker secrets or .env files (not in Git)
- Kubernetes: Kubernetes secrets

### 2. Supabase Security
Enable Row Level Security (RLS) policies:
```sql
-- Already in schema.sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
-- etc.
```

### 3. API Rate Limiting
Configure in Supabase dashboard:
- Settings → API
- Set rate limits per IP
- Enable email rate limiting

### 4. CORS Configuration
Update `next.config.js` for production domain:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        ],
      },
    ]
  },
}
```

---

## 📊 Monitoring & Observability

### Vercel Analytics
- Automatically enabled
- View in Vercel dashboard

### Custom Monitoring

**Setup Sentry (Error Tracking):**
```bash
npm install --save @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Setup Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🧪 Pre-Production Testing

### 1. Build Test
```bash
npm run build
npm start
```

### 2. Docker Test
```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### 3. Load Testing
```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Run load test
k6 run load-test.js
```

`load-test.js`:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://your-domain.com');
  check(response, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test (if you have tests)

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Performance Optimization

### 1. Enable Caching
Already configured in `next.config.js`:
```javascript
output: 'standalone',
```

### 2. Image Optimization
Update `next.config.js`:
```javascript
images: {
  domains: ['your-supabase-project.supabase.co'],
  formats: ['image/avif', 'image/webp'],
},
```

### 3. Database Optimization
- Ensure indexes are created (check `schema.sql`)
- Enable connection pooling in Supabase
- Use database caching for static data

---

## 🔧 Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Review database size and optimize
- [ ] Monthly: Update dependencies (`npm outdated`)
- [ ] Quarterly: Security audit
- [ ] Yearly: Renew SSL certificates (auto with Let's Encrypt)

### Backup Strategy
```bash
# Automated Supabase backups (built-in)
# Manual backup:
pg_dump -h your-db-host -U postgres -d cricket_db > backup.sql
```

### Monitoring Checklist
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Database metrics (Supabase dashboard)

---

## 📞 Support & Troubleshooting

### Common Production Issues

**1. Build fails on Vercel**
- Check build logs
- Verify environment variables
- Test locally: `npm run build`

**2. Database connection timeout**
- Check Supabase project status
- Verify connection string
- Check network/firewall rules

**3. Real-time not working**
- Verify WebSocket is enabled
- Check browser console for errors
- Test with `wscat -c wss://your-project.supabase.co/realtime/v1/websocket`

**4. Slow performance**
- Enable caching
- Optimize database queries
- Use CDN for static assets
- Upgrade hosting plan

---

## ✅ Production Readiness Checklist

### Code
- [x] All features tested
- [x] Error handling implemented
- [x] Loading states added
- [x] TypeScript errors fixed
- [x] Build successful
- [x] No console errors

### Security
- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] API rate limiting configured
- [ ] Authentication working

### Performance
- [x] Build optimized (standalone)
- [x] Images optimized
- [x] Database indexed
- [x] Real-time tested

### Documentation
- [x] README updated
- [x] Setup guide created
- [x] Docker guide available
- [x] Deployment guide complete

### Monitoring
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Uptime monitoring enabled
- [ ] Backup strategy implemented

---

## 🎉 Launch Day Checklist

1. [ ] Final build test
2. [ ] Deploy to production
3. [ ] DNS propagation (if custom domain)
4. [ ] SSL certificate verified
5. [ ] Test all features in production
6. [ ] Monitor logs for 24 hours
7. [ ] Announce launch!

---

**You're ready for production!** 🚀

For technical support, see [README.md](./README.md) or create an issue.
