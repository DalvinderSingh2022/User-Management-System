# User Management System with Admin Panel

A comprehensive user management system with authentication, profile management, and notification features.

## Features

**User Functionality**

- Secure JWT authentication
- Profile management (name, mobile, bio, availability)
- Notification system with availability-based delivery
- View sent/received notifications

**Admin Functionality**

- Send critical/non-critical notifications

## Technologies

**Backend**

- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcrypt
- Node Cron

**Frontend**

- React.js
- Tailwind CSS
- React Router
- React Icons

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DalvinderSingh2022/user-management-system.git
   cd user-management-system
   ```

2. Backend setup:

   ```bash
   cd server
   npm install
   # Update .env with your values
   npm start
   ```

3. Frontend setup:
   ```bash
   cd client
   npm install
   npm start
   ```

## API Documentation

### Header Requirement

All endpoints except authentication routes require the `x-auth-token` header:

```http
x-auth-token: <JWT_TOKEN>
```

### Token Handling

After successful login, store the response in localStorage:

```javascript
// Login response
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "userId": "65c3a8b1f1a2d4e5f6g7h8i",
    "isAdmin": false
  }
}

// Store in localStorage
localStorage.setItem('toekn', JSON.stringify(response.data.token));
```

### Making Authenticated Requests

```javascript
// Get token from localStorage
const token = JSON.parse(localStorage.getItem("token"));

// Set headers for API calls
axios.get("/api/", {
  headers: {
    "x-auth-token": token,
  },
});
```

````
### Authentication

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
````

Response:

```json
{
  "message": "User  registered successfully"
}
```

**POST /api/auth/login**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "userId": "65c3a8b1f1a2d4e5f6g7h8i",
    "isAdmin": false
  }
}
```

### User Endpoints

**GET /api/user/:userId**  
_Get user profile_  
Response:

```json
{
  "message": "Profile fetched successfully",
  "data": {
    "_id": "65c3a8b1f1a2d4e5f6g7h8i",
    "name": "John Doe",
    "email": "john@example.com",
    "availability": { "start": "09:00", "end": "17:00" },
    "bio": "bio",
    "mobileNumber": 1234567890,
    "isAdmin": false
  }
}
```

**GET /api/user**  
_Get all users_  
Response:

```json
{
   "message": "Users fetched successfully",
   "data": [{
       "_id": "65c3a8b1f1a2d4e5f6g7h8i",
       "name": "John Doe",
       "isAdmin": false
       ...
  },
  ...
]
```

**PUT /api/user/profile**  
_Update user profile_  
Request Body:

```json
{
  "message": "Profile updated successfully",
  "data": {
    "name": "John Doe",
    "availability": { "start": "09:00", "end": "17:00" },
    "bio": "bio",
    "mobileNumber": 1234567890
  }
}
```

Response:

```json
{
  "message": "Profile updated successfully",
  "data": {
    "_id": "65c3a8b1f1a2d4e5f6g7h8i",
    "name": "John Doe",
    "email": "john@example.com"
    ...
  }
}
```

### Notification Endpoints

**POST /api/notification**  
_Send notification_  
Request Body:

```json
{
  "recipients": ["65c3a8b1f1a2d4e5f6g7h8i", "65jhf8b1f1a2d4e5f6g7h8i"],
  "message": "System Update",
  "isCritical": true
}
```

Response:

```json
{
  "message": "Notification sent successfully",
  "data": {
    "_id": "6sqc3a8b1f1a2d4e5f6g7h8i",
    "status": "delivered",
    "sentAt": "2024-02-20T12:00:00Z",
    "sender": "65c3a8b1f1a2d4e5f6g7h8i",
    ...
  }
}
```

**GET /api/notification/recipient**  
_Get recipient notifications_  
Response:

```json
{
   "message": "Notifications fetched successfully",
   "data":[{
       "message": "Meeting Reminder",
       "sender": {
            "_id": "65c3a8b1f1a2d4e5f6g7h8i",
            "name": "admin"
       },
       "status": "delivered",
       ...
     },
   ...
]
```

**GET /api/notification/sent**  
_Get sent notifications_  
Response:

```json
{
   "message": "Notifications fetched successfully",
   "data":[{
          "message": "Status Update",
          "status": "queued",
          "sender": {
               "_id": "65c3a8b1f1a2d4e5f6g7h8i",
               "name": "admin"
          }
          ...
   },
   ...
]
```

## Frontend Components

1. **Authentication**

   - Login/Signup pages with form validation
   - JWT token handling

2. **Dashboard**

   - User/Admin overview
   - Quick access to create notifications
   - User cards with profile links

3. **Profile Management**

   - Edit personal information
   - Set availability time slots
   - Admin badge display

4. **Notifications**
   - Create notifications with recipient selection
   - Critical notification toggle
   - Sent/Received notifications tabs

## Environment Variables

`.env` Example:

```ini
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/user-management
PORT=5000
```

## Deployment

1. **Backend**:  
   Host on Render with MongoDB Atlas.

2. **Frontend**:  
   Deploy to Netlify with environment variables:
   ```ini
   VITE_API_URL=https://your-backend-url.com
   ```
