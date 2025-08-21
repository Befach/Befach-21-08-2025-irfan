// Test script for sending shipment status via WhatsApp
const axios = require('axios');

async function testStatusWhatsApp() {
  try {
    console.log('📱 Testing Status-Only WhatsApp...');
    
    const response = await axios.post('http://localhost:3000/api/send-whatsapp', {
      whatsappType: 'status-only',
      phone: '+919182992530',
      trackingId: 'TEST-123',
      status: 'In Transit'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the test
testStatusWhatsApp();









