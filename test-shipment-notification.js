// Test shipment notification with new working template
require('dotenv').config({ path: '.env.local' });
const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');

async function testShipmentNotification() {
  console.log('🧪 Testing Shipment Notification System\n');
  
  const testPhone = process.argv[2] || '+918802308802';
  const trackingId = 'BEF-20241201-12345';
  const status = 'In Transit';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('📦 Tracking ID:', trackingId);
  console.log('🔄 Status:', status);
  console.log('💡 To test with your number: node test-shipment-notification.js YOUR_PHONE_NUMBER');
  console.log('');
  
  try {
    console.log('🚚 Sending shipment status update...');
    const result = await sendStatusOnlyWhatsApp(trackingId, status, testPhone);
    
    if (result.success) {
      console.log('✅ SUCCESS! Shipment notification sent successfully!');
      console.log('Response:', result.message);
      console.log('');
      console.log('🎉 Your shipment notification system is now working!');
      console.log('   Using the new befach_import_export template.');
    } else {
      console.log('❌ FAILED to send shipment notification');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
  
  console.log('\n🎯 What to check:');
  console.log('1. Check your WhatsApp for the shipment notification');
  console.log('2. If received: System is working perfectly! 🎉');
  console.log('3. If not received: Check the error details above');
}

testShipmentNotification();





