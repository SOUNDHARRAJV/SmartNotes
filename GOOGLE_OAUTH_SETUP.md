# Google OAuth Setup Guide

## Option 1: Create New OAuth Client ID

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Create a new project or select existing project

### Step 2: Enable Google+ API
1. Go to **APIs & Services > Library**
2. Search for "Google+ API" and enable it
3. Or search for "Google Identity" and enable **Google Identity Services API**

### Step 3: Create OAuth 2.0 Client ID
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth 2.0 Client ID**
3. Choose **Web application**
4. Add these **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `http://localhost:3000`
   - Your production domain (when ready)

### Step 4: Update Your Code
Replace the client ID in `src/components/LoginForm.tsx`:
```typescript
const clientId = 'YOUR_NEW_CLIENT_ID_HERE.apps.googleusercontent.com';
```

## Option 2: Use Firebase Authentication (Recommended)

Since you already have Firebase configured, you can use Firebase Auth instead:

### Benefits:
- ✅ No need for separate OAuth setup
- ✅ Already configured in your project
- ✅ Better integration with your existing Firebase setup
- ✅ Automatic domain handling

### Implementation:
1. Firebase Auth handles Google Sign-In automatically
2. No need to manage OAuth client IDs manually
3. Works with your existing Firebase project

## Option 3: Temporary Solution
Keep the current setup but use admin login for development:
- Username: `admin`
- Password: `admin123`

This allows you to test all functionality without Google Sign-In.
