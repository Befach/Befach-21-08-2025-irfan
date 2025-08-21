// Test script for direct WhatsApp message delivery
const axios = require('axios');

async function testDirectWhatsApp() {
  try {
    console.log('📱 Testing Direct WhatsApp Message...');
    
    // Test 1: Direct message via session API
    console.log('\n🔍 Test 1: Direct Message via Session API');
    const directResponse = await axios.post('http://localhost:3000/api/send-whatsapp', {
      whatsappType: 'status-only',
      phone: '+919182992530',
      trackingId: 'TEST-123',
      status: 'In Transit'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Direct Message Response:', directResponse.data);
    
    // Test 2: Check if we can get delivery status
    if (directResponse.data.success && directResponse.data.data) {
      console.log('\n📊 Message Details:');
      console.log('- Phone Number:', directResponse.data.data.phone_number);
      console.log('- Valid WhatsApp:', directResponse.data.data.validWhatsAppNumber);
      console.log('- Result:', directResponse.data.data.result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 This might be a template parameter issue. Check WATI template configuration.');
    }
  }
}

// Run the test
console.log('🚀 Starting Direct WhatsApp Tests...\n');
testDirectWhatsApp();
