require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendEmail() {
  console.log('🧪 Testing Resend Email Service...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    return;
  }
  
  try {
    console.log('🔑 API Key:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
    
    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('📤 Sending test email...');
    
    // Send test email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default sender for testing
      to: 'iamirfan6767@gmail.com', // Use your verified email address
      subject: 'Test Email from Shipment Tracker',
      html: `
        <h1>🧪 Test Email</h1>
        <p>This is a test email to verify your Resend configuration is working.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Service:</strong> Shipment Tracker</p>
        <p><strong>Status:</strong> ✅ Email service is working!</p>
      `
    });
    
    if (error) {
      console.log('❌ Resend failed:', error.message);
      console.log('🔍 Error details:', error);
    } else {
      console.log('✅ Resend test successful!');
      console.log('📧 Email ID:', data.id);
      console.log('📧 From:', 'onboarding@resend.dev');
      console.log('📧 To:', 'iamirfan6767@gmail.com');
      console.log('📧 Subject:', 'Test Email from Shipment Tracker');
    }
    
  } catch (error) {
    console.log('❌ Resend test failed:', error.message);
    console.log('🔍 Full error:', error);
  }
}

// Run the test
testResendEmail();
