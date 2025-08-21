// Test WATI simple text message (no templates)
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiSimpleText() {
  console.log('🧪 Testing WATI Simple Text Message (No Templates)\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('📱 Testing with phone:', phoneNumber);
  
  try {
    console.log('🔍 Sending simple text message...');
    
    const response = await axios.post(
      `https://live-mt-server.wati.io/349028/api/v1/sendSessionMessage/${phoneNumber}`,
      {
        messageText: "🚚 Hello from Befach Logistics! This is a simple text message sent via WATI API. Your shipment tracking is now active."
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Simple text message sent');
    console.log('📱 Check your WhatsApp now!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error sending simple text message:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data?.error?.message || JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('💡 Your API key might be invalid or expired');
      } else if (error.response.status === 400) {
        console.log('💡 Check your phone number format');
      } else if (error.response.status === 404) {
        console.log('💡 Endpoint not found - check your WATI instance configuration');
      }
    } else {
      console.log('Network error:', error.message);
    }
  }
}

// Run the test
testWatiSimpleText();







