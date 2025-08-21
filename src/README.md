# Shipment Tracking & Email System (TypeScript)

A modular TypeScript implementation for shipment tracking with automatic email notifications using nodemailer and Gmail SMTP.

## 🏗️ Architecture

| Feature              | Used Tool / Library                            | Description                                 |
| -------------------- | ---------------------------------------------- | ------------------------------------------- |
| **Language**         | TypeScript                                   | Strongly typed superset of JavaScript       |
| **Mailing Library**  | nodemailer                                   | For sending emails (SMTP)                   |
| **Mail Transporter** | Gmail SMTP                                     | Sending email via Gmail (you can change it) |
| **Shipment Logic**   | Custom TypeScript module                       | Simulated shipment creation & update logic  |
| **File Structure**   | Modular mailer.ts, shipment.ts, index.ts | Clean separation of logic                   |
| **Compilation**      | tsc (TypeScript Compiler)                    | Compiles .ts files to .js               |
| **Execution**        | node dist/index.js                           | Runs the compiled JavaScript                |

## 📁 File Structure

```
src/
├── types.ts          # TypeScript type definitions
├── mailer.ts         # Email service using nodemailer
├── shipment.ts       # Shipment management logic
├── index.ts          # Main entry point and demo
├── test-email.ts     # Email functionality tests
└── README.md         # This file
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Email Configuration for Shipment Notifications
# SMTP Configuration (Gmail with App Password)

# Gmail SMTP Settings
SMTP_USER=21r11a05p6@gcet.edu.in
SMTP_PASS=djsr emay rjfy Ifgc

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Compile TypeScript

```bash
npm run build:ts
```

### 3. Run Demo

```bash
npm run run:demo
```

### 4. Test Email Functionality

```bash
npm run test:email
```

## 📧 Email Features

### Automatic Email Notifications

1. **Shipment Creation Email**
   - Sent when a new shipment is created
   - Includes tracking ID, status, origin, destination
   - Contains tracking link

2. **Status Update Email**
   - Sent whenever shipment status changes
   - Shows previous and new status
   - Includes current location updates

### Email Templates

- **HTML Version**: Beautiful, responsive design with styling
- **Text Version**: Plain text fallback for email clients
- **Professional Branding**: Befach Logistics branding

## 🔧 Configuration

### Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use that password (not your regular Gmail password)

### Customization

You can easily modify:
- Email templates in `shipment.ts`
- SMTP configuration in `mailer.ts`
- Shipment status workflow in `index.ts`

## 📋 API Usage

### Create a Shipment

```typescript
import { createTestShipment } from './src/index';

const shipment = await createTestShipment('client@example.com');
console.log(`Shipment created: ${shipment.tracking_id}`);
```

### Update Shipment Status

```typescript
import { updateTestShipmentStatus } from './src/index';

const updatedShipment = await updateTestShipmentStatus(
  'TRK12345678',
  'In Transit',
  'client@example.com',
  { city: 'Delhi', country: 'India' }
);
```

### Send Custom Email

```typescript
import { createEmailService } from './src/mailer';

const emailService = createEmailService();
const result = await emailService.sendEmail(
  'recipient@example.com',
  'Custom Subject',
  {
    html: '<h1>Custom HTML</h1>',
    text: 'Custom text version'
  }
);
```

## 🧪 Testing

### Test Email Connection

```bash
npm run test:email
```

This will:
1. Verify SMTP connection
2. Create a test shipment
3. Update shipment status
4. Send a custom test email

### Manual Testing

1. Replace `'test@example.com'` in `test-email.ts` with your email
2. Run the test script
3. Check your email for notifications

## 🔍 Troubleshooting

### Common Issues

1. **SMTP Connection Failed**
   - Check Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account
   - Verify environment variables are set

2. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript version compatibility

3. **Email Not Received**
   - Check spam folder
   - Verify recipient email address
   - Check Gmail sending limits

### Debug Mode

Enable detailed logging by modifying the email service:

```typescript
// In mailer.ts, add debug option
const transporter = nodemailer.createTransport({
  ...config,
  debug: true,
  logger: true
});
```

## 📊 Features

- ✅ **TypeScript Support**: Full type safety
- ✅ **Modular Design**: Clean separation of concerns
- ✅ **Email Templates**: HTML and text versions
- ✅ **SMTP Integration**: Gmail SMTP support
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Testing**: Built-in test scripts
- ✅ **Documentation**: Detailed code comments

## 🔄 Integration

This system can be easily integrated into your existing Next.js application:

1. Copy the `src/` files to your project
2. Import the services in your API routes
3. Use the email service for notifications
4. Customize templates as needed

## 📝 License

This implementation is part of the Shipment Tracker project. 