// Test WATI with corrected domain (live.wati.io)
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiFixed() {
  console.log('🧪 Testing WATI with Corrected Domain (live.wati.io)\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('📱 Testing with phone:', phoneNumber);
  console.log('🌐 Using domain: live.wati.io (matching your dashboard)');
  
  try {
    console.log('\n🔍 Test 1: Simple text message...');
    
    const textResponse = await axios.post(
      `https://live.wati.io/349028/api/v1/sendSessionMessage/${phoneNumber}`,
      {
        messageText: "🚚 Hello from Befach Logistics! This is a test message via WATI API."
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Text message response:');
    console.log('Result:', textResponse.data.result ? 'SUCCESS' : 'FAILED');
    console.log('Info:', textResponse.data.info);
    
    if (textResponse.data.result) {
      console.log('🎉 SUCCESS! Check your WhatsApp now!');
    }
    
    // Wait 3 seconds
    console.log('\n⏳ Waiting 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔍 Test 2: Template message...');
    
    const templateResponse = await axios.post(
      `https://live.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      {
        template_name: 'shopify_default_order_complete_v6',
        broadcast_name: "Befach Logistics",
        parameters: [
          { "1": "Test Customer" },
          { "2": "Befach Logistics" },
          { "3": "#TEST123" }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Template message response:');
    console.log('Result:', templateResponse.data.result ? 'SUCCESS' : 'FAILED');
    console.log('Info:', templateResponse.data.info);
    
    if (templateResponse.data.result) {
      console.log('🎉 SUCCESS! Template message sent! Check your WhatsApp!');
    }
    
  } catch (error) {
    console.log('❌ Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data?.error?.message || JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Network error:', error.message);
    }
  }
}

// Run the test
testWatiFixed();







