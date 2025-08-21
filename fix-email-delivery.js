require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

// Fix Email Delivery Issues
async function fixEmailDelivery() {
  console.log('🔧 Email Delivery Fix Script Starting...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Present' : '❌ Missing');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Present' : '❌ Missing');
  console.log('SMTP_HOST:', process.env.SMTP_HOST ? '✅ Present' : '❌ Missing');
  console.log('SMTP_PORT:', process.env.SMTP_PORT ? '✅ Present' : '❌ Missing');
  
  // Check if we have any email configuration
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSMTP = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  
  if (!hasResend && !hasSMTP) {
    console.log('\n❌ No email configuration found!');
    console.log('💡 You need either RESEND_API_KEY or SMTP credentials');
    await setupEmailConfiguration();
    return;
  }
  
  if (hasResend) {
    console.log('\n📧 Testing Resend Email Service...');
    await testResendEmail();
  }
  
  if (hasSMTP) {
    console.log('\n📧 Testing SMTP Email Service...');
    await testSMTPEmail();
  }
  
  // Provide solutions
  provideEmailSolutions();
}

async function setupEmailConfiguration() {
  console.log('\n🔧 Setting up Email Configuration...');
  console.log('\nChoose your email service:');
  console.log('1. Gmail SMTP (Free, requires App Password)');
  console.log('2. Resend (Modern service, requires API key)');
  console.log('3. Other SMTP provider');
  
  console.log('\n📝 For Gmail SMTP setup:');
  console.log('1. Go to your Google Account settings');
  console.log('2. Enable 2-factor authentication');
  console.log('3. Generate an App Password');
  console.log('4. Add these to your .env.local file:');
  console.log('   SMTP_HOST=smtp.gmail.com');
  console.log('   SMTP_PORT=587');
  console.log('   SMTP_USER=your-email@gmail.com');
  console.log('   SMTP_PASS=your-16-character-app-password');
  
  console.log('\n📝 For Resend setup:');
  console.log('1. Go to https://resend.com');
  console.log('2. Sign up and get your API key');
  console.log('3. Add to your .env.local file:');
  console.log('   RESEND_API_KEY=re_your_api_key_here');
}

async function testResendEmail() {
  try {
    console.log('📤 Testing Resend email...');
    
    // Check if Resend package is installed
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Use default sender for testing
        to: 'test@example.com',
        subject: 'Test Email from Shipment Tracker',
        html: '<p>This is a test email to verify Resend is working.</p>'
      });
      
      if (error) {
        console.log('❌ Resend failed:', error.message);
      } else {
        console.log('✅ Resend test successful!');
        console.log('📧 Email ID:', data.id);
      }
      
    } catch (error) {
      console.log('❌ Resend package not installed or error:', error.message);
      console.log('💡 Run: npm install resend');
    }
    
  } catch (error) {
    console.log('❌ Resend test failed:', error.message);
  }
}

async function testSMTPEmail() {
  try {
    console.log('📤 Testing SMTP email...');
    
    // Create test transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'test@example.com',
      subject: 'Test Email from Shipment Tracker',
      text: 'This is a test email to verify SMTP is working.',
      html: '<p>This is a test email to verify SMTP is working.</p>'
    });
    
    console.log('✅ SMTP test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    
  } catch (error) {
    console.log('❌ SMTP test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication failed - check your username/password');
    } else if (error.code === 'ECONNECTION') {
      console.log('🌐 Connection failed - check your SMTP host/port');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('⏰ Connection timeout - check your network/firewall');
    }
  }
}

function provideEmailSolutions() {
  console.log('\n🔧 SOLUTIONS TO FIX EMAIL DELIVERY:');
  
  console.log('\n1. 📧 RESEND SERVICE (Recommended):');
  console.log('   - Go to https://resend.com');
  console.log('   - Sign up and get API key');
  console.log('   - Add RESEND_API_KEY to .env.local');
  console.log('   - Run: npm install resend');
  
  console.log('\n2. 📧 GMAIL SMTP SETUP:');
  console.log('   - Enable 2-factor authentication on Google Account');
  console.log('   - Generate App Password (not regular password)');
  console.log('   - Add SMTP credentials to .env.local');
  console.log('   - Use port 587 (TLS) or 465 (SSL)');
  
  console.log('\n3. 📧 OTHER SMTP PROVIDERS:');
  console.log('   - Outlook: smtp-mail.outlook.com:587');
  console.log('   - Yahoo: smtp.mail.yahoo.com:587');
  console.log('   - Custom: Check your provider\'s SMTP settings');
  
  console.log('\n4. 🔧 IMMEDIATE FIXES:');
  console.log('   - Check .env.local file exists and has correct values');
  console.log('   - Restart your development server after changing .env');
  console.log('   - Verify email credentials are correct');
  console.log('   - Check if your email provider allows SMTP access');
  
  console.log('\n📞 NEXT STEPS:');
  console.log('1. Choose your preferred email service');
  console.log('2. Set up the required credentials');
  console.log('3. Update your .env.local file');
  console.log('4. Test email delivery');
  console.log('5. Restart your development server');
}

// Run the fix
fixEmailDelivery();

