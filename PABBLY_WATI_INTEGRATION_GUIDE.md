# Pabbly + WATI Integration Guide for WhatsApp Messaging

## Overview

This integration combines **Pabbly** (workflow automation) with **WATI** (WhatsApp Business API) to send automated WhatsApp messages for your shipment tracking system.

## 🚀 Benefits

- **Workflow Management**: Pabbly handles complex business logic and triggers
- **WhatsApp Delivery**: WATI ensures reliable message delivery
- **Automation**: Automated shipment notifications and status updates
- **Scalability**: Handle multiple workflows and message types
- **Monitoring**: Track message delivery and workflow execution

## 📋 Prerequisites

1. **WATI Account** (already configured in your system)
2. **Pabbly Account** (free tier available)
3. **Environment Variables** configured

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Pabbly Integration Configuration
PABBLY_API_KEY=your_pabbly_api_key_here
PABBLY_WEBHOOK_URL=your_pabbly_webhook_url_here
```

### Step 2: Get Pabbly Credentials

1. **Sign up** at [Pabbly.com](https://pabbly.com)
2. **Create a new workflow** for WhatsApp messaging
3. **Get API Key** from your Pabbly dashboard
4. **Get Webhook URL** from your workflow

### Step 3: Test the Integration

Run the test script:

```bash
node test-pabbly-wati-integration.js YOUR_PHONE_NUMBER
```

## 📱 How to Send Messages

### Method 1: Direct WhatsApp via Pabbly + WATI

```javascript
const PabblyIntegrationService = require('./lib/pabblyIntegrationService');
const pabblyService = new PabblyIntegrationService();

// Send simple WhatsApp message
const result = await pabblyService.sendWhatsAppViaPabblyWati(
  '919876543210',           // Phone number
  'Hello from Pabbly!',     // Message
  'notification_workflow'   // Workflow name
);
```

### Method 2: Shipment Notifications

```javascript
// Send shipment notification
const shipmentResult = await pabblyService.sendShipmentNotificationViaPabbly(
  {
    trackingId: 'SHIP123',
    status: 'In Transit',
    origin: 'Mumbai',
    destination: 'Delhi'
  },
  '919876543210',           // Client phone
  'John Doe',               // Client name
  'creation'                // Notification type
);
```

### Method 3: Custom Workflow Triggers

```javascript
// Trigger custom Pabbly workflow
const workflowResult = await pabblyService.sendMessageViaPabbly({
  workflow: 'custom_workflow',
  action: 'send_whatsapp',
  data: {
    phone: '919876543210',
    message: 'Custom message',
    template: 'custom_template',
    parameters: {
      customer_name: 'John Doe',
      order_id: 'ORD123'
    }
  }
});
```

## 🔄 Workflow Examples

### 1. Shipment Creation Workflow

```javascript
// When new shipment is created
const workflowData = {
  workflow: 'shipment_creation',
  action: 'notify_customer',
  data: {
    shipment: shipmentData,
    customer: customerData,
    notification_type: 'creation'
  }
};

await pabblyService.sendMessageViaPabbly(workflowData);
```

### 2. Status Update Workflow

```javascript
// When shipment status changes
const workflowData = {
  workflow: 'status_update',
  action: 'notify_customer',
  data: {
    shipment: shipmentData,
    old_status: previousStatus,
    new_status: newStatus,
    customer: customerData
  }
};

await pabblyService.sendMessageViaPabbly(workflowData);
```

### 3. Delivery Confirmation Workflow

```javascript
// When shipment is delivered
const workflowData = {
  workflow: 'delivery_confirmation',
  action: 'send_feedback_request',
  data: {
    shipment: shipmentData,
    customer: customerData,
    delivery_date: new Date().toISOString()
  }
};

await pabblyService.sendMessageViaPabbly(workflowData);
```

## 📊 Monitoring and Debugging

### Check Integration Status

```javascript
// Test Pabbly connection
const status = await pabblyService.testPabblyIntegration();
console.log('Pabbly Status:', status.success ? '✅ Working' : '❌ Failed');
```

### Error Handling

```javascript
try {
  const result = await pabblyService.sendWhatsAppViaPabblyWati(phone, message);
  
  if (result.success) {
    console.log('✅ Message sent successfully');
    console.log('Pabbly:', result.pabbly);
    console.log('WATI:', result.wati);
  } else {
    console.log('❌ Failed:', result.error);
  }
} catch (error) {
  console.error('❌ Exception:', error.message);
}
```

## 🎯 Use Cases

### 1. **Automated Shipment Tracking**
- Send tracking updates automatically
- Notify customers of status changes
- Request delivery confirmation

### 2. **Customer Communication**
- Welcome messages for new customers
- Order confirmations
- Delivery notifications
- Feedback requests

### 3. **Business Workflows**
- Inventory alerts
- Payment reminders
- Customer support
- Marketing campaigns

## 🔒 Security Best Practices

1. **Environment Variables**: Never hardcode API keys
2. **Webhook Validation**: Validate incoming webhook requests
3. **Rate Limiting**: Respect API rate limits
4. **Error Logging**: Log all errors for debugging
5. **Access Control**: Restrict access to integration services

## 🚨 Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Check `.env.local` file
   - Verify variable names match exactly

2. **Pabbly API Errors**
   - Verify API key is correct
   - Check webhook URL format
   - Ensure workflow is active

3. **WATI Integration Issues**
   - Verify WATI credentials
   - Check template names
   - Validate phone number format

4. **Message Delivery Failures**
   - Check WATI dashboard for delivery status
   - Verify phone number format
   - Check template approval status

### Debug Commands

```bash
# Test Pabbly connection
node test-pabbly-wati-integration.js

# Test with specific phone number
node test-pabbly-wati-integration.js 919876543210

# Check environment variables
node -e "require('dotenv').config({ path: '.env.local' }); console.log('PABBLY_API_KEY:', process.env.PABBLY_API_KEY ? 'Set' : 'Missing')"
```

## 📈 Next Steps

1. **Set up Pabbly workflows** for your business processes
2. **Configure webhooks** for real-time triggers
3. **Test with real data** from your shipment system
4. **Monitor performance** and optimize workflows
5. **Scale up** to handle more message types

## 🆘 Support

- **Pabbly Documentation**: [docs.pabbly.com](https://docs.pabbly.com)
- **WATI Documentation**: [wati.io/docs](https://wati.io/docs)
- **Integration Issues**: Check error logs and test scripts
- **Workflow Design**: Use Pabbly's visual workflow builder

---

**Happy Automating! 🚀📱**






