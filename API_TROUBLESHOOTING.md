# API Route Troubleshooting Guide

## 🚨 Issue: 404 Error on API Routes

The error `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` with a 404 status means that the API route is not being found by Next.js.

## ✅ Solution Steps

### 1. **Restart Your Development Server**
The most common cause is that Next.js hasn't picked up the new API route files.

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

### 2. **Test the Health Endpoint First**
I've added a health check endpoint to verify API routes are working:

1. Go to `/admin/test-webhook`
2. Click **"Test Health"** button first
3. This should return: `{"status":"ok","message":"API is working","timestamp":"..."}`

### 3. **Check File Structure**
Make sure these files exist in the correct locations:

```
pages/
├── api/
│   ├── health.ts                    ✅ Health check endpoint
│   ├── test-webhook.ts             ✅ Webhook test endpoint
│   └── webhook/
│       └── zoho-flow.ts            ✅ Main webhook endpoint
└── admin/
    └── test-webhook.tsx            ✅ Test page
```

### 4. **Verify API Routes in Build**
The build output shows these API routes are recognized:
- `ƒ /api/health` - Dynamic API route
- `ƒ /api/test-webhook` - Dynamic API route  
- `ƒ /api/webhook/zoho-flow` - Dynamic API route

## 🔧 Testing Workflow

### Step 1: Test Health Endpoint
1. Navigate to `/admin/test-webhook`
2. Click **"Test Health"** button
3. Should see: `{"status":"ok","message":"API is working"}`

### Step 2: Test Webhook Endpoint
1. If health test passes, click **"Test Webhook"** button
2. Should see webhook test results
3. Check browser console for detailed logs

### Step 3: Check Server Logs
In your terminal where Next.js is running, look for:
```
✅ "Testing webhook with data: {...}"
✅ "Webhook test response: {...}"
```

## 🚨 Common Issues

### Issue 1: Still Getting 404
**Solution**: Restart your development server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue 2: Health Test Fails
**Solution**: Check if Next.js is running properly
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Issue 3: Webhook Test Fails
**Solution**: Check Zoho Flow configuration
- Verify webhook URL is correct
- Check if API key is valid
- Ensure webhook is active in Zoho Flow

## 📊 Debug Information

### Browser Console Logs
Look for these messages:
```
✅ "Testing health endpoint..."
✅ "Health check result: {...}"
✅ "Testing webhook endpoint..."
✅ "Webhook response status: 200"
```

### Server Console Logs
Look for these messages:
```
✅ "Testing webhook with data: {...}"
✅ "Webhook test response: {...}"
```

## 🔄 Next Steps

1. **Restart your development server**
2. **Test the health endpoint first**
3. **If health passes, test the webhook**
4. **Check all console logs for errors**

The API routes are properly configured and the build shows they're being recognized. The issue is likely that your development server needs to be restarted to pick up the new files. 