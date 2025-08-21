# Email Notifications for Shipment Tracking

This document describes the new email notification functionality that has been added to the shipment tracking system.

## Features Added

### 1. Unique Tracking ID Generation
- Every new shipment now gets a unique tracking ID automatically generated
- Format: `BEF-YYYYMMDD-XXXXX` (e.g., `BEF-20241201-12345`)
- The tracking ID is generated when the shipment creation form loads
- Tracking IDs are read-only and cannot be manually edited

### 2. Client Email Field
- Added `client_email` field to shipment forms
- Required field for all new shipments
- Used for sending email notifications to clients
- Email format is validated before sending notifications

### 3. Email Notifications via Zoho Flow
- Integration with Zoho Flow webhook for email automation
- Notifications are sent for:
  - **Shipment Creation**: When a new shipment is created
  - **Stage Changes**: When the shipment status/stage is updated
  - **General Updates**: When other shipment details are modified

## Database Changes

### New Column
- Added `client_email` column to the `shipments` table
- Type: `VARCHAR(255)`
- Indexed for better query performance
- Email format validation constraint

### SQL Script
Run the following SQL script in your Supabase SQL editor:
```sql
-- Add client_email column to shipments table
ALTER TABLE shipments ADD COLUMN client_email VARCHAR(255);

-- Add a comment to document the column
COMMENT ON COLUMN shipments.client_email IS 'Client email address for sending tracking notifications';

-- Create an index on client_email for better query performance
CREATE INDEX idx_shipments_client_email ON shipments(client_email);

-- Add a check constraint to ensure email format (optional)
ALTER TABLE shipments 
ADD CONSTRAINT check_client_email_format 
CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

## Email Notification Data

The system sends the following data to Zoho Flow webhook:

### Shipment Creation Event
```json
{
  "event_type": "shipment_created",
  "tracking_id": "BEF-20241201-12345",
  "client_email": "client@example.com",
  "shipment_name": "Electronics Shipment",
  "current_stage": "Product Insurance",
  "origin_country": "China",
  "destination_country": "India",
  "estimated_delivery": "2024-12-15",
  "notes": "Special handling required",
  "timestamp": "2024-12-01T10:30:00Z",
  "source": "Befach Shipment Tracker"
}
```

### Stage Change Event
```json
{
  "event_type": "stage_changed",
  "tracking_id": "BEF-20241201-12345",
  "client_email": "client@example.com",
  "shipment_name": "Electronics Shipment",
  "current_stage": "In Transit to India",
  "previous_stage": "Pickup at Origin",
  "origin_country": "China",
  "destination_country": "India",
  "estimated_delivery": "2024-12-15",
  "notes": "Shipment picked up successfully",
  "timestamp": "2024-12-01T10:30:00Z",
  "source": "Befach Shipment Tracker"
}
```

## Zoho Flow Configuration

### Webhook URL
```
https://flow.zoho.in/60033586716/flow/webhook/incoming?zapikey=1001.a51d4e573e71e6f3e1751dce2e27a291.66d442cca19d1b7de69a453368f0c022&isdebug=false
```

### Setup Instructions
1. In Zoho Flow, create a new flow triggered by webhook
2. Use the webhook URL above as the trigger
3. Configure email actions based on the event_type:
   - `shipment_created`: Send welcome email with tracking details
   - `stage_changed`: Send status update email
   - `shipment_updated`: Send general update notification

### Email Template Variables
- `{{tracking_id}}`: The unique tracking ID
- `{{client_email}}`: Client's email address
- `{{shipment_name}}`: Name of the shipment
- `{{current_stage}}`: Current shipment stage
- `{{previous_stage}}`: Previous shipment stage (for stage changes)
- `{{origin_country}}`: Origin country
- `{{destination_country}}`: Destination country
- `{{estimated_delivery}}`: Estimated delivery date
- `{{notes}}`: Additional notes

## Error Handling

- Email notifications are sent asynchronously
- If email sending fails, it doesn't affect shipment creation/updates
- All email errors are logged to the console for debugging
- The system continues to function even if Zoho Flow is temporarily unavailable

## Files Modified

1. **`lib/utils.ts`** - New utility functions for tracking ID generation and email notifications
2. **`lib/types.ts`** - Updated Shipment interface to include client_email
3. **`pages/admin/shipments/new.tsx`** - Added client email field and automatic tracking ID generation
4. **`pages/admin/shipments/[id]/edit.tsx`** - Added client email field and stage change notifications
5. **`add-client-email-column.sql`** - Database migration script

## Testing

To test the functionality:

1. Run the SQL script to add the client_email column
2. Create a new shipment with a valid email address
3. Check that the tracking ID is auto-generated
4. Verify that the email notification is sent to Zoho Flow
5. Update the shipment status and verify stage change notifications

## Security Notes

- Email addresses are validated before sending notifications
- The webhook URL contains an API key - keep it secure
- All email data is sent over HTTPS
- No sensitive shipment data is included in email notifications 