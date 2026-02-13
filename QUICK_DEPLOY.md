# Quick Deployment Commands

## Frontend Deployment to GitHub Pages

### Build and Deploy
```bash
# Navigate to project root
cd c:\Users\sarve\OneDrive\Desktop\Loan

# Build the frontend
cd client
npm run build

# Deploy to GitHub Pages
npm run deploy

# Commit and push
cd ..
git add .
git commit -m "Deploy frontend update"
git push origin master
```

### Verify Deployment
```bash
# Check if gh-pages branch was created
git branch -a

# Your site will be live at:
# https://sarveshstd.github.io/Loan-eligibility-Predictor
```

---

## Backend Deployment

### Local Backend Testing
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### Deploy to Render.com (Easiest)
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set these values:
   - **Name**: loan-api
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=your-mongodb-uri
     JWT_SECRET=your-secret-key
     NODE_ENV=production
     ```
5. Click "Deploy"
6. Get your URL from Render dashboard

### Deploy to Heroku
```bash
# Install Heroku CLI first from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create loan-eligibility-api

# Add .env variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret-key"

# Add Procfile to root directory with:
# web: cd server && npm start

# Deploy
git push heroku master

# Check logs
heroku logs --tail
```

---

## Connect Frontend to Backend

### After deploying backend, update frontend:

**Create/Edit `.env` file in client folder:**
```
REACT_APP_API_URL=https://your-backend-url/api
```

Replace `your-backend-url` with:
- If Render: `https://loan-api.onrender.com`
- If Heroku: `https://your-app-name.herokuapp.com`

### Then redeploy frontend:
```bash
cd client
npm run build
npm run deploy
```

---

## Verify Everything Works

### Check Frontend
```
https://sarveshstd.github.io/Loan-eligibility-Predictor
- Should display login page
- Click signup and register (should connect to your backend)
```

### Check Backend Health
```bash
# Replace with your backend URL
curl https://your-backend-url/api/health
# Should return: {"status":"ok","message":"..."}
```

---

## Environment Variables Needed

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-checker
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
CLIENT_URL=https://sarveshstd.github.io/Loan-eligibility-Predictor
NODE_ENV=production
```

### Client (.env - optional)
```
REACT_APP_API_URL=https://your-deployed-backend-url/api
```

---

## Debugging

### If frontend shows only text:
```bash
cd client
rm -rf build
npm run build
npm run deploy
```

### If API connection fails:
1. Check if backend is running
2. Verify `REACT_APP_API_URL` is correct
3. Check CORS in `server/index.js`:
   ```javascript
   origin: process.env.CLIENT_URL || 'http://localhost:3000'
   ```
4. Test backend directly:
   ```bash
   curl https://your-backend-url/api/health
   ```

### Check GitHub Pages settings:
1. Go to https://github.com/sarveshstd/Loan-eligibility-Predictor/settings/pages
2. Verify Source is set to `gh-pages` branch
3. Click "Visit site" to test

---

## Success Indicators ✅

- [ ] Frontend loads at `https://sarveshstd.github.io/Loan-eligibility-Predictor`
- [ ] Login/Signup forms are visible
- [ ] Can register a new user
- [ ] Receives JWT token after signup
- [ ] Backend API responds to requests
- [ ] MongoDB stores user data

---

## Useful Links
- GitHub Repo: https://github.com/sarveshstd/Loan-eligibility-Predictor
- GitHub Pages: https://sarveshstd.github.io/Loan-eligibility-Predictor
- Backend URL: *Your deployed backend*
- MongoDB: https://www.mongodb.com/cloud/atlas
