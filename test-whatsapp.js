// Test script for WhatsApp integration
const { sendWhatsAppMessage } = require('./lib/watiWhatsAppService');

async function testWhatsApp() {
  console.log('🧪 Testing WhatsApp Integration...\n');

  // Test 1: Basic message sending
  console.log('📱 Test 1: Sending basic WhatsApp message');
  const result1 = await sendWhatsAppMessage(
    '+919876543210', // Replace with your test number
    '🚚 Test message from Befach Logistics!\n\nThis is a test message to verify WhatsApp integration is working correctly.'
  );
  console.log('Result:', result1);
  console.log('');

  // Test 2: Shipment creation message
  console.log('📦 Test 2: Sending shipment creation message');
  const shipmentData = {
    tracking_id: 'BEF-20241201-12345',
    shipment_name: 'Test Electronics Package',
    origin_country: 'India',
    destination_country: 'USA',
    estimated_delivery: '2024-12-15'
  };
  
  const { generateCreationWhatsAppMessage } = require('./lib/watiWhatsAppService');
  const creationMessage = generateCreationWhatsAppMessage(shipmentData, 'John Doe');
  console.log('Generated message:');
  console.log(creationMessage);
  console.log('');

  // Test 3: Status update message
  console.log('🔄 Test 3: Sending status update message');
  const { generateStatusUpdateWhatsAppMessage } = require('./lib/watiWhatsAppService');
  const statusMessage = generateStatusUpdateWhatsAppMessage(
    shipmentData, 
    'John Doe', 
    'In Transit', 
    'Out for Delivery'
  );
  console.log('Generated message:');
  console.log(statusMessage);
  console.log('');

  console.log('✅ WhatsApp integration test completed!');
}

// Run the test
testWhatsApp().catch(console.error);













