# Shipment Status WhatsApp

This feature allows you to send shipment status updates directly via WhatsApp without requiring full shipment data.

## Features

- ✅ Send simple status updates via WhatsApp
- 📱 Uses WATI API for reliable delivery
- 🎯 Focused on just status information
- 📦 Includes tracking ID and current status
- 🔗 Provides tracking link for customers

## How to Use

### 1. Web Form (test-simple-form.html)

Open `test-simple-form.html` in your browser to test the functionality:

1. Enter the phone number
2. Enter the tracking ID
3. Select or enter a custom status
4. Click "Send Status WhatsApp"

### 2. API Endpoint

Send a POST request to `/api/send-whatsapp`:

```json
{
  "whatsappType": "status-only",
  "phone": "+919182992530",
  "trackingId": "TEST-123",
  "status": "In Transit"
}
```

### 3. Node.js Script

Run the test script:

```bash
node test-status-whatsapp.js
```

## API Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `whatsappType` | string | Yes | Must be "status-only" |
| `phone` | string | Yes | Phone number with country code |
| `trackingId` | string | Yes | Shipment tracking ID |
| `status` | string | Yes | Current shipment status |

## Message Format

The WhatsApp message will include:

- 📦 Shipment Status Update header
- 📦 Tracking ID
- ✅ Current Status
- 🔗 Tracking link
- Company branding

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
WATI_API_KEY=your_wati_api_key
WATI_INSTANCE_ID=your_wati_instance_id
NEXT_PUBLIC_BASE_URL=your_tracking_url_base
```

## Example Response

```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "whatsappType": "status-only",
  "recipient": "+919182992530"
}
```

## Error Handling

The API will return appropriate error messages for:
- Missing required parameters
- Invalid phone number format
- WATI API errors
- Server errors

## Testing

1. Start your Next.js server: `npm run dev`
2. Open `test-simple-form.html` in your browser
3. Fill in the form and test sending status updates
4. Check the console for detailed logs

## Troubleshooting

- Ensure WATI API credentials are correct
- Check phone number format (should include country code)
- Verify the tracking URL base is set correctly
- Check server logs for detailed error information









