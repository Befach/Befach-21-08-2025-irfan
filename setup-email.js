// Email Setup Script for iamirfan6767@gmail.com
// Run this with: node setup-email.js

const fs = require('fs');
const path = require('path');

console.log('🔧 Email Setup for Shipment Tracker\n');

const emailAddress = 'iamirfan6767@gmail.com';
const envFile = '.env.local';

console.log(`📧 Setting up email for: ${emailAddress}\n`);

// Check if .env.local already exists
if (fs.existsSync(envFile)) {
  console.log('⚠️  .env.local file already exists');
  console.log('   Please check if SMTP_USER and SMTP_PASS are set correctly\n');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Email Configuration for Shipment Notifications
# SMTP Configuration (Gmail with App Password)

# Gmail SMTP Settings
SMTP_USER=${emailAddress}
SMTP_PASS=your-app-password-here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Note: To get an app password for Gmail:
# 1. Enable 2-Factor Authentication on your Gmail account
# 2. Go to Google Account settings → Security → 2-Step Verification → App passwords
# 3. Generate a new app password for "Mail"
# 4. Replace "your-app-password-here" with the generated password
`;

  try {
    fs.writeFileSync(envFile, envContent);
    console.log('✅ .env.local file created successfully!\n');
  } catch (error) {
    console.error('❌ Failed to create .env.local file:', error.message);
    return;
  }
}

console.log('📋 Next Steps:\n');

console.log('1. 🔐 Set up Gmail App Password:');
console.log('   - Go to https://myaccount.google.com/security');
console.log('   - Enable 2-Factor Authentication if not already enabled');
console.log('   - Go to "App passwords" (under 2-Step Verification)');
console.log('   - Select "Mail" and generate a new password');
console.log('   - Copy the 16-character password\n');

console.log('2. ✏️  Update .env.local file:');
console.log('   - Open .env.local in your project root');
console.log('   - Replace "your-app-password-here" with your Gmail App Password');
console.log('   - Save the file\n');

console.log('3. 🧪 Test your email configuration:');
console.log('   npm run test:email-config\n');

console.log('4. 🚀 Test full email system:');
console.log('   npm run build:ts');
console.log('   npm run test:email\n');

console.log('5. 🌐 Start your application:');
console.log('   npm run dev\n');

console.log('📞 Need help? Check EMAIL_TROUBLESHOOTING.md for detailed instructions.\n');

// Check current environment variables
console.log('🔍 Current Environment Variables:');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development'); 