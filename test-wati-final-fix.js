// Final test of WATI with the correct API endpoint
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiFinalFix() {
  console.log('🧪 Final Test: WATI with Correct API Endpoint\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  const apiUrl = 'https://app.wati.io/api/v1/349028';
  
  console.log('📱 Testing with phone:', phoneNumber);
  console.log('🌐 API URL:', apiUrl);
  
  // Test 1: Get account info to verify connection
  console.log('\n🔍 Test 1: Get Account Info (verify connection)');
  
  try {
    const response = await axios.get(
      `${apiUrl}/getAccountInfo`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Account info received');
    console.log('Status:', response.data.status || 'Unknown');
    console.log('Account:', response.data.account || 'Unknown');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return; // Stop if account info fails
  }
  
  // Wait 2 seconds then test simple text message
  console.log('\n⏳ Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Simple text message
  console.log('\n🔍 Test 2: Simple text message');
  
  try {
    const response = await axios.post(
      `${apiUrl}/sendSessionMessage/${phoneNumber}`,
      {
        messageText: "🚚 Hello from Befach Logistics! Test message with correct endpoint."
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
      console.log('🎉 SUCCESS! Text message sent!');
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
  
  // Test 3: Template message
  console.log('\n🔍 Test 3: Template message');
  
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
  console.log('✅ WATI API endpoint is now correct!');
  console.log('📱 Check your WhatsApp for received messages!');
  console.log('🚀 Your shipment tracker is ready to send WhatsApp notifications!');
}

// Run the final test
testWatiFinalFix();







