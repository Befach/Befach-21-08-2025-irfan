# 📱 WhatsApp Integration Setup Guide

This guide explains how to set up WhatsApp notifications for shipment status updates using the WATI API.

## Overview

The shipment tracker now sends WhatsApp notifications to clients whenever:
1. A new shipment is created
2. A shipment status is updated

## WATI API Setup

### 1. Create WATI Account
1. **Sign up** at [WATI.io](https://wati.io)
2. **Verify your email** and complete account setup
3. **Choose a plan** (they have free tiers available)

### 2. WhatsApp Business API Setup
1. **Connect WhatsApp Business**:
   - Go to your WATI dashboard
   - Navigate to "WhatsApp Business API"
   - Follow the setup wizard to connect your WhatsApp Business number
   - Scan the QR code with your WhatsApp Business app

2. **Get API Credentials**:
   - Go to "API Settings" in your WATI dashboard
   - Copy your **API Key**
   - Copy your **Instance ID**

### 3. WATI Templates Setup
1. **Create Templates** (Recommended):
   - Go to "Templates" in your WATI dashboard
   - Click "Create Template"
   - Choose template type (Text, Media, Interactive)
   - Design your template with variables

2. **Recommended Template Names**:
   - `shipment_created` - For new shipment notifications
   - `shipment_status_update` - For status change notifications

3. **Template Variables** (use these in your templates):
   - `{{1}}` - Client Name
   - `{{2}}` - Tracking ID
   - `{{3}}` - Shipment Name
   - `{{4}}` - Origin Country
   - `{{5}}` - Destination Country
   - `{{6}}` - Estimated Delivery
   - `{{7}}` - Tracking URL
   - `{{8}}` - Previous Status (for updates)
   - `{{9}}` - New Status (for updates)

### 4. Environment Variables
Add these variables to your `.env.local` file:

```bash
# WATI API Configuration
WATI_API_KEY=your_wati_api_key_here
WATI_INSTANCE_ID=your_wati_instance_id_here

# Application URL (if not already set)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Setup

Run the following SQL script in your Supabase SQL editor:

```sql
-- Add client_phone column to shipments table
ALTER TABLE shipments ADD COLUMN client_phone VARCHAR(20);

-- Add a comment to document the column
COMMENT ON COLUMN shipments.client_phone IS 'Client phone number for sending WhatsApp notifications';

-- Create an index on client_phone for better query performance
CREATE INDEX idx_shipments_client_phone ON shipments(client_phone);

-- Add a check constraint to ensure phone format (optional)
ALTER TABLE shipments 
ADD CONSTRAINT check_client_phone_format 
CHECK (client_phone ~* '^\+?[\d\s\-\(\)]+$');
```

## Features Added

### 1. Phone Number Field
- Added `client_phone` field to shipment forms
- Optional field for WhatsApp notifications
- Automatic phone number formatting
- Validation for proper phone number format

### 2. WhatsApp Notifications
- **Shipment Creation**: When a new shipment is created
- **Status Updates**: When shipment status changes
- **Rich Messages**: Include emojis, formatting, and tracking links

### 3. Message Templates
- **WATI Templates** (Recommended): Uses pre-built templates from WATI dashboard
- **Custom Messages** (Fallback): Custom formatted messages if templates not found
- Professional message formatting
- Include tracking ID and shipment details
- Direct link to tracking page
- Status change notifications

### 4. Template System
The system automatically tries to use WATI templates first, then falls back to custom messages:

1. **Template Priority**:
   - `shipment_created` - For new shipment notifications
   - `shipment_status_update` - For status change notifications

2. **Template Variables**:
   - `{{1}}` - Client Name
   - `{{2}}` - Tracking ID
   - `{{3}}` - Shipment Name
   - `{{4}}` - Origin Country
   - `{{5}}` - Destination Country
   - `{{6}}` - Estimated Delivery
   - `{{7}}` - Tracking URL
   - `{{8}}` - Previous Status (for updates)
   - `{{9}}` - New Status (for updates)

## Testing Your Setup

### 1. List WATI Templates
```bash
npm run wati:templates list
```

### 2. Test WhatsApp Integration
```bash
npm run test:whatsapp
```

### 3. Test Specific Template
```bash
npm run wati:templates test shipment_created +919876543210
```

### 4. Manual Testing
1. **Start your application**:
   ```bash
   npm run dev
   ```

2. **Create a test shipment**:
   - Go to `/admin/shipments/new`
   - Fill in all required fields
   - Add a phone number in the "Client Phone Number" field
   - Submit the form

3. **Update shipment status**:
   - Go to `/admin/shipments/[id]/edit`
   - Change the status
   - Save the changes

## Phone Number Format

The system automatically formats phone numbers:
- `9876543210` → `919876543210`
- `+919876543210` → `919876543210`
- `09876543210` → `919876543210`

**Note**: Currently configured for India (+91). Modify the `formatPhoneNumber` function in `lib/watiWhatsAppService.js` for other countries.

## Message Examples

### Shipment Creation Message
```
🚚 New Shipment Created

Dear John Doe,

Your shipment has been successfully created and is now being processed.

Shipment Details:
📦 Tracking ID: BEF-20241201-12345
📋 Shipment Name: Electronics Package
🌍 Origin: India
🎯 Destination: USA
📅 Estimated Delivery: 2024-12-15

Track Your Shipment:
http://localhost:3000/track?tracking_id=BEF-20241201-12345

We'll keep you updated on your shipment's progress. Thank you for choosing our services!

Best regards,
Befach Logistics Team
```

### Status Update Message
```
📦 Shipment Status Update

Dear John Doe,

Your shipment status has been updated!

Shipment Details:
📦 Tracking ID: BEF-20241201-12345
📋 Shipment Name: Electronics Package

Status Change:
🔄 From: In Transit
✅ To: Out for Delivery

🌍 Origin: India
🎯 Destination: USA
📅 Estimated Delivery: 2024-12-15

Track Your Shipment:
http://localhost:3000/track?tracking_id=BEF-20241201-12345

We'll continue to keep you updated on your shipment's progress.

Best regards,
Befach Logistics Team
```

## Troubleshooting

### Common Issues

#### 1. "Missing WATI_API_KEY" Error
**Solution**: Ensure your environment variables are set correctly in `.env.local`

#### 2. "Invalid phone number format" Error
**Solution**: 
- Use international format: `+919876543210`
- Include country code
- Remove spaces and special characters

#### 3. "API request failed" Error
**Solutions**:
- Verify your WATI API key and instance ID
- Check if your WhatsApp Business is connected
- Ensure you have sufficient credits in your WATI account
- Check WATI API documentation for rate limits

#### 4. Messages not being delivered
**Solutions**:
- Verify the phone number is correct
- Ensure the recipient has WhatsApp installed
- Check if the recipient has blocked your business number
- Verify your WATI instance is active and connected

### Testing Commands
```bash
# Test WhatsApp configuration
npm run test:whatsapp

# Check environment variables
echo $WATI_API_KEY
echo $WATI_INSTANCE_ID
```

## API Endpoints

### Send WhatsApp Message
- **URL**: `/api/send-whatsapp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "whatsappType": "shipment-creation" | "status-update",
    "phone": "+919876543210",
    "clientName": "John Doe",
    "shipmentData": {...},
    "previousStatus": "In Transit", // for status updates
    "newStatus": "Out for Delivery" // for status updates
  }
  ```

## Security Notes

1. **API Key Security**: Never commit your WATI API key to version control
2. **Phone Validation**: Always validate phone numbers before sending
3. **Rate Limiting**: Respect WATI's rate limits to avoid account suspension
4. **Message Content**: Ensure messages comply with WhatsApp Business policies

## Support

- **WATI Documentation**: [https://wati.io/docs](https://wati.io/docs)
- **WhatsApp Business API**: [https://developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- **Project Issues**: Create an issue in the project repository

## Next Steps

1. ✅ Set up WATI account and get API credentials
2. ✅ Add environment variables
3. ✅ Run database migration
4. ✅ Test the integration
5. ✅ Deploy to production
6. ✅ Monitor message delivery rates
7. ✅ Optimize message templates based on user feedback
