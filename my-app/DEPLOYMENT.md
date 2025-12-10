# 🚀 Deployment Guide

This guide will help you deploy the Praxis Booking Appointment Application to Vercel or Netlify.

## Prerequisites

1. **GitHub Repository**: Your code should be in a public GitHub repository
2. **Backend API**: Your Spring Boot backend should be deployed and accessible
3. **Account**: Create a free account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## 🌐 Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest option and works seamlessly with Vite/React apps.

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your repository**: `booking-appointment-application`
4. **Configure the project**:
   - Framework Preset: **Vite**
   - Root Directory: `my-app` (if your app is in the `my-app` folder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`
   - Add: `VITE_AI_MODEL` = `claude-haiku-4.5` (optional)

6. **Click "Deploy"**

### Step 3: Deploy via CLI (Alternative)

```bash
cd my-app
vercel
```

Follow the prompts. When asked about environment variables, add:
- `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Step 4: Production Deployment

```bash
vercel --prod
```

### 📝 Notes for Vercel:

- ✅ Automatic HTTPS
- ✅ Automatic deployments on git push
- ✅ Free custom domain
- ✅ Global CDN
- ✅ The `vercel.json` file is already configured for SPA routing

---

## 🎯 Option 2: Deploy to Netlify

Netlify is another excellent option with similar features.

### Step 1: Deploy via Dashboard

1. **Go to [netlify.com](https://netlify.com)** and sign in with GitHub
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Configure build settings**:
   - Base directory: `my-app`
   - Build command: `npm run build`
   - Publish directory: `my-app/dist`

5. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`
   - Add: `VITE_AI_MODEL` = `claude-haiku-4.5` (optional)

6. **Click "Deploy site"**

### Step 2: Deploy via CLI (Alternative)

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Deploy**:
```bash
cd my-app
netlify deploy --prod
```

### 📝 Notes for Netlify:

- ✅ Automatic HTTPS
- ✅ Automatic deployments on git push
- ✅ Free custom domain
- ✅ The `netlify.toml` file is already configured for SPA routing

---

## 🔧 Environment Variables

Both platforms need the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Your backend API URL | `https://api.example.com/api` |
| `VITE_AI_MODEL` | AI model (optional) | `claude-haiku-4.5` |

### Important Notes:

1. **Environment variables must start with `VITE_`** to be accessible in your React app
2. **After adding environment variables, you need to trigger a new deployment**
3. **For production, use HTTPS URLs for your backend API**

---

## 🔄 Continuous Deployment

Both Vercel and Netlify automatically deploy when you push to your main branch:

1. Push changes to GitHub
2. Platform detects changes
3. Builds and deploys automatically
4. Updates live site (usually in 1-2 minutes)

---

## 📱 Testing Your Deployment

After deployment, test the following:

1. ✅ Homepage loads
2. ✅ Navigation works
3. ✅ Login/Register pages work
4. ✅ API calls work (check browser console for errors)
5. ✅ All routes work (SPA routing)
6. ✅ Forms submit correctly

### Common Issues:

**Issue**: API calls fail
- **Solution**: Check `VITE_API_BASE_URL` is set correctly and backend CORS allows your frontend domain

**Issue**: Routes return 404
- **Solution**: Verify redirect rules in `vercel.json` or `netlify.toml` are correct

**Issue**: Build fails
- **Solution**: Test build locally with `npm run build` and fix any errors

---

## 🌍 Custom Domain (Optional)

Both platforms offer free custom domains:

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

---

## 📊 Deployment Checklist

Before submitting your project:

- [ ] Code pushed to GitHub (public repository)
- [ ] Application deployed to Vercel or Netlify
- [ ] Environment variables configured
- [ ] Application accessible via public URL
- [ ] All features tested on deployed version
- [ ] API connection working
- [ ] SPA routing working (no 404s on refresh)
- [ ] Add deployment URL to README.md

---

## 🔗 Updating Your README

Add the deployment URL to your README.md:

```markdown
## 🌐 Live Demo

**Deployed Application**: [https://your-app.vercel.app](https://your-app.vercel.app)

**Backend API**: [https://your-backend-domain.com](https://your-backend-domain.com)
```

---

## 💡 Tips

1. **Backend CORS**: Make sure your backend allows requests from your deployment domain
2. **Environment Variables**: Never commit `.env` files with production credentials
3. **Build Testing**: Always test `npm run build` locally before deploying
4. **Preview Deployments**: Both platforms create preview deployments for pull requests

---

## 🆘 Troubleshooting

### Build fails with "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API calls fail after deployment
- Check CORS settings on backend
- Verify environment variable is set correctly
- Check browser console for exact error

### Routes show 404
- Verify `vercel.json` or `netlify.toml` redirect rules
- Ensure all routes redirect to `/index.html`

---

**Need help?** Check the platform documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)

