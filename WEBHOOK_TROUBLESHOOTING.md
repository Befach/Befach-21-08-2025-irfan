# Webhook Troubleshooting Guide

## 🚨 Current Issue: CORS Error Fixed

The main issue was a **CORS (Cross-Origin Resource Sharing) error** when trying to send webhooks directly from the browser to Zoho Flow. This has been fixed by:

1. **Created server-side API route** (`/api/webhook/zoho-flow.ts`)
2. **Updated utility function** to call the server-side API instead of Zoho Flow directly
3. **Added test endpoints** to verify webhook functionality

## 🔧 How to Test the Webhook Integration

### Step 1: Test the Webhook
1. Navigate to `/admin/test-webhook` in your application
2. Click "Test Webhook" button
3. Check the result and browser console for logs

### Step 2: Check Zoho Flow Dashboard
1. Go to your Zoho Flow dashboard
2. Look for incoming webhook data in the flow history
3. Check if the webhook is being received

### Step 3: Test Email Notifications
1. Create a new shipment with a valid email address
2. Check if the client receives an email
3. Update shipment status and check for stage change emails

## 📊 Debugging Steps

### 1. Check Browser Console
Look for these log messages:
```
✅ "Sending webhook to Zoho Flow: {url: '/api/webhook/zoho-flow', payload: {...}}"
✅ "Zoho Flow notification sent successfully: {...}"
❌ "Error sending Zoho Flow notification: ..."
```

### 2. Check Server Logs
In your terminal/console where Next.js is running, look for:
```
✅ "Sending webhook to Zoho Flow from server: {url: '...', payload: {...}}"
✅ "Zoho Flow webhook sent successfully: {...}"
❌ "Error sending webhook to Zoho Flow: ..."
```

### 3. Check Zoho Flow Response
The server logs will show the exact response from Zoho Flow:
```
"Zoho Flow webhook error: {status: 200, statusText: 'OK', data: {...}}"
```

## 🔍 Common Issues and Solutions

### Issue 1: "Failed to fetch" Error
**Cause**: CORS error (now fixed with server-side API)
**Solution**: ✅ Fixed - webhook calls now go through server-side API

### Issue 2: "HTTP error! status: 400/401/403"
**Cause**: Invalid webhook URL or API key
**Solutions**:
- Verify the webhook URL is correct
- Check if the API key is valid
- Ensure the webhook is active in Zoho Flow

### Issue 3: "HTTP error! status: 500"
**Cause**: Zoho Flow server error
**Solutions**:
- Check Zoho Flow service status
- Verify webhook configuration in Zoho Flow
- Check if the payload format is correct

### Issue 4: No emails received
**Cause**: Email templates not configured in Zoho Flow
**Solutions**:
- Set up email actions in Zoho Flow
- Configure email templates with proper variables
- Test email delivery settings

## 🛠️ Zoho Flow Configuration Checklist

### Webhook Setup
- [ ] Webhook URL is correct
- [ ] API key is valid
- [ ] Webhook is active/enabled
- [ ] Payload format is set to JSON
- [ ] Method is set to POST

### Email Action Setup
- [ ] Email action is added to the flow
- [ ] Email templates are configured
- [ ] Recipient email is mapped correctly
- [ ] Subject and body use proper variables
- [ ] Email delivery is tested

### Variables Available in Zoho Flow
```
{{event_type}} - "shipment_created" or "stage_changed"
{{tracking_id}} - The unique tracking ID
{{client_email}} - Client's email address
{{shipment_name}} - Name of the shipment
{{current_stage}} - Current shipment stage
{{previous_stage}} - Previous stage (for stage changes)
{{origin_country}} - Origin country
{{destination_country}} - Destination country
{{estimated_delivery}} - Estimated delivery date
{{notes}} - Additional notes
{{timestamp}} - When the event occurred
{{source}} - "Befach Shipment Tracker"
```

## 📝 Test Data Structure

When you test the webhook, it sends this data:

```json
{
  "event_type": "shipment_created",
  "tracking_id": "BEF-TEST-12345",
  "client_email": "test@example.com",
  "shipment_name": "Test Shipment",
  "current_stage": "Product Insurance",
  "origin_country": "Test Origin",
  "destination_country": "Test Destination",
  "estimated_delivery": "2024-12-15",
  "notes": "This is a test webhook",
  "timestamp": "2024-12-01T10:30:00Z",
  "source": "Befach Shipment Tracker - Test"
}
```

## 🔄 Testing Workflow

1. **Start with test page**: `/admin/test-webhook`
2. **Check server logs** for webhook delivery
3. **Verify Zoho Flow** receives the data
4. **Test email delivery** with a real email address
5. **Create real shipment** to test full workflow
6. **Update shipment status** to test stage change notifications

## 📞 Support

If you're still having issues:

1. **Check all logs** (browser console + server logs)
2. **Verify Zoho Flow configuration**
3. **Test with the test page first**
4. **Ensure email templates are set up correctly**

The server-side API approach should resolve the CORS issues you were experiencing. The webhook calls will now go through your Next.js server, which can make external HTTP requests without CORS restrictions. 