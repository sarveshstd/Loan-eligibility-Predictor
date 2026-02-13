# Render Deployment - Quick Reference Card

## 📋 Quick Setup (5 minutes)

### 1. Go to Render
```
https://render.com → Sign up with GitHub
```

### 2. Create Web Service
- Click "New +" → "Web Service"
- Select your repo: **Loan-eligibility-Predictor**
- Click "Connect"

### 3. Configuration Values

| Field | Value |
|-------|-------|
| Service Name | `loan-api` |
| Environment | `Node` |
| Build Command | `cd server && npm install` |
| Start Command | `cd server && npm start` |
| Region | Default |
| Instance | Free |

### 4. Environment Variables (Add each one)

```
MONGODB_URI
mongodb+srv://sarveshwaransanjeevi_db_user:v1nngorPfFaZ8baA@loandb.epbz2gl.mongodb.net/loan-checker?retryWrites=true&w=majority

JWT_SECRET
your-super-secret-jwt-key-change-in-production-12345

NODE_ENV
production

PORT
5000

CLIENT_URL
https://sarveshstd.github.io/Loan-eligibility-Predictor
```

### 5. Click "Create Web Service" and Wait!

**Deployment takes 2-5 minutes**

---

## 📍 After Deployment

Your backend URL will be:
```
https://loan-api.onrender.com
```

**Or unique name like:**
```
https://your-custom-name.onrender.com
```

---

## 🔗 Update Frontend

```bash
cd "c:\Users\sarve\OneDrive\Desktop\Loan\client"

# Create .env file
echo "REACT_APP_API_URL=https://loan-api.onrender.com/api" > .env

# Rebuild and deploy
npm run build
npm run deploy
```

---

## ✅ Test Connection

### Test Backend
```
https://loan-api.onrender.com/api/health
```
Should see: `{"status":"ok"...}`

### Test Full App
1. Go to: https://sarveshstd.github.io/Loan-eligibility-Predictor/
2. Click Signup
3. Register email: test@example.com
4. Password: Test@123
5. Should register and show token

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot reach API" | Check .env file has correct URL, rebuild frontend |
| Backend error logs | Check all env variables are set correctly |
| Page shows "text only" | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Render deployment stuck | Wait 5 minutes, refresh page, check logs |
| MongoDB connection failed | Verify IP whitelist allows 0.0.0.0 in MongoDB Atlas |

---

## 🎯 Success Indicators

✅ Render shows "Live" status  
✅ Health endpoint responds  
✅ Frontend loads without errors  
✅ Can submit signup form  
✅ Receives JWT token  
✅ Can login with credentials  

---

## 🔄 Making Updates

After changing server code:

```bash
cd "c:\Users\sarve\OneDrive\Desktop\Loan"
git add .
git commit -m "Update backend"
git push origin master

# Render auto-deploys!
```

---

## 📞 Support

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- GitHub Issues: Check repo discussions

---

**Your App Structure:**

```
User → GitHub Pages Frontend
  ↓ (API Request)
Render Backend API
  ↓ (Database Query)
MongoDB Atlas
```

All connected and working! 🚀
