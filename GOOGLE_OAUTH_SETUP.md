# Google OAuth Setup Guide

## Credentials Setup:
- **Client ID:** Get from Google Cloud Console
- **Client Secret:** Get from Google Cloud Console

## Setup Steps:

### 1. Environment Variables

`.env.local` file-এ add করুন:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 2. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback`
   - `http://DESKTOP-GU9BA9Q:3000/api/auth/google/callback` (for your machine)
   - Production URL (when deployed)

6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://DESKTOP-GU9BA9Q:3000`
   - Production URL

### 3. Install Dependencies

```bash
npm install google-auth-library
```

### 4. Usage

#### Login Page:
```
http://localhost:3000/login
```

#### Component Usage:
```tsx
import GoogleLoginButton from '@/components/google-login-button';

<GoogleLoginButton 
  onSuccess={(user, token) => {
    console.log('Logged in:', user);
  }}
  onError={(error) => {
    console.error('Login error:', error);
  }}
/>
```

### 5. API Endpoints

- **GET `/api/auth/google`** - Get OAuth URL
- **POST `/api/auth/google`** - Verify ID Token (Client-side)
- **GET `/api/auth/google/callback`** - OAuth Callback (Server-side flow)

### 6. Test

1. Go to `/login` page
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to dashboard based on role

## Security Notes:

- ✅ Client Secret is server-side only
- ✅ ID Token verification on server
- ✅ JWT token generation
- ✅ HTTP-only cookies
- ⚠️ Never expose Client Secret in client-side code

