# PRIME MOBILE — Complete Deployment Guide

This guide shows you how to publish your PRIME MOBILE website to the internet.

---

## Step 1: Prepare Your Supabase Project (5 minutes)

### 1.1 Create a Supabase Account
1. Go to https://supabase.com
2. Click **"Sign Up"** and create a free account
3. Verify your email

### 1.2 Create a New Project
1. Click **"New Project"**
2. Fill in:
   - **Project Name:** `prime-mobile`
   - **Database Password:** Create a strong password (save it safely)
   - **Region:** Choose closest to you
3. Click **Create New Project** and wait ~2 minutes for setup

### 1.3 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)
3. Save both somewhere safe

### 1.4 Set Up the Database
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire SQL from `supabase/schema.sql` in your repository
4. Paste it into the SQL editor
5. Click **Run**
6. Wait for success message

### 1.5 Enable Authentication
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Click **Save**

---

## Step 2: Set Up GitHub Repository (3 minutes)

### 2.1 Ensure Your Repo is Ready
Your repository is already created at:
```
https://github.com/manjotsin0009-sketch/prime-mobile-website
```

### 2.2 Add Environment Variables
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Paste your Supabase URL from Step 1.3

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Paste your Supabase Anon Key from Step 1.3

4. Click **Add secret** after each one

---

## Step 3: Deploy to Vercel (Free Hosting) — RECOMMENDED

**Vercel is the easiest and fastest way to deploy.**

### 3.1 Connect GitHub to Vercel
1. Go to https://vercel.com
2. Click **Sign Up** or **Log In** (use your GitHub account)
3. Click **Authorize Vercel** when prompted
4. Click **New Project**

### 3.2 Import Your Repository
1. Find `prime-mobile-website` in the list
2. Click **Import**
3. Click **Continue**

### 3.3 Add Environment Variables
1. In the **Environment Variables** section, add:

   ```
   VITE_SUPABASE_URL = [your Supabase URL]
   VITE_SUPABASE_ANON_KEY = [your Supabase Anon Key]
   ```

2. Click **Deploy**
3. Wait ~2 minutes for deployment to complete

### 3.4 Get Your Live URL
Once deployed, Vercel will show your live website URL.
It will look like: `https://prime-mobile-website.vercel.app`

**Your website is now live!**

---

## Step 4: Deploy to Netlify (Alternative)

If you prefer Netlify instead of Vercel:

### 4.1 Connect GitHub to Netlify
1. Go to https://netlify.com
2. Click **Log in with GitHub**
3. Authorize Netlify
4. Click **Add new site** → **Import an existing project**

### 4.2 Select Your Repository
1. Choose **GitHub**
2. Find and click `prime-mobile-website`

### 4.3 Configure Build Settings
Leave defaults as they are (Netlify auto-detects Vite):
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 4.4 Add Environment Variables
1. Click **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables** and add:

   ```
   VITE_SUPABASE_URL = [your Supabase URL]
   VITE_SUPABASE_ANON_KEY = [your Supabase Anon Key]
   ```

3. Trigger a rebuild by pushing a commit to GitHub

**Your Netlify site will be live at:** `https://prime-mobile-website.netlify.app`

---

## Step 5: Custom Domain (Optional)

### 5.1 With Vercel
1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Enter your custom domain (e.g., `primemobile.gg`)
4. Follow DNS instructions from your domain registrar

### 5.2 With Netlify
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain and follow DNS setup

---

## Step 6: Test Your Live Website

1. Open your live URL in a browser
2. Test all features:
   - ✅ Download Game button (should open MediaFire link)
   - ✅ Join Discord button (should open Discord invite)
   - ✅ Submit a complaint form (should accept input)
   - ✅ Login/Register (should work with local storage)
   - ✅ Admin dashboard (click "Secure Admin Login")
   - ✅ Mobile responsiveness (test on phone/tablet)

---

## Step 7: Update Local Environment File

For local testing before deployment:

1. Create `.env` file in your project root:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

2. Replace with your actual values from Step 1.3

3. Run locally:
   ```bash
   npm install
   npm run dev
   ```

---

## Troubleshooting

### Website shows blank page
- Check browser console for errors (F12)
- Verify environment variables are set correctly
- Clear browser cache and reload

### Supabase authentication not working
- Make sure SQL schema was run successfully
- Verify Email provider is enabled in Supabase
- Check network tab for API errors

### Environment variables not being used
- For Vercel/Netlify: Redeploy after adding secrets
- For local: Restart `npm run dev` after updating `.env`
- Prefix must be `VITE_` for Vite to expose to client

### "Cannot POST /api/auth..."
- This means Supabase is not connected
- Website will still work in demo mode
- Check environment variables and restart

---

## Production Checklist

Before going live:
- [ ] Supabase project created and running
- [ ] Database schema deployed
- [ ] GitHub secrets configured (URLs & Keys)
- [ ] Website deployed to Vercel or Netlify
- [ ] All features tested on live site
- [ ] Custom domain configured (optional)
- [ ] Admin can log in securely
- [ ] Users can submit complaints
- [ ] Private chat messages work

---

## Monitoring & Support

### View Deployment Logs
- **Vercel:** Dashboard → Deployments → View logs
- **Netlify:** Deploys → Select deployment → View logs

### Check Supabase Status
- Go to Supabase dashboard
- Click **Status** to verify database is running

### Common Issues
- Website loads slowly → Check Supabase region
- Authentication fails → Verify Supabase API keys
- Database errors → Check RLS policies in Supabase

---

## Quick Reference URLs

| Service | URL |
|---------|-----|
| GitHub Repo | https://github.com/manjotsin0009-sketch/prime-mobile-website |
| Supabase Console | https://app.supabase.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Netlify Dashboard | https://app.netlify.com |
| Game Download | https://www.mediafire.com/file/gfq0qlc6e0zayn1/mobile-game-debug.apk/file |
| Discord Server | https://discord.gg/3j2BpN6pr |

---

## You're All Set! 🚀

Your PRIME MOBILE website is now published and ready for players!

**Next steps:**
1. Share the live URL with your community
2. Monitor Supabase for new complaints
3. Train admins on the dashboard
4. Configure custom domain if needed

---

**Questions?** Check the README.md for additional technical details.
