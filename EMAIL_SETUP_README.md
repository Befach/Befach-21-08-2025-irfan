# Email Notifications Setup Guide

This guide explains how to set up email notifications for shipment status updates using SMTP with Gmail.

## Overview

The shipment tracker now sends email notifications to clients whenever:
1. A new shipment is created
2. A shipment status is updated

## Email Service Configuration

### Gmail SMTP Setup

The system uses Gmail SMTP to send emails. You'll need to set up an App Password for security.

#### Gmail App Password Setup:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to [myaccount.google.com](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Click "Generate" for a new app password
   - Select "Mail" as the app type
   - Copy the generated 16-character password

3. **Important Security Notes**:
   - **Never use your regular Gmail password**
   - **Only use the generated App Password**
   - **Keep the App Password secure and don't share it**

### Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Gmail SMTP Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important Notes:**
- `SMTP_USER`: Your Gmail address
- `SMTP_PASS`: The 16-character App Password (not your regular password)
- `NEXT_PUBLIC_BASE_URL`: Your application's base URL for tracking links

### Package Installation

The required packages are already installed:
```bash
npm install nodemailer @types/nodemailer
```

## Email Templates

The system includes two types of email templates:

### 1. Shipment Creation Email
- Sent when a new shipment is created
- Includes shipment details and tracking link
- Green-themed design

### 2. Status Update Email
- Sent when shipment status changes
- Shows previous and new status
- Blue-themed design
- Includes updated shipment information

## Email Content

Both email types include:
- Professional HTML and plain text versions
- Shipment tracking ID
- Origin and destination information
- Current status and location
- Estimated delivery date (if available)
- Direct link to track the shipment
- Company branding and contact information

## Testing the Email System

### 1. Create a Test Shipment
1. Go to `/admin/shipments/new`
2. Fill in the form with a valid email address
3. Submit the form
4. Check the email inbox for the creation notification

### 2. Test Status Updates
1. Go to `/admin/shipments/[id]/edit`
2. Change the shipment status
3. Save the changes
4. Check the email inbox for the status update notification

### 3. Use the Test Page
1. Go to `/admin/test-email`
2. Enter a test email address
3. Select email type and send test

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure you're using an App Password, not your regular password
   - Verify 2-factor authentication is enabled
   - Check that the email and App Password are correct

2. **Emails Not Sending**
   - Check the browser console for error messages
   - Verify environment variables are set correctly
   - Ensure the SMTP configuration is correct

3. **"Less secure app access" error**
   - This error occurs when using regular passwords
   - Always use App Passwords instead

4. **Emails Going to Spam**
   - Use a professional email domain
   - Ensure proper SPF/DKIM records are set up
   - Consider using a dedicated email service like SendGrid or Mailgun

### Debug Mode

To enable debug logging, add this to your environment:
```bash
DEBUG_EMAIL=true
```

## Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive information
3. **Use App Passwords** instead of regular passwords
4. **Monitor email sending** for unusual activity
5. **Consider rate limiting** for production use

## Production Deployment

For production deployment:

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Configure email monitoring** and alerts
4. **Implement rate limiting** to prevent abuse
5. **Set up email templates** with your company branding

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your SMTP configuration
3. Test with a simple email client first
4. Contact your email provider for support

## Files Modified

The following files were modified to implement email notifications:

- `lib/smtpEmailService.js` - Email service using SMTP
- `pages/api/send-email.ts` - API endpoint for sending emails
- `pages/admin/shipments/new.tsx` - Updated to send creation emails
- `pages/admin/shipments/[id]/edit.tsx` - Updated to send status update emails
- `env-template.txt` - Added SMTP configuration variables
- `package.json` - Added nodemailer dependency 