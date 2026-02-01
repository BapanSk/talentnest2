# 🚀 Complete Setup Guide - Job Application Management System

This guide will help you set up both the **frontend** and **backend** of the Job Application Management System.

## 📦 What You'll Get

- ✅ Modern, responsive frontend with beautiful gradients
- ✅ Complete REST API backend with database
- ✅ Sample data pre-loaded
- ✅ Full integration between frontend and backend

## 📋 Prerequisites

Before starting, install:
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. A web browser (Chrome, Firefox, Safari, or Edge)
3. A code editor (VS Code recommended)

**Check your Node.js installation:**
```bash
node --version
npm --version
```

## 🎯 Quick Start (5 Minutes)

### Step 1: Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║  Job Application Management System API                    ║
║  Server running on http://localhost:3000                  ║
╚═══════════════════════════════════════════════════════════╝
```

✅ **Backend is ready!** Keep this terminal window open.

---

### Step 2: Set Up the Frontend

Open a **new terminal window** and:

```bash
# Navigate to frontend folder (parent directory)
cd ..

# Open index.html in your browser
# Option 1: Double-click index.html
# Option 2: Use a simple server

# For Python 3:
python -m http.server 8000

# For Node.js:
npx http-server -p 8000

# For PHP:
php -S localhost:8000
```

Then open your browser and go to:
```
http://localhost:8000
```

✅ **Frontend is ready!**

---

## 🎉 You're Done!

The system is now running:
- **Backend API:** http://localhost:3000
- **Frontend:** http://localhost:8000

## 📝 How to Use

### 1. View Jobs
- The jobs section will automatically load 3 sample jobs
- Click "Apply Now" on any job

### 2. Submit Application
- Fill in the application form:
  - Select a position
  - Enter your name
  - Enter your email
  - Paste a link to your resume
- Click "Submit Application"
- You'll receive an **Application ID** - save this!

### 3. Check Status
- Scroll to "Check Application Status"
- Enter your Application ID
- View your application details and current status

### 4. Admin Panel (Update Status)
- Scroll to "Admin Panel"
- Enter an Application ID
- Select a new status (must follow valid transitions)
- Click "Update Status"

## 🔄 Status Flow

Applications follow this flow:
```
APPLIED → SHORTLISTED → SELECTED
        ↘ REJECTED
```

## 🧪 Testing the Integration

### Test 1: Submit an Application
1. Go to frontend: http://localhost:8000
2. Scroll to "Apply Section"
3. Fill out the form
4. Note the Application ID you receive

### Test 2: Check Status
1. Scroll to "Check Application Status"
2. Enter the Application ID from Test 1
3. You should see your application details

### Test 3: Update Status
1. Go to "Admin Panel"
2. Enter the same Application ID
3. Change status to "SHORTLISTED"
4. Go back to "Check Status" to verify the update

### Test 4: Try Invalid Transition
1. In Admin Panel, try to change "SELECTED" to "APPLIED"
2. You should get an error message

## 📁 Project Structure

```
job-application-system/
├── index.html              # Frontend HTML
├── styles.css              # Frontend CSS with gradients
├── script.js               # Frontend JavaScript
├── README.md              # Frontend documentation
└── backend/
    ├── server.js          # Backend API server
    ├── package.json       # Backend dependencies
    ├── README.md          # Backend documentation
    ├── .gitignore         # Git ignore file
    └── job_applications.db # Database (auto-created)
```

## 🔧 Configuration

### Change Backend Port

Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change here
```

Then update `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:YOUR_NEW_PORT/api';
```

### Change Frontend Port

Use a different port when starting the server:
```bash
python -m http.server 9000  # Uses port 9000
```

## 🐛 Common Issues & Solutions

### Issue 1: Backend won't start
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
cd backend
npm install
```

### Issue 2: Port already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Option 1: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill

# Option 2: Use a different port
PORT=3001 npm start
```

### Issue 3: Frontend can't connect to backend
```
Failed to fetch jobs
```
**Solution:**
1. Make sure backend is running (http://localhost:3000)
2. Check browser console for CORS errors
3. Verify API_BASE_URL in script.js is correct

### Issue 4: Jobs not loading
**Solution:**
1. Open http://localhost:3000/api/jobs in your browser
2. You should see JSON data with jobs
3. If not, restart the backend server

## 🎨 Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --gradient-primary: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR 100%);
}
```

### Add More Jobs
Edit `backend/server.js` in the `initializeDatabase()` function, add to `sampleJobs` array.

### Modify Form Fields
Edit `index.html` to add/remove form fields, then update `backend/server.js` validation.

## 📊 API Testing with cURL

```bash
# Get all jobs
curl http://localhost:3000/api/jobs

# Submit application
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "name": "Test User",
    "email": "test@example.com",
    "resumeLink": "https://example.com/resume"
  }'

# Check status (replace 1 with your application ID)
curl http://localhost:3000/api/applications/1

# Update status
curl -X PATCH http://localhost:3000/api/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "SHORTLISTED"}'
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Note your deployed URL

### Frontend Deployment (Netlify/Vercel)
1. Update `script.js` with your deployed backend URL
2. Drag and drop files (index.html, styles.css, script.js) to Netlify
3. Your site is live!

## 📚 Next Steps

- [ ] Add user authentication
- [ ] Implement email notifications
- [ ] Add file upload for resumes
- [ ] Create admin dashboard
- [ ] Add search and filter functionality
- [ ] Implement pagination
- [ ] Add unit tests

## 💡 Tips for Development

1. **Use Browser DevTools:** Press F12 to see console logs and network requests
2. **Check Backend Logs:** Watch the terminal where backend is running
3. **Test API First:** Use curl or Postman before testing frontend
4. **Clear Browser Cache:** If changes don't appear, clear cache (Ctrl+Shift+R)

## 🎓 Learning Resources

- **Express.js:** https://expressjs.com/
- **SQLite:** https://www.sqlite.org/docs.html
- **REST API Design:** https://restfulapi.net/
- **JavaScript Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 📞 Getting Help

If you're stuck:
1. Check the browser console (F12)
2. Check backend terminal for errors
3. Review the README files in frontend and backend folders
4. Test API endpoints directly with curl
5. Verify all dependencies are installed

## ✅ Checklist

Before submitting your project:
- [ ] Backend starts without errors
- [ ] Frontend loads and displays jobs
- [ ] Can submit an application
- [ ] Can check application status
- [ ] Can update application status
- [ ] Invalid status transitions are rejected
- [ ] Duplicate applications are prevented
- [ ] All form validations work
- [ ] Error messages display correctly
- [ ] Code is clean and commented

## 🎯 Technothon Deliverables

For your Technothon submission:
1. ✅ Public Git repository with all code
2. ✅ README.md explaining how to run (this file!)
3. ✅ API documentation (in backend/README.md)
4. ✅ Sample requests and responses
5. ✅ Business rules implementation
6. ✅ All required endpoints working

---

**🎉 Congratulations!** You now have a complete, working Job Application Management System!

Good luck with your Technothon submission! 🚀