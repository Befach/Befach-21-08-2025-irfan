require('dotenv').config({ path: '.env.local' });

// Import the WhatsApp service
const watiService = require('./lib/watiWhatsAppService.js');

async function testWhatsAppService() {
  console.log('🔍 Testing WhatsApp Service Directly...');
  console.log('========================================');
  
  try {
    // Test 1: Check if the service can be loaded
    console.log('✅ WhatsApp service loaded successfully');
    
    // Test 2: Check the base URL function
    const baseURL = watiService.getWatiBaseURL();
    console.log('🔗 Base URL:', baseURL);
    
    // Test 3: Test sending a message
    console.log('\n📱 Testing sendStatusOnlyWhatsApp function...');
    
    const result = await watiService.sendStatusOnlyWhatsApp(
      'TEST-SERVICE-001',     // trackingId
      'Test Status',          // status
      '919182992530',         // clientPhone (without +)
      {
        customerName: 'Test Customer',
        shipmentName: 'Test Shipment',
        origin: 'Mumbai, India',
        destination: 'New York, USA'
      }
    );
    
    console.log('✅ WhatsApp service test completed');
    console.log('📱 Result:', result);
    
  } catch (error) {
    console.error('❌ Error testing WhatsApp service:', error.message);
    console.error('❌ Stack trace:', error.stack);
  }
}

testWhatsAppService();
