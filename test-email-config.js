// Simple email configuration test
// Run this with: node test-email-config.js

console.log('🔧 Email Configuration Test\n');

// Check environment variables
console.log('Environment Variables:');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Test email configuration
const nodemailer = require('nodemailer');

const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '21r11a05p6@gcet.edu.in',
    pass: process.env.SMTP_PASS || 'djsr emay rjfy Ifgc'
  },
  debug: true,
  logger: true
};

console.log('\n📧 SMTP Configuration:');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('User:', config.auth.user);
console.log('Pass:', config.auth.pass ? '***' + config.auth.pass.slice(-4) : 'Not set');

// Test connection
async function testConnection() {
  console.log('\n🧪 Testing SMTP Connection...');
  
  try {
    const transporter = nodemailer.createTransporter(config);
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Test sending a simple email
    console.log('\n📨 Testing email send...');
    const info = await transporter.sendMail({
      from: config.auth.user,
      to: 'iamirfan6767@gmail.com', // Your email address
      subject: 'Test Email from Shipment Tracker',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    await transporter.close();
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Error - Possible solutions:');
      console.log('1. Check if SMTP_USER and SMTP_PASS are correct');
      console.log('2. Ensure 2-Factor Authentication is enabled on Gmail');
      console.log('3. Generate an App Password for Gmail');
      console.log('4. Make sure you\'re using the App Password, not your regular password');
    }
    
    if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Gmail SMTP settings');
      console.log('3. Check if port 587 is blocked by firewall');
    }
  }
}

testConnection(); 