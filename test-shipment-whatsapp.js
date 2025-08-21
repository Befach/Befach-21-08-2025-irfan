// Test script for shipment WhatsApp notifications
require('dotenv').config({ path: '.env.local' });

const { 
  sendShipmentCreationWhatsApp,
  sendShipmentStatusUpdateWhatsApp,
  sendStatusOnlyWhatsApp 
} = require('./lib/watiWhatsAppService');

async function testShipmentWhatsApp() {
  console.log('🚚 Testing Shipment WhatsApp Notifications\n');
  
  const testPhone = '9182992530'; // Your test phone number
  const testShipment = {
    tracking_id: 'BEF-2024-001',
    shipment_name: 'Electronics Package',
    origin_country: 'India',
    destination_country: 'USA',
    estimated_delivery: '2024-12-20'
  };
  
  console.log('📦 Test Shipment Data:');
  console.log('Tracking ID:', testShipment.tracking_id);
  console.log('Shipment Name:', testShipment.shipment_name);
  console.log('Origin:', testShipment.origin_country);
  console.log('Destination:', testShipment.destination_country);
  console.log('Phone:', testPhone);
  console.log('');
  
  try {
    // Test 1: Shipment Creation WhatsApp
    console.log('🧪 Test 1: Shipment Creation WhatsApp');
    console.log('Sending new shipment notification...');
    
    const creationResult = await sendShipmentCreationWhatsApp(
      testShipment, 
      testPhone, 
      'John Doe'
    );
    
    if (creationResult.success) {
      console.log('✅ SUCCESS: Shipment creation WhatsApp sent!');
      console.log('Message:', creationResult.message);
    } else {
      console.log('❌ FAILED:', creationResult.error);
    }
    
    console.log('');
    
    // Wait a bit before next test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Status Update WhatsApp
    console.log('🧪 Test 2: Status Update WhatsApp');
    console.log('Sending status update notification...');
    
    const statusResult = await sendShipmentStatusUpdateWhatsApp(
      testShipment,
      testPhone,
      'John Doe',
      'Pending',
      'In Transit'
    );
    
    if (statusResult.success) {
      console.log('✅ SUCCESS: Status update WhatsApp sent!');
      console.log('Message:', statusResult.message);
    } else {
      console.log('❌ FAILED:', statusResult.error);
    }
    
    console.log('');
    
    // Wait a bit before next test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Quick Status Update
    console.log('🧪 Test 3: Quick Status Update');
    console.log('Sending quick status notification...');
    
    const quickResult = await sendStatusOnlyWhatsApp(
      testShipment.tracking_id,
      'Out for Delivery',
      testPhone
    );
    
    if (quickResult.success) {
      console.log('✅ SUCCESS: Quick status WhatsApp sent!');
      console.log('Message:', quickResult.message);
    } else {
      console.log('❌ FAILED:', quickResult.error);
    }
    
    console.log('\n🎉 All shipment WhatsApp tests completed!');
    console.log('📱 Check your mobile device for the messages.');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
testShipmentWhatsApp();








