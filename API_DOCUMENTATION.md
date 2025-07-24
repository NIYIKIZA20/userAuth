# User Authentication API Documentation

## Overview
This is a secure Node.js/TypeScript backend API with Google OAuth2 authentication, built with Express.js, PostgreSQL, and Passport.js.

## Base URL
```
http://localhost:3000
```

## Authentication
All protected routes require authentication via Google OAuth2. Users must be logged in to access protected endpoints.

## API Endpoints

### Authentication Routes (`/auth`)

#### `GET /auth/google`
- **Description**: Redirect to Google for authentication
- **Authentication**: None required
- **Response**: Redirects to Google OAuth consent screen

#### `GET /auth/google/callback`
- **Description**: Google OAuth2 callback handler
- **Authentication**: Handled by Google OAuth
- **Response**: Redirects to `/dashboard` on success, `/` on failure

#### `GET /auth/logout`
- **Description**: Logout user and destroy session
- **Authentication**: None required
- **Response**: Redirects to `/`

### User Management Routes (`/users`)

#### `GET /users/profile`
- **Description**: Get current user profile
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://...",
    "googleId": "123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `PUT /users/profile`
- **Description**: Update current user profile
- **Authentication**: Required
- **Request Body**:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "picture": "https://...",
    "googleId": "123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `DELETE /users/profile`
- **Description**: Delete current user account
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /users` (Admin Only)
- **Description**: Get all users with pagination
- **Authentication**: Required (Admin)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
- **Response**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /users/:id`
- **Description**: Get user by ID (Own data or Admin)
- **Authentication**: Required
- **Response**: Same as profile endpoint

#### `DELETE /users/:id` (Admin Only)
- **Description**: Delete user by ID
- **Authentication**: Required (Admin)
- **Response**:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Dashboard Routes (`/dashboard`)

#### `GET /dashboard`
- **Description**: Access user dashboard
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Welcome to your dashboard!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://...",
    "googleId": "123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `422`: Unprocessable Entity (validation failed)
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## Security Features

### Session Management
- Express sessions with secure configuration
- Session blacklisting for logout security
- Session destruction on account deletion

### Input Validation
- Email format validation
- Name length validation (2-100 characters)
- Request sanitization

### Security Middleware
- Helmet.js for security headers
- CORS configuration
- Rate limiting protection
- Global error handling

### Database Security
- PostgreSQL with parameterized queries
- Connection pooling
- Environment variable configuration

## Environment Variables Required

```env
# Database Configuration
PGHOST=localhost
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGPORT=5432

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session Configuration
SESSION_SECRET=your_session_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  picture TEXT,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
