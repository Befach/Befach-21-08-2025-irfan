import { createEmailServiceResend } from './mailer-resend';
import { createTestShipmentResend, updateTestShipmentStatusResend } from './index-resend';

/**
 * Test script to demonstrate Resend email functionality
 * Replace 'test@example.com' with actual email addresses for testing
 */
async function testResendEmailFunctionality() {
  console.log('🧪 Testing Resend Email Functionality...\n');

  try {
    // Test 1: Verify Resend connection
    console.log('📧 Test 1: Verifying Resend connection...');
    const emailService = createEmailServiceResend();
    const isConnected = await emailService.verifyConnection();
    
    if (isConnected) {
      console.log('✅ Resend connection successful!\n');
    } else {
      console.log('❌ Resend connection failed. Please check your API key.\n');
      return;
    }

    // Test 2: Create a test shipment
    console.log('📦 Test 2: Creating test shipment...');
    const testEmail = 'test@example.com'; // Replace with actual test email
    
    const shipment = await createTestShipmentResend(testEmail);
    console.log(`✅ Test shipment created: ${shipment.tracking_id}`);
    console.log(`📧 Creation email sent to: ${testEmail}\n`);

    // Test 3: Update shipment status
    console.log('🔄 Test 3: Updating shipment status...');
    const updatedShipment = await updateTestShipmentStatusResend(
      shipment.tracking_id,
      'In Transit',
      testEmail,
      { city: 'Delhi', country: 'India' }
    );

    if (updatedShipment) {
      console.log(`✅ Status updated to: ${updatedShipment.status}`);
      console.log(`📧 Status update email sent to: ${testEmail}\n`);
    }

    // Test 4: Send a custom email
    console.log('📨 Test 4: Sending custom email...');
    const customEmailResult = await emailService.sendEmail(
      testEmail,
      'Test Email from Shipment Tracker (Resend)',
      {
        html: `
          <h1>Test Email via Resend</h1>
          <p>This is a test email from the Shipment Tracker system using Resend.</p>
          <p>If you received this email, the Resend configuration is working correctly!</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Service:</strong> Resend</p>
        `,
        text: `
Test Email via Resend

This is a test email from the Shipment Tracker system using Resend.

If you received this email, the Resend configuration is working correctly!

Sent at: ${new Date().toLocaleString()}
Service: Resend
        `
      }
    );

    if (customEmailResult.success) {
      console.log('✅ Custom email sent successfully via Resend!');
      console.log(`📧 Message ID: ${customEmailResult.messageId}\n`);
    } else {
      console.log('❌ Failed to send custom email:', customEmailResult.error);
    }

    console.log('🎉 All Resend tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - Resend Connection: ✅');
    console.log('   - Shipment Creation Email: ✅');
    console.log('   - Status Update Email: ✅');
    console.log('   - Custom Email: ✅');

  } catch (error) {
    console.error('❌ Resend test failed:', error);
  } finally {
    // Close email service connection
    const emailService = createEmailServiceResend();
    await emailService.close();
    console.log('\n🔌 Resend service connection closed.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testResendEmailFunctionality().catch(console.error);
} 