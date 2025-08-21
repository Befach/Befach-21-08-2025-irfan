// Test WATI with the corrected domain
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiFixedDomain() {
  console.log('🧪 Testing WATI with Corrected Domain\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  const apiUrl = 'https://live.wati.io/349028/api/v1';
  
  console.log('📱 Testing with phone:', phoneNumber);
  console.log('🌐 API URL:', apiUrl);
  
  // Test simple text message first
  console.log('\n🔍 Test 1: Simple text message');
  
  try {
    const response = await axios.post(
      `${apiUrl}/sendSessionMessage/${phoneNumber}`,
      {
        messageText: "🚚 Hello from Befach Logistics! Test message with correct domain."
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Response received');
    console.log('Result:', response.data.result ? 'SUCCESS' : 'FAILED');
    console.log('Info:', response.data.info || 'No info provided');
    
    if (response.data.result) {
      console.log('🎉 SUCCESS! WATI is now working!');
      console.log('📱 Check your WhatsApp now!');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
  
  // Wait 3 seconds then test template message
  console.log('\n⏳ Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('\n🔍 Test 2: Template message');
  
  try {
    const response = await axios.post(
      `${apiUrl}/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      {
        template_name: "shopify_default_order_complete_v6",
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
    
    console.log('✅ Response received');
    console.log('Result:', response.data.result ? 'SUCCESS' : 'FAILED');
    console.log('Info:', response.data.info || 'No info provided');
    
    if (response.data.result) {
      console.log('🎉 SUCCESS! Template message sent!');
      console.log('📱 Check your WhatsApp now!');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('If both tests work, WATI is fully functional!');
  console.log('If only Test 1 works, templates need dashboard configuration.');
}

// Run the test
testWatiFixedDomain();







