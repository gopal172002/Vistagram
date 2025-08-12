# 🚀 Vistagram Deployment Guide

This guide will help you deploy Vistagram to various cloud platforms.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git repository access
- Platform-specific accounts (Vercel, Railway, etc.)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Choose "Shared" cluster (free tier)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Configure Database Access**
   - Go to "Database Access"
   - Create a new database user
   - Set username and password
   - Assign "Read and write to any database" role

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🌐 Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Environment Variables**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Deploy**
   - Railway will automatically detect the Node.js app
   - Set the root directory to `backend`
   - Deploy will start automatically

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-vistagram-backend
   ```

3. **Add MongoDB Add-on**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Environment**
   - Add environment variables
   - Set build command: `npm install`
   - Set run command: `npm start`

3. **Deploy**
   - Click "Create Resources"

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Option 2: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add `REACT_APP_API_URL`

4. **Deploy**
   - Netlify will automatically deploy on push

### Option 3: GitHub Pages

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/vistagram",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vistagram
NODE_ENV=production

# Optional
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables

```env
# Required
REACT_APP_API_URL=https://your-backend-domain.com

# Optional
REACT_APP_ENVIRONMENT=production
```

## 🔒 Security Considerations

### CORS Configuration

Update your backend CORS settings for production:

```javascript
// In backend/server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

### Environment Variables

- Never commit `.env` files to version control
- Use platform-specific environment variable management
- Rotate secrets regularly
- Use strong passwords for database access

### SSL/HTTPS

- Most platforms provide SSL certificates automatically
- Ensure all API calls use HTTPS in production
- Update frontend API calls to use HTTPS URLs

## 📊 Monitoring & Analytics

### Backend Monitoring

1. **Health Check Endpoint**
   - Use `/api/health` for uptime monitoring
   - Set up alerts for downtime

2. **Error Logging**
   - Implement proper error logging
   - Use services like Sentry for error tracking

3. **Performance Monitoring**
   - Monitor API response times
   - Set up database performance alerts

### Frontend Monitoring

1. **Error Tracking**
   - Implement error boundaries
   - Use services like Sentry for frontend errors

2. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track user interactions

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🧪 Post-Deployment Testing

1. **API Testing**
   ```bash
   # Test health endpoint
   curl https://your-backend-domain.com/api/health
   
   # Test posts endpoint
   curl https://your-backend-domain.com/api/posts
   ```

2. **Frontend Testing**
   - Test all features in production
   - Verify camera functionality
   - Test like/share functionality
   - Check responsive design

3. **Performance Testing**
   - Test image upload speeds
   - Verify API response times
   - Check mobile performance

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS configuration
   - Check frontend URL in backend settings

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for missing environment variables

4. **Image Upload Issues**
   - Verify file size limits
   - Check storage permissions
   - Ensure proper MIME type handling

### Support Resources

- Platform-specific documentation
- MongoDB Atlas support
- React and Node.js community forums
- GitHub issues for specific problems

## 📈 Scaling Considerations

### Backend Scaling

1. **Database**
   - Consider MongoDB Atlas M10+ for production
   - Implement database indexing
   - Set up read replicas if needed

2. **Application**
   - Use load balancers
   - Implement caching (Redis)
   - Consider microservices architecture

### Frontend Scaling

1. **CDN**
   - Use CDN for static assets
   - Implement image optimization
   - Enable gzip compression

2. **Performance**
   - Implement lazy loading
   - Use React.memo for optimization
   - Consider code splitting

---

**Happy Deploying! 🚀**
