# FedPackTrack Deployment Guide

## Deploying to Render

### Prerequisites
- GitHub account with your FedPackTrack repository
- Render account (sign up at [render.com](https://render.com))

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Make sure all dependencies are in `package.json`
3. Verify the build script works locally: `npm run build`

### Step 2: Deploy to Render
1. **Sign up/Login** to Render at [render.com](https://render.com)
2. **Create New** → "Web Service"
3. **Connect your GitHub repository** (FedPackTrack)
4. **Configure the service**:
   - **Name**: `fedpacktrack` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

### Step 3: Add PostgreSQL Database
1. **Create New** → "PostgreSQL"
2. **Configure database**:
   - **Name**: `fedpacktrack-db`
   - **Database**: `fedpacktrack`
   - **User**: `fedpacktrack_user`
   - **Plan**: Free (or choose paid plan)
3. **Copy the connection string** provided by Render

### Step 4: Configure Environment Variables
In your Render web service dashboard, go to "Environment" and add:

```
DATABASE_URL=postgresql://[Render will provide this automatically]
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
SESSION_SECRET=your-random-secret-string-here
```

### Step 5: Deploy
1. Render will automatically detect your Node.js app
2. It will run the build command: `npm install && npm run build`
3. Then start your app with `npm start`
4. Your app will be available at the provided Render URL

### Step 6: Set Up Database
1. Go to your PostgreSQL database in Render
2. Copy the connection string
3. Set it as `DATABASE_URL` in your environment variables
4. Run database migrations (Render will handle this automatically)

### Step 7: Connect Your Custom Domain
1. **In Render dashboard**, go to your web service → "Settings" → "Custom Domains"
2. **Add your custom domain** (e.g., `yourdomain.com`)
3. **Render will provide DNS records** to configure:
   - Usually a CNAME record pointing to your Render app
   - Or A records if you prefer
4. **Configure your domain's DNS**:
   - Go to your domain registrar's DNS settings
   - Add the CNAME record: `yourdomain.com` → `your-app.onrender.com`
   - Or add A records as provided by Render
5. **Wait for DNS propagation** (can take up to 24 hours, usually much faster)
6. **SSL certificate** will be automatically provisioned by Render

## Environment Variables Explained

- **DATABASE_URL**: PostgreSQL connection string (provided by Railway)
- **NODE_ENV**: Set to "production" for optimized builds
- **PORT**: Railway will set this automatically
- **HOST**: Set to "0.0.0.0" to accept all connections
- **SESSION_SECRET**: Random string for session encryption

## Domain Configuration

### Popular Domain Registrars and DNS Setup:

**Namecheap:**
1. Go to "Domain List" → "Manage" → "Advanced DNS"
2. Add CNAME record: `@` → `your-app.onrender.com`

**GoDaddy:**
1. Go to "DNS Management" → "Records"
2. Add CNAME record: `@` → `your-app.onrender.com`

**Google Domains:**
1. Go to "DNS" → "Custom records"
2. Add CNAME record: `@` → `your-app.onrender.com`

**Cloudflare:**
1. Go to "DNS" → "Records"
2. Add CNAME record: `@` → `your-app.onrender.com`
3. Set proxy status to "DNS only" (gray cloud)

**Note**: Replace `your-app.onrender.com` with the actual Render URL provided in your dashboard.

## Troubleshooting

### Build Issues
- Check Railway logs for build errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally

### Database Issues
- Ensure `DATABASE_URL` is correctly set
- Check database connection in Railway logs
- Run `npm run db:push` if migrations fail

### Runtime Issues
- Check application logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure port configuration is correct

## Cost Estimation
- **Render Free Tier**: $0/month (includes database and web service)
- **Render Paid Plan**: $7/month (if you need more resources)
- **Your Domain**: Already purchased ✅
- **SSL Certificate**: Free (automatically provided by Render)

## Support
If you encounter issues:
1. Check Railway documentation
2. Review application logs
3. Verify environment variables
4. Test locally with production settings
