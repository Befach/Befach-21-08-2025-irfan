# WhatsApp Integration with Shipment Service

## Overview

The shipment service has been updated to send both email and WhatsApp notifications when shipments are created or updated. This provides customers with multiple communication channels for tracking their shipments.

## Features

- ✅ **Dual Notifications**: Both email and WhatsApp messages are sent simultaneously
- ✅ **Automatic Phone Formatting**: Phone numbers are automatically formatted for WATI API
- ✅ **Graceful Fallback**: WhatsApp notifications are skipped if no phone number is available
- ✅ **Parallel Processing**: Both notifications are sent in parallel for better performance
- ✅ **Error Handling**: Failed notifications don't block the shipment process

## Setup

### 1. Environment Variables

Add these environment variables to your `.env` file:

```bash
# WATI WhatsApp API Configuration
WATI_API_KEY=your_wati_api_key_here
WATI_INSTANCE_ID=your_wati_instance_id_here
WATI_BASE_URL=https://api.wati.io

# Base URL for tracking links
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. Database Schema Update

Make sure your shipments table includes a `client_phone` column:

```sql
ALTER TABLE shipments ADD COLUMN client_phone VARCHAR(20);
```

## Usage

### Basic Shipment Creation

```typescript
import { ShipmentService } from './shipment';
import { EmailService } from './mailer';

const emailService = new EmailService();
const shipmentService = new ShipmentService(emailService);

// Create shipment with phone number
const shipmentData = {
  tracking_id: 'BEF-2024-001',
  status: 'In Transit',
  origin_city: 'Mumbai',
  origin_country: 'India',
  destination_city: 'New York',
  destination_country: 'USA',
  transport_mode: 'Air Freight',
  client_email: 'customer@example.com',
  client_phone: '919876543210' // WhatsApp number
};

const shipment = await shipmentService.createShipment(shipmentData);
// This will send both email and WhatsApp notifications
```

### Status Updates

```typescript
// Update shipment status
const updatedShipment = await shipmentService.updateShipmentStatus(
  'BEF-2024-001',
  'Out for Delivery',
  { city: 'New York', country: 'USA' }
);
// This will send both email and WhatsApp status update notifications
```

## WhatsApp Message Format

### Shipment Creation Message

```
📦 New Shipment Created: BEF-2024-001

🏷️ Tracking ID: BEF-2024-001
🚚 Status: In Transit
🌍 Origin: Mumbai, India
🏁 Destination: New York, USA
🕒 Created: 12/20/2024, 10:30:00 AM

Track your shipment: https://yourdomain.com/track?tracking_id=BEF-2024-001

Best regards,
Befach Logistics Team
```

### Status Update Message

```
🚚 Shipment Status Update: BEF-2024-001

🏷️ Tracking ID: BEF-2024-001
🚚 Previous Status: In Transit
🚚 New Status: Out for Delivery
🕒 Updated: 12/20/2024, 2:30:00 PM

Track your shipment: https://yourdomain.com/track?tracking_id=BEF-2024-001

Best regards,
Befach Logistics Team
```

## Phone Number Formatting

The service automatically formats phone numbers for the WATI API:

- **Input**: `+91-98765-43210` or `09876543210` or `919876543210`
- **Output**: `919876543210` (country code + number)

### Supported Formats

- `+91-98765-43210` → `919876543210`
- `09876543210` → `919876543210`
- `919876543210` → `919876543210` (unchanged)
- `9876543210` → `919876543210` (assumes India +91)

## Testing

Run the test script to verify WhatsApp integration:

```bash
# From the src directory
npx ts-node test-shipment-with-whatsapp.ts
```

Or import and use in your tests:

```typescript
import { testShipmentWithWhatsApp } from './test-shipment-with-whatsapp';

// Run tests
await testShipmentWithWhatsApp();
```

## Error Handling

### WhatsApp Service Errors

- **Missing API Credentials**: Logs error, continues with email only
- **Invalid Phone Number**: Logs warning, skips WhatsApp notification
- **API Failures**: Logs error, continues with email only

### Fallback Behavior

If WhatsApp notifications fail:
1. ✅ Email notifications continue to work
2. ✅ Shipment operations complete successfully
3. ⚠️ WhatsApp errors are logged but don't block the process

## Configuration Options

### Customizing Messages

Edit the `src/whatsapp.ts` file to customize message formats:

```typescript
private generateCreationMessage(shipment: ShipmentData): string {
  // Customize your message format here
  return `Your custom message for ${shipment.tracking_id}`;
}
```

### Adding New Notification Types

To add new notification types (e.g., delivery confirmation):

1. Add method to `WhatsAppService` class
2. Add method to `ShipmentService` class
3. Call from appropriate shipment operations

## Troubleshooting

### Common Issues

1. **WhatsApp not sending**: Check `WATI_API_KEY` and `WATI_INSTANCE_ID`
2. **Phone format errors**: Verify phone number includes country code
3. **Missing notifications**: Check console logs for error messages

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG_WHATSAPP=true
```

## Performance Considerations

- **Parallel Processing**: Both email and WhatsApp are sent simultaneously
- **Async Operations**: Notifications don't block shipment operations
- **Error Isolation**: WhatsApp failures don't affect email delivery

## Security Notes

- Phone numbers are validated before sending
- API keys are stored in environment variables
- No sensitive data is logged in production

## Future Enhancements

- [ ] Template-based WhatsApp messages
- [ ] Rich media support (images, documents)
- [ ] Delivery receipts and status tracking
- [ ] Multi-language support
- [ ] Scheduled notifications

## Support

For issues with WhatsApp integration:
1. Check environment variables
2. Verify WATI API credentials
3. Review console logs for errors
4. Test with the provided test script




