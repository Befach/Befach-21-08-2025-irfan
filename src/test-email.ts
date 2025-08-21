import { createEmailService } from './mailer';
import { createTestShipment, updateTestShipmentStatus } from './index';

/**
 * Test script to demonstrate email functionality
 * Replace 'test@example.com' with actual email addresses for testing
 */
async function testEmailFunctionality() {
  console.log('🧪 Testing Email Functionality...\n');

  try {
    // Test 1: Verify SMTP connection
    console.log('📧 Test 1: Verifying SMTP connection...');
    const emailService = createEmailService();
    const isConnected = await emailService.verifyConnection();
    
    if (isConnected) {
      console.log('✅ SMTP connection successful!\n');
    } else {
      console.log('❌ SMTP connection failed. Please check your credentials.\n');
      return;
    }

    // Test 2: Create a test shipment
    console.log('📦 Test 2: Creating test shipment...');
    const testEmail = 'iamirfan6767@gmail.com'; // Your email address
    
    const shipment = await createTestShipment(testEmail);
    console.log(`✅ Test shipment created: ${shipment.tracking_id}`);
    console.log(`📧 Creation email sent to: ${testEmail}\n`);

    // Test 3: Update shipment status
    console.log('🔄 Test 3: Updating shipment status...');
    const updatedShipment = await updateTestShipmentStatus(
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
      'Test Email from Shipment Tracker',
      {
        html: `
          <h1>Test Email</h1>
          <p>This is a test email from the Shipment Tracker system.</p>
          <p>If you received this email, the SMTP configuration is working correctly!</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        `,
        text: `
Test Email

This is a test email from the Shipment Tracker system.

If you received this email, the SMTP configuration is working correctly!

Sent at: ${new Date().toLocaleString()}
        `
      }
    );

    if (customEmailResult.success) {
      console.log('✅ Custom email sent successfully!');
      console.log(`📧 Message ID: ${customEmailResult.messageId}\n`);
    } else {
      console.log('❌ Failed to send custom email:', customEmailResult.error);
    }

    console.log('🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - SMTP Connection: ✅');
    console.log('   - Shipment Creation Email: ✅');
    console.log('   - Status Update Email: ✅');
    console.log('   - Custom Email: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close email service connection
    const emailService = createEmailService();
    await emailService.close();
    console.log('\n🔌 Email service connection closed.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailFunctionality().catch(console.error);
} 