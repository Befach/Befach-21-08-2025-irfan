require('dotenv').config({ path: '.env.local' });
const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');

async function testFixedWhatsApp() {
  console.log('🧪 Testing Fixed WhatsApp Service (Utility Template)...\n');
  
  const testData = {
    trackingId: 'FIXED-TEST-123',
    status: 'Shipment Created Successfully',
    additionalData: {
      customerName: 'Test Customer',
      shipmentName: 'Fixed WhatsApp Test',
      origin: 'Mumbai, India',
      destination: 'New York, USA'
    }
  };
  
  try {
    console.log('📱 Testing with your working phone number...');
    console.log('📋 Test Data:', testData);
    console.log('🎯 Using: requirement_received_state template (utility template)');
    
    const result = await sendStatusOnlyWhatsApp(
      testData.trackingId,
      testData.status,
      '+919346589508', // Your working number
      testData.additionalData
    );
    
    if (result.success) {
      console.log('✅ SUCCESS! WhatsApp sent successfully');
      console.log('📱 Check your phone for the message');
      console.log('📊 Response:', result.data);
      console.log('📝 Message:', result.message);
    } else {
      console.log('❌ FAILED to send WhatsApp');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

// Run the test
testFixedWhatsApp();
