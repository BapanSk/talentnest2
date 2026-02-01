# Job Application Management System - Frontend

A modern, responsive frontend interface for managing job applications with beautiful gradient designs and smooth animations.

## 🎨 Features

- **Modern UI Design**: Clean, professional interface with gradient color palettes
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Delightful micro-interactions and transitions
- **Real-time Updates**: Dynamic content loading and status updates
- **Toast Notifications**: User-friendly feedback messages
- **Section Navigation**: Smooth scrolling between different sections

## 📋 Sections

1. **Jobs Section**: Browse all active job openings
2. **Apply Section**: Submit your job application
3. **Status Check**: Track your application status using Application ID
4. **Admin Panel**: Update application statuses (for administrators)

## 🚀 Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge)
- A running backend API (see Backend Setup below)

### Installation

1. **Download the files**:
   - `index.html` - Main HTML structure
   - `styles.css` - Styling and animations
   - `script.js` - JavaScript functionality

2. **Configure API URL**:
   
   Open `script.js` and update the API base URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api'; // Change to your API URL
   ```

3. **Open the application**:
   
   Simply open `index.html` in your web browser, or use a local server:
   
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then navigate to `http://localhost:8000`

## 🔌 Backend Integration

### Required API Endpoints

The frontend expects the following REST API endpoints:

#### 1. List All Active Jobs
```
GET /api/jobs
```
**Response:**
```json
[
  {
    "id": "1",
    "title": "Senior Developer",
    "description": "Job description here",
    "location": "San Francisco, CA",
    "isActive": true
  }
]
```

#### 2. Submit Application
```
POST /api/applications
```
**Request Body:**
```json
{
  "jobId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "resumeLink": "https://drive.google.com/resume"
}
```
**Response:**
```json
{
  "applicationId": "app-123",
  "message": "Application submitted successfully"
}
```

#### 3. Get Application Status
```
GET /api/applications/:applicationId
```
**Response:**
```json
{
  "id": "app-123",
  "candidateName": "John Doe",
  "email": "john@example.com",
  "jobTitle": "Senior Developer",
  "status": "APPLIED",
  "appliedAt": "2026-02-01T10:30:00Z",
  "resumeLink": "https://drive.google.com/resume"
}
```

#### 4. Update Application Status
```
PATCH /api/applications/:applicationId/status
```
**Request Body:**
```json
{
  "status": "SHORTLISTED"
}
```
**Response:**
```json
{
  "message": "Status updated successfully",
  "applicationId": "app-123",
  "newStatus": "SHORTLISTED"
}
```

### Status Flow

Applications follow this status transition flow:
```
APPLIED → SHORTLISTED → SELECTED
        ↘ REJECTED
```

Invalid transitions will be rejected by the backend.

## 🎯 Functionality Overview

### Jobs Section
- Displays all active job positions in a grid layout
- Each job card shows:
  - Job title
  - Description
  - Location
  - "Apply Now" button
- Click "Apply Now" to scroll to the application form with the job pre-selected

### Apply Section
- Form fields:
  - Position selection (dropdown)
  - Full name
  - Email address
  - Resume link (URL)
- Validates all fields before submission
- Shows success message with Application ID
- Prevents duplicate applications for the same job (handled by backend)

### Status Check Section
- Enter your Application ID to check status
- Displays:
  - Current status with color-coded badge
  - Candidate information
  - Job title
  - Application date
  - Resume link
- Real-time status updates

### Admin Panel
- Update application status
- Shows valid status transition flow
- Validates status transitions (backend enforced)
- Provides immediate feedback on updates

## 🎨 Design Features

### Color Palette
- **Primary Gradient**: Purple to violet (#667eea → #764ba2)
- **Secondary Gradient**: Pink to red (#f093fb → #f5576c)
- **Success Gradient**: Blue to cyan (#4facfe → #00f2fe)
- **Accent Gradient**: Pink to yellow (#fa709a → #fee140)

### Typography
- **Display Font**: Playfair Display (for headings)
- **Body Font**: Outfit (for content)

### Animations
- Slide-down header on page load
- Fade-in sections with staggered delays
- Scale-in animations for cards
- Smooth hover effects on buttons and links
- Bounce animation for success states
- Smooth scrolling navigation

## 📱 Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Multi-column grid layout
- **Tablet**: Optimized spacing and layout
- **Mobile**: Single-column layout with touch-friendly controls

## 🧪 Testing Without Backend

If you want to test the UI without a backend, uncomment the demo data section at the bottom of `script.js`:

```javascript
// Uncomment this line:
document.addEventListener('DOMContentLoaded', loadDemoJobs);
```

This will load sample job data for UI testing.

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --color-primary: #667eea;
    /* Add more customizations */
}
```

### Modifying API Endpoints
Update the endpoint URLs in `script.js` if your backend uses different routes.

## 📝 Business Rules Implemented

1. ✅ Form validation for all required fields
2. ✅ Email format validation
3. ✅ URL format validation for resume links
4. ✅ Status transition flow visualization
5. ✅ Error handling and user feedback
6. ✅ Loading states for async operations
7. ✅ Duplicate application prevention (backend)
8. ✅ Invalid status transition prevention (backend)

## 🐛 Troubleshooting

### Jobs Not Loading
- Check if backend is running at the configured URL
- Open browser console (F12) to see error messages
- Verify CORS is enabled on your backend

### Application Submission Fails
- Ensure all form fields are filled correctly
- Check backend logs for validation errors
- Verify the API endpoint is correct

### Status Not Found
- Double-check the Application ID
- Ensure the application exists in the database
- Check backend logs for errors

## 📄 File Structure

```
job-application-frontend/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## 🌟 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify backend API is running
- Ensure API URL is correctly configured
- Review the API response format

## 🎓 Credits

Built for Technothon - Job Application Management System Task

---

**Note**: Make sure your backend API supports CORS if the frontend and backend are on different domains/ports.