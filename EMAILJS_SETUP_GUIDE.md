# EmailJS Setup Guide

This guide will walk you through setting up EmailJS to send emails from your shipment tracker application.

## What is EmailJS?

EmailJS is a free service that allows you to send emails directly from JavaScript without setting up a server. It's perfect for client-side applications like this shipment tracker.

## Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**
4. Follow the authentication steps for your chosen provider
5. Give your service a name (e.g., "Befach Logistics")
6. Copy the **Service ID** (you'll need this later)

### 3. Create Email Templates

#### Template 1: Shipment Creation Email

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Name it "Shipment Creation"
4. Set the subject: `New Shipment Created - {{tracking_id}}`
5. Use this HTML content:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Shipment Created</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .shipment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .tracking-button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 New Shipment Created</h1>
        </div>
        
        <div class="content">
            <p>Dear Valued Customer,</p>
            
            <p>Your shipment has been successfully created and is now being processed. Here are the details:</p>
            
            <div class="shipment-details">
                <h3>Shipment Details</h3>
                <p><strong>Tracking ID:</strong> {{tracking_id}}</p>
                <p><strong>Current Status:</strong> {{current_status}}</p>
                <p><strong>Origin:</strong> {{origin}}</p>
                <p><strong>Destination:</strong> {{destination}}</p>
                <p><strong>Current Location:</strong> {{current_location}}</p>
                <p><strong>Transport Mode:</strong> {{transport_mode}}</p>
                {{#if estimated_delivery}}<p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>{{/if}}
                {{#if shipment_notes}}<p><strong>Notes:</strong> {{shipment_notes}}</p>{{/if}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{tracking_url}}" class="tracking-button">Track Your Shipment</a>
            </div>
            
            <p>You will receive email notifications whenever your shipment status is updated.</p>
            
            <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Befach Logistics Team</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>© 2024 Befach Logistics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

6. Save the template and copy the **Template ID**

#### Template 2: Status Update Email

1. Create another new template
2. Name it "Status Update"
3. Set the subject: `Shipment Status Update - {{tracking_id}}`
4. Use this HTML content:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Shipment Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status-update { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
        .shipment-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .tracking-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚚 Shipment Status Update</h1>
        </div>
        
        <div class="content">
            <p>Dear Valued Customer,</p>
            
            <p>Your shipment status has been updated. Here are the details:</p>
            
            <div class="status-update">
                <h3>Status Change</h3>
                <p><strong>Previous Status:</strong> {{previous_status}}</p>
                <p><strong>New Status:</strong> {{new_status}}</p>
                <p><strong>Updated:</strong> {{update_time}}</p>
            </div>
            
            <div class="shipment-details">
                <h3>Shipment Details</h3>
                <p><strong>Tracking ID:</strong> {{tracking_id}}</p>
                <p><strong>Origin:</strong> {{origin}}</p>
                <p><strong>Destination:</strong> {{destination}}</p>
                <p><strong>Current Location:</strong> {{current_location}}</p>
                <p><strong>Transport Mode:</strong> {{transport_mode}}</p>
                {{#if estimated_delivery}}<p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>{{/if}}
                {{#if shipment_notes}}<p><strong>Notes:</strong> {{shipment_notes}}</p>{{/if}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{tracking_url}}" class="tracking-button">Track Your Shipment</a>
            </div>
            
            <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Befach Logistics Team</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>© 2024 Befach Logistics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

5. Save the template and copy the **Template ID**

### 4. Get Your User ID

1. In your EmailJS dashboard, go to **Account** → **API Keys**
2. Copy your **Public Key** (this is your User ID)

### 5. Configure Your Application

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your EmailJS credentials:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id-here
NEXT_PUBLIC_EMAILJS_CREATION_TEMPLATE_ID=your-creation-template-id-here
NEXT_PUBLIC_EMAILJS_STATUS_TEMPLATE_ID=your-status-template-id-here
NEXT_PUBLIC_EMAILJS_USER_ID=your-user-id-here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 6. Test Your Setup

1. Start your application: `npm run dev`
2. Go to `/admin/test-email` in your browser
3. Enter a test email address
4. Try sending both creation and status update test emails
5. Check the recipient's inbox for the emails

## Troubleshooting

### Common Issues:

1. **"Service not found" error**:
   - Double-check your Service ID
   - Make sure your email service is properly connected

2. **"Template not found" error**:
   - Verify your Template IDs are correct
   - Ensure templates are saved and published

3. **"User ID not found" error**:
   - Check your User ID (Public Key) is correct
   - Make sure you're using the Public Key, not the Private Key

4. **Emails not sending**:
   - Check the browser console for error messages
   - Verify all environment variables are set correctly
   - Ensure your email service is active

### EmailJS Limits:

- **Free tier**: 200 emails per month
- **Paid plans**: Start at $15/month for 1,000 emails

## Security Notes

- Your EmailJS credentials are safe to use in client-side code
- The User ID (Public Key) is designed to be public
- EmailJS handles authentication securely
- You can revoke and regenerate keys anytime

## Support

If you encounter issues:
1. Check the EmailJS documentation: [docs.emailjs.com](https://docs.emailjs.com/)
2. Visit the EmailJS community forum
3. Contact EmailJS support for account-related issues 