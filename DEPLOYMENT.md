# Deployment Configuration Guide

## Issue Resolution

The "Network Error" you're experiencing occurs because your deployed frontend is trying to connect to `localhost:3000`, which doesn't exist in the production environment.

## What Was Fixed

1. **Updated axios configuration** to use environment variables instead of hardcoded localhost URL
2. **Corrected the port** in `.env` file from 5000 to 3000 (matching your backend)
3. **Created `.env.production`** template for production deployment

## Deployment Steps

### 1. Deploy Your Backend First

Before deploying the frontend, make sure your backend is deployed and accessible. Popular options:

- **Render**: https://render.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Vercel**: https://vercel.com (for serverless functions)

#### Backend Environment Variables:
Set these in your backend deployment platform:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=3000
```

### 2. Update Production Environment Variables

After deploying your backend, update the `.env.production` file:

```bash
# Replace with your actual backend URL
VITE_API_BASE_URL=https://your-actual-backend-url.com/api
```

### 3. Deploy Frontend

#### For Vercel:
1. Connect your GitHub repo to Vercel
2. Set environment variable in Vercel dashboard:
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
3. Deploy

#### For Netlify:
1. Connect your GitHub repo to Netlify
2. Set environment variable in Netlify dashboard:
   - `VITE_API_BASE_URL` = `https://your-backend-url.com/api`
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Environment Variables Explanation

- **Development** (`.env`): Uses `http://localhost:3000/api`
- **Production** (`.env.production`): Uses your deployed backend URL

## Testing Locally

To test the fix locally:

1. Start your backend:
```bash
cd Backend
npm start
```

2. Start your frontend:
```bash
cd Frontend
npm run dev
```

## Common Deployment Platforms

### Backend Deployment URLs:
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.railway.app`
- Heroku: `https://your-app-name.herokuapp.com`

### Example Configuration:
If your backend is deployed to Render at `https://food-reel-backend.onrender.com`, then set:
```
VITE_API_BASE_URL=https://food-reel-backend.onrender.com/api
```

## Important Notes

1. **CORS**: Make sure your backend allows requests from your frontend domain
2. **Environment Variables**: Frontend environment variables must start with `VITE_`
3. **Build Process**: Environment variables are embedded during build time, not runtime
4. **SSL**: Use HTTPS URLs for production deployments

## Troubleshooting

If you still get network errors after deployment:
1. Check browser developer tools → Network tab
2. Verify the API URL being called
3. Check backend logs for CORS or other errors
4. Ensure backend is running and accessible