// Test Pabbly + WATI Integration for WhatsApp Messaging
require('dotenv').config({ path: '.env.local' });

const PabblyIntegrationService = require('./lib/pabblyIntegrationService');

async function testPabblyWatiIntegration() {
  console.log('🚀 Testing Pabbly + WATI Integration for WhatsApp Messaging\n');
  
  // Initialize the service
  const pabblyService = new PabblyIntegrationService();
  
  // Test 1: Basic Pabbly integration
  console.log('🔍 Test 1: Testing Pabbly Integration...');
  const pabblyTest = await pabblyService.testPabblyIntegration();
  console.log('');
  
  // Test 2: Send WhatsApp via Pabbly + WATI
  console.log('🔍 Test 2: Sending WhatsApp via Pabbly + WATI...');
  const testPhone = process.argv[2] || '919876543210';
  const testMessage = '🚚 Test message from Pabbly + WATI integration!';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-pabbly-wati-integration.js YOUR_PHONE_NUMBER');
  console.log('');
  
  const whatsappResult = await pabblyService.sendWhatsAppViaPabblyWati(
    testPhone, 
    testMessage, 
    'whatsapp_notification'
  );
  
  if (whatsappResult.success) {
    console.log('✅ WhatsApp sent successfully via Pabbly + WATI!');
    console.log('📱 Check your WhatsApp for the message');
    console.log('📊 Pabbly Result:', whatsappResult.pabbly);
    console.log('📱 WATI Result:', whatsappResult.wati);
  } else {
    console.log('❌ WhatsApp sending failed:', whatsappResult.error);
  }
  
  console.log('');
  
  // Test 3: Send shipment notification
  console.log('🔍 Test 3: Sending Shipment Notification via Pabbly + WATI...');
  const testShipment = {
    trackingId: 'TEST123',
    status: 'In Transit',
    origin: 'Mumbai',
    destination: 'Delhi',
    estimatedDelivery: '2024-01-15'
  };
  
  const shipmentResult = await pabblyService.sendShipmentNotificationViaPabbly(
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
  console.log('✅ Pabbly Integration:', pabblyTest.success ? 'Working' : 'Failed');
  console.log('✅ WhatsApp via Pabbly + WATI:', whatsappResult.success ? 'Working' : 'Failed');
  console.log('✅ Shipment Notifications:', shipmentResult.success ? 'Working' : 'Failed');
  
  console.log('\n💡 How to use in production:');
  console.log('1. Set up Pabbly workflows for your business logic');
  console.log('2. Configure PABBLY_API_KEY and PABBLY_WEBHOOK_URL in .env.local');
  console.log('3. Use pabblyService.sendWhatsAppViaPabblyWati() for messages');
  console.log('4. Use pabblyService.sendShipmentNotificationViaPabbly() for shipments');
}

// Run the test
testPabblyWatiIntegration().catch(console.error);






