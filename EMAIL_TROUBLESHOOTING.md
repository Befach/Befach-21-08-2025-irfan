# 📧 Email Troubleshooting Guide

This guide helps you resolve email configuration issues in your shipment tracking application.

## 🚨 Common Email Errors

### 1. "Missing credentials for 'PLAIN'" Error

**Error Message:**
```
SMTP email sending failed: Error: Missing credentials for "PLAIN"
```

**Cause:** SMTP authentication is failing due to missing or incorrect credentials.

**Solutions:**

#### A. Create Environment File
Create a `.env.local` file in your project root:

```bash
# Email Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### B. Verify Gmail App Password
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password (NOT your regular Gmail password)

#### C. Test Configuration
```bash
# Test email configuration
npm run test:email-config

# Test full email functionality
npm run test:email
```

### 2. "EAUTH" Authentication Error

**Error Message:**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**
- ✅ Use App Password, not regular password
- ✅ Enable 2-Factor Authentication
- ✅ Check email address spelling
- ✅ Ensure account isn't locked

### 3. "ECONNECTION" Connection Error

**Error Message:**
```
Error: connect ETIMEDOUT smtp.gmail.com:587
```

**Solutions:**
- ✅ Check internet connection
- ✅ Verify firewall settings
- ✅ Try different port (465 with SSL)
- ✅ Check if Gmail SMTP is accessible

## 🧪 Testing Your Email Setup

### Quick Test
```bash
# Test basic configuration
npm run test:email-config

# Test full email system
npm run test:email
```

### Manual Testing
1. **Start your application:**
   ```bash
   npm run dev
   ```

2. **Visit email test page:**
   ```
   http://localhost:3000/admin/test-email
   ```

3. **Test API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/test-email
   ```

## 🔧 Configuration Options

### Gmail SMTP Settings
```javascript
{
  host: 'smtp.gmail.com',
  port: 587,           // or 465 for SSL
  secure: false,       // true for 465, false for 587
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
}
```

### Alternative Email Providers

#### Outlook/Hotmail
```javascript
{
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
}
```

#### Yahoo
```javascript
{
  host: 'smtp.mail.yahoo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@yahoo.com',
    pass: 'your-app-password'
  }
}
```

## 📋 Troubleshooting Checklist

### Environment Setup
- [ ] `.env.local` file exists
- [ ] `SMTP_USER` is set correctly
- [ ] `SMTP_PASS` is set correctly
- [ ] No extra spaces in credentials

### Gmail Configuration
- [ ] 2-Factor Authentication enabled
- [ ] App Password generated for "Mail"
- [ ] Using App Password (not regular password)
- [ ] Account not locked or suspended

### Network/Firewall
- [ ] Internet connection working
- [ ] Port 587 not blocked
- [ ] Firewall allows SMTP traffic
- [ ] No VPN interference

### Application
- [ ] Environment variables loaded
- [ ] Email service initialized
- [ ] No syntax errors in code
- [ ] Proper error handling

## 🛠️ Debug Mode

Enable debug logging by setting environment variable:

```bash
NODE_ENV=development
```

This will show detailed SMTP communication logs.

## 📞 Getting Help

### Check Logs
```bash
# View detailed logs
npm run test:email-config

# Check application logs
npm run dev
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Missing credentials | Create `.env.local` file |
| Invalid password | Use Gmail App Password |
| Connection timeout | Check firewall/network |
| Authentication failed | Enable 2FA on Gmail |
| Port blocked | Try port 465 with SSL |

### Support Resources
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/smtp/)

## 🎯 Quick Fix Commands

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "SMTP_USER=your-email@gmail.com" > .env.local
echo "SMTP_PASS=your-app-password" >> .env.local

# 3. Test configuration
npm run test:email-config

# 4. Test full system
npm run test:email

# 5. Start application
npm run dev
```

---

**Need more help?** Check the logs and error messages for specific details about your issue. 