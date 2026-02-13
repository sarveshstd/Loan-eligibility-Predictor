# Deploy Backend to Render.com - Step by Step Guide

## Introduction
Render.com is the easiest way to deploy your Node.js backend. It takes ~5 minutes and has a free tier.

---

## Step 1: Create Render Account

1. Go to https://render.com
2. Click **Sign up**
3. Choose **Sign up with GitHub** (easiest)
4. Authorize Render to access your GitHub account
5. Click **Authorize**

✅ Account created!

---

## Step 2: Create a New Web Service

1. After login, click **New +** button (top right)
2. Select **Web Service**
3. Look for your repo: **Loan-eligibility-Predictor**
4. Click **Connect** next to it
5. You might need to grant Render access to your GitHub repos

✅ Repository connected!

---

## Step 3: Configure Your Service

Fill in these details on the Render form:

### Service Name
```
loan-api
```
(Can be anything, this becomes your subdomain)

### Environment
```
Node
```
(Should auto-detect)

### Build Command
```
cd server && npm install
```

### Start Command
```
cd server && npm start
```

### Region
```
Leave as default (closest to you)
```

### Instance Type
```
Free (for testing)
```

### Environment Variables
Click **Add Environment Variable** and add these one by one:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://sarveshwaransanjeevi_db_user:v1nngorPfFaZ8baA@loandb.epbz2gl.mongodb.net/loan-checker?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production-12345` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://sarveshstd.github.io/Loan-eligibility-Predictor` |

✅ All settings configured!

---

## Step 4: Deploy

1. Scroll to bottom
2. Click **Create Web Service**
3. Wait 2-5 minutes for deployment

You'll see logs streaming - wait for:
```
Server running on port 5000
MongoDB Connected: ...
```

✅ Backend deployed!

---

## Step 5: Get Your Backend URL

1. Go to your service dashboard on Render
2. Look for the URL at the top (e.g., `https://loan-api.onrender.com`)
3. **Copy this URL**

Example: `https://loan-api.onrender.com`

✅ You have your backend URL!

---

## Step 6: Update Frontend with Backend URL

Now update your frontend to use this backend:

### Option A: Via Command Line

```bash
# Navigate to project
cd "c:\Users\sarve\OneDrive\Desktop\Loan"

# Go to client folder
cd client

# Create .env file with your backend URL
echo "REACT_APP_API_URL=https://loan-api.onrender.com/api" > .env

# Rebuild
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Option B: Manual File Edit

1. Open `c:\Users\sarve\OneDrive\Desktop\Loan\client\.env`
2. Add (create if doesn't exist):
   ```
   REACT_APP_API_URL=https://loan-api.onrender.com/api
   ```
3. Save file
4. Run:
   ```bash
   cd "c:\Users\sarve\OneDrive\Desktop\Loan\client"
   npm run build
   npm run deploy
   ```

✅ Frontend updated!

---

## Step 7: Test Everything

### Test Backend Health
Open in browser:
```
https://loan-api.onrender.com/api/health
```

Should respond:
```json
{"status":"ok","message":"Loan Eligibility Checker API is running"}
```

✅ Backend working!

### Test Frontend with Backend
1. Go to https://sarveshstd.github.io/Loan-eligibility-Predictor/
2. Click **Signup**
3. Fill in form (valid email required)
4. Click **Sign Up**
5. Should register successfully and show JWT token

✅ Full app working!

---

## Troubleshooting

### "Cannot reach API" error
- Check if backend URL is correct in .env
- Verify `REACT_APP_API_URL` matches your Render URL
- Rebuild frontend: `npm run build && npm run deploy`
- Hard refresh browser (Ctrl+Shift+R)

### Backend shows error
- Check Render logs for details
- Verify MongoDB URI is correct
- Check all environment variables are set
- Make sure IP whitelist in MongoDB allows 0.0.0.0

### Deployment stuck
- Wait 5 minutes (sometimes takes longer on free tier)
- Refresh Render dashboard
- Check logs for errors

---

## Full Application Flow (Now Complete!)

```
┌─────────────────────────────────────────────────┐
│  User Browser (GitHub Pages)                    │
│  https://sarveshstd.github.io/...               │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Requests
                   ▼
    ┌──────────────────────────────────┐
    │  Render Backend                  │
    │  https://loan-api.onrender.com   │
    └──────────────┬───────────────────┘
                   │
                   │ Database Operations
                   ▼
    ┌──────────────────────────────────┐
    │  MongoDB Atlas (Cloud)           │
    │  Your database connection        │
    └──────────────────────────────────┘
```

---

## Success Checklist

After completing all steps:

- [ ] Render account created
- [ ] Web Service created on Render
- [ ] Environment variables set
- [ ] Deployment completed (no errors)
- [ ] Backend health check works
- [ ] Frontend .env updated with backend URL
- [ ] Frontend rebuilt and redeployed
- [ ] Can register new user
- [ ] Receives JWT token
- [ ] Can login with registered account

---

## Summary

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Deployed | https://sarveshstd.github.io/Loan-eligibility-Predictor |
| Backend | ✅ Deployed on Render | https://loan-api.onrender.com |
| Database | ✅ MongoDB Atlas | Connected |
| Full App | ✅ Working | All features functional |

---

## Your Application is Now LIVE! 🎉

**Share this link:**
```
https://sarveshstd.github.io/Loan-eligibility-Predictor/
```

Users can now:
- ✅ Access the website
- ✅ Sign up with email
- ✅ Login with credentials
- ✅ Check loan eligibility
- ✅ Use AI assistant
- ✅ Calculate EMI

---

## Need to Update Backend?

After making changes to server code:

```bash
# Commit changes
cd "c:\Users\sarve\OneDrive\Desktop\Loan"
git add .
git commit -m "Update backend code"
git push origin master

# Render auto-deploys on GitHub push!
# Check Render dashboard for deployment status
```

---

## Important Notes

- Free tier on Render: Auto-spins down after 15 minutes of inactivity
- For production: Upgrade to paid plan ($7/month minimum)
- MongoDB Atlas free tier: 512 MB storage (enough for testing)
- Your MongoDB credentials are already configured ✅

---

**Congrats! Your app is now live on the internet!** 🚀
