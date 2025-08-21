// Test Direct WATI API for WhatsApp Messaging
require('dotenv').config({ path: '.env.local' });

const DirectWatiService = require('./lib/directWatiService');

async function testDirectWati() {
  console.log('🚀 Testing Direct WATI API for WhatsApp Messaging\n');
  
  // Initialize the service
  const directWati = new DirectWatiService();
  
  // Test 1: Test connection
  console.log('🔍 Test 1: Testing Direct WATI API Connection...');
  const connectionTest = await directWati.testConnection();
  console.log('');
  
  // Test 2: Send shipment creation notification
  console.log('🔍 Test 2: Sending Shipment Creation Notification...');
  const testPhone = process.argv[2] || '919876543210';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-direct-wati.js YOUR_PHONE_NUMBER');
  console.log('');
  
  const testShipment = {
    trackingId: 'DIRECT_TEST_123',
    status: 'In Transit',
    origin: 'Mumbai',
    destination: 'Delhi',
    current_city: 'Mumbai',
    estimatedDelivery: '2024-01-20'
  };
  
  const shipmentResult = await directWati.sendShipmentNotification(
    testShipment,
    testPhone,
    'Test Customer',
    'creation'
  );
  
  if (shipmentResult.success) {
    console.log('✅ Shipment notification sent successfully!');
    console.log('📱 Check your WhatsApp for the message');
    console.log('📊 Response:', shipmentResult.data);
  } else {
    console.log('❌ Shipment notification failed:', shipmentResult.error);
  }
  
  console.log('');
  
  // Test 3: Send status update notification
  console.log('🔍 Test 3: Sending Status Update Notification...');
  const statusUpdateResult = await directWati.sendShipmentNotification(
    testShipment,
    testPhone,
    'Test Customer',
    'status_update'
  );
  
  if (statusUpdateResult.success) {
    console.log('✅ Status update notification sent successfully!');
    console.log('📱 Check your WhatsApp for the status update');
  } else {
    console.log('❌ Status update notification failed:', statusUpdateResult.error);
  }
  
  console.log('');
  
  // Test 4: Send custom template message
  console.log('🔍 Test 4: Sending Custom Template Message...');
  const customResult = await directWati.sendTemplateMessage(
    testPhone,
    'welcome_wati_v2',
    { '1': '🚚 Hello from Direct WATI API!' }
  );
  
  if (customResult.success) {
    console.log('✅ Custom template message sent successfully!');
    console.log('📱 Check your WhatsApp for the custom message');
  } else {
    console.log('❌ Custom template message failed:', customResult.error);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('✅ Direct WATI Connection:', connectionTest.success ? 'Working' : 'Failed');
  console.log('✅ Shipment Creation:', shipmentResult.success ? 'Working' : 'Failed');
  console.log('✅ Status Update:', statusUpdateResult.success ? 'Working' : 'Failed');
  console.log('✅ Custom Template:', customResult.success ? 'Working' : 'Failed');
  
  console.log('\n💡 Benefits of Direct WATI API:');
  console.log('1. ✅ No workflow dependencies');
  console.log('2. ✅ Faster execution');
  console.log('3. ✅ Easier debugging');
  console.log('4. ✅ More reliable');
  console.log('5. ✅ Direct control over messages');
  console.log('6. ✅ Using correct WATI server: https://app-server.wati.io');
  
  console.log('\n🚀 Ready to use in production!');
}

// Run the test
testDirectWati().catch(console.error);
