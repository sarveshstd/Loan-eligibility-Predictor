# GitHub Pages & Full-Stack Deployment Guide

## Current Status
- ✅ **Frontend**: Deployed to GitHub Pages
- ⏳ **Backend**: Needs to be deployed to a server (Heroku, Render, Railway, or similar)

---

## Part 1: Frontend Deployment (GitHub Pages)

### Your GitHub Pages URL
`https://sarveshstd.github.io/Loan-eligibility-Predictor`

### How to Update and Deploy Frontend
After making changes to the client:

```bash
# 1. Build the React app
cd client
npm run build

# 2. Deploy to GitHub Pages
npm run deploy

# 3. Commit and push
cd ..
git add .
git commit -m "Update frontend"
git push origin master
```

---

## Part 2: Backend Deployment

Your backend needs to be deployed to a server that supports Node.js. Choose one:

### **Option 1: Deploy to Render.com (Recommended - Free Tier)**

1. **Sign up** at https://render.com
2. **Create a new Web Service**
3. **Connect your GitHub repo**
4. **Configure:**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     ```
     MONGODB_URI=your-mongodb-atlas-uri
     JWT_SECRET=your-jwt-secret
     NODE_ENV=production
     PORT=5000
     ```
5. **Deploy** (takes 2-5 minutes)
6. **Get your backend URL** (e.g., `https://loan-api.onrender.com`)

### **Option 2: Deploy to Heroku**

1. **Sign up** at https://www.heroku.com
2. **Install Heroku CLI**
3. **Login**: `heroku login`
4. **Create app**: `heroku create your-app-name`
5. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   ```
6. **Create Procfile** in root:
   ```
   web: cd server && node index.js
   ```
7. **Push**: `git push heroku master`

### **Option 3: Deploy to Railway.app**

1. **Sign up** at https://railway.app
2. **Connect GitHub**
3. **Auto-detect Node.js**
4. **Set environment variables** in dashboard
5. **Deploy automatically**

---

## Part 3: Connect Frontend to Backend

Once your backend is deployed, update the API endpoint:

### **Method 1: Environment Variable (Recommended)**

Create `.env` file in client folder:
```
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
```

Then rebuild and deploy:
```bash
cd client
npm run build
npm run deploy
```

### **Method 2: Update Code Directly**

Edit `client/src/context/AuthContext.js`:
```javascript
const API_URL = 'https://your-backend-url.herokuapp.com/api';
```

---

## Part 4: Update GitHub Pages Settings

1. Go to your repository: https://github.com/sarveshstd/Loan-eligibility-Predictor
2. Click **Settings**
3. Go to **Pages** section
4. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

---

## Testing Your Deployment

### Test Frontend
Visit: `https://sarveshstd.github.io/Loan-eligibility-Predictor`

Should see:
- ✅ Login page with form
- ✅ Signup form
- ✅ Dashboard (after login)
- ✅ Loan calculator

### Test Backend Connection
1. Click **Signup**
2. Enter details
3. Should register successfully
4. Should see JWT token in browser console

---

## Environment Variables Checklist

### Backend (.env in server folder)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-checker
JWT_SECRET=your-super-secret-key
NODE_ENV=production
PORT=5000
CLIENT_URL=https://sarveshstd.github.io/Loan-eligibility-Predictor
```

### Frontend (.env in client folder - Optional)
```
REACT_APP_API_URL=https://your-backend-url/api
```

---

## Full Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│           User Browser (GitHub Pages)                       │
│   https://sarveshstd.github.io/Loan-eligibility-Predictor  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Requests
                         ▼
        ┌────────────────────────────────────┐
        │    Your Backend Server             │
        │ (Heroku/Render/Railway)            │
        │ https://your-backend-url/api       │
        └────────────────┬───────────────────┘
                         │
                         │ Database Operations
                         ▼
        ┌────────────────────────────────────┐
        │    MongoDB Atlas (Cloud)           │
        │    (Your database connection)      │
        └────────────────────────────────────┘
```

---

## Troubleshooting

### Frontend shows "cannot reach API"
- Check if backend is deployed and running
- Check CORS settings in `server/index.js`
- Verify `REACT_APP_API_URL` is correct

### GitHub Pages shows "text only"
- Run `npm run deploy` again
- Clear browser cache
- Check that GitHub Pages is set to use `gh-pages` branch

### Backend API errors
- Verify MongoDB URI is correct
- Check environment variables are set on hosting platform
- Look at backend logs on Heroku/Render

---

## Next Steps

1. ✅ **Frontend deployed** (GitHub Pages)
2. **Deploy backend** to Heroku/Render/Railway
3. **Update API URL** in frontend env variables
4. **Test the full application**
5. **Share your deployed link**!

Your application will be fully functional and available online! 🎉

---

**Support Resources:**
- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Railway Documentation](https://docs.railway.app/)
- [GitHub Pages Documentation](https://pages.github.com/)
