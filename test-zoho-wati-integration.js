// Test Zoho + WATI Integration for WhatsApp Messaging
require('dotenv').config({ path: '.env.local' });

const ZohoWorkflowService = require('./lib/zohoWorkflowService');

async function testZohoWatiIntegration() {
  console.log('🚀 Testing Zoho + WATI Integration for WhatsApp Messaging\n');
  
  // Initialize the service
  const zohoService = new ZohoWorkflowService();
  
  // Test 1: Basic Zoho integration
  console.log('🔍 Test 1: Testing Zoho Integration...');
  const zohoTest = await zohoService.testZohoIntegration();
  console.log('');
  
  // Test 2: Send WhatsApp via Zoho + WATI
  console.log('🔍 Test 2: Sending WhatsApp via Zoho + WATI...');
  const testPhone = process.argv[2] || '919876543210';
  const testMessage = '🚚 Test message from Zoho + WATI integration!';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-zoho-wati-integration.js YOUR_PHONE_NUMBER');
  console.log('');
  
  const whatsappResult = await zohoService.sendWhatsAppViaZohoWati(
    testPhone, 
    testMessage, 
    'whatsapp_notification'
  );
  
  if (whatsappResult.success) {
    console.log('✅ WhatsApp sent successfully via Zoho + WATI!');
    console.log('📱 Check your WhatsApp for the message');
    console.log('📊 Zoho Result:', whatsappResult.zoho);
    console.log('📱 WATI Result:', whatsappResult.wati);
  } else {
    console.log('❌ WhatsApp sending failed:', whatsappResult.error);
  }
  
  console.log('');
  
  // Test 3: Send shipment notification
  console.log('🔍 Test 3: Sending Shipment Notification via Zoho + WATI...');
  const testShipment = {
    trackingId: 'ZOHO_TEST_123',
    status: 'In Transit',
    origin: 'Mumbai',
    destination: 'Delhi',
    estimatedDelivery: '2024-01-20'
  };
  
  const shipmentResult = await zohoService.sendShipmentNotificationViaZoho(
    testShipment,
    testPhone,
    'Test Customer',
    'creation'
  );
  
  if (shipmentResult.success) {
    console.log('✅ Shipment notification sent successfully!');
    console.log('📱 Check your WhatsApp for the shipment update');
  } else {
    console.log('❌ Shipment notification failed:', shipmentResult.error);
  }
  
  console.log('\n🎯 Integration Summary:');
  console.log('✅ Zoho Integration:', zohoTest.success ? 'Working' : 'Failed');
  console.log('✅ WhatsApp via Zoho + WATI:', whatsappResult.success ? 'Working' : 'Failed');
  console.log('✅ Shipment Notifications:', shipmentResult.success ? 'Working' : 'Failed');
  
  console.log('\n💡 How to use in production:');
  console.log('1. Set up Zoho workflows for your business logic');
  console.log('2. Configure ZOHO_WEBHOOK_URL in .env.local');
  console.log('3. Use zohoService.sendWhatsAppViaZohoWati() for messages');
  console.log('4. Use zohoService.sendShipmentNotificationViaZoho() for shipments');
}

// Run the test
testZohoWatiIntegration().catch(console.error);






