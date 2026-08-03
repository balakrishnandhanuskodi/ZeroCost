# ZeroCost Netlify Deployment Guide

This guide explains how to deploy the ZeroCost app to Netlify.

## Prerequisites

- Netlify account (sign up at https://netlify.com)
- Git repository pushed to GitHub
- Environment variables configured

## Deployment Options

### Option 1: Connect GitHub Repository (Recommended)

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub**
   - Click "GitHub"
   - Authorize Netlify to access your repositories
   - Select `balakrishnandhanuskodi/ZeroCost`

3. **Configure Build Settings**
   - **Build command**: `pnpm install && pnpm build`
   - **Publish directory**: `dist`
   - **Node version**: 20
   - Click "Deploy site"

4. **Add Environment Variables**
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Click **Edit variables**
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://gmgvjmpeatmcafmhdwon.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZ3ZqbXBlYXRtY2FmbWhkd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODQwMzAsImV4cCI6MjEwMTE2MAwzMH0.9m8vxA84BUwl4nGmKl3G1bW-qmagWSTkUpGnyjBozvw
     ```
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments**
   - Click **Trigger deploy** → **Deploy site**

### Option 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Or use the .env file
netlify deploy --prod --env .env
```

### Option 3: Upload .env File Directly

1. Create or use the `.env` file in the project root
2. In Netlify dashboard → Site settings → Build & deploy → Environment
3. Add each variable from the .env file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_SUPABASE_URL` | `https://gmgvjmpeatmcafmhdwon.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | (your anon key) | Found in Supabase → Settings → API |

## Build Settings Verification

After deployment, verify your site settings:

- **Build command**: `pnpm install && pnpm build`
- **Publish directory**: `dist`
- **Node.js version**: 20 or higher

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch automatically deploys to production
- Pull requests get preview deployments
- Merging a PR to main triggers production deployment

## Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS configuration steps

## Monitoring Deployments

- **Deployments tab**: View all deployment history
- **Build logs**: Debug deployment issues
- **Analytics**: Monitor site performance
- **Functions**: Manage serverless functions (if needed)

## Troubleshooting

### Build Fails
- Check **Build logs** for errors
- Verify environment variables are set
- Ensure `pnpm-lock.yaml` is committed
- Check Node.js version (should be 20+)

### App Won't Load
- Verify VITE_SUPABASE_URL is correct
- Check VITE_SUPABASE_ANON_KEY is valid
- Check browser console for errors
- Verify Supabase project is accessible

### Database Not Working
- Ensure SQL migration is executed in Supabase
- Verify RLS policies allow your anon key
- Check Supabase project is active

## Need Help?

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Supabase Deployment Guide](https://supabase.com/docs/guides/hosting/overview)
