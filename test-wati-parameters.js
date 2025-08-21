// Test different WATI parameter formats
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiParameters() {
  console.log('🧪 Testing Different WATI Parameter Formats\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('📱 Testing with phone:', phoneNumber);
  
  // Test different parameter formats
  const testFormats = [
    {
      name: 'Format 1: Simple key-value',
      parameters: [
        { "1": "Test Customer" },
        { "2": "Befach Logistics" },
        { "3": "#TEST123" }
      ]
    },
    {
      name: 'Format 2: paramName-paramValue',
      parameters: [
        { "paramName": "name", "paramValue": "Test Customer" },
        { "paramName": "shop_name", "paramValue": "Befach Logistics" },
        { "paramName": "order_number", "paramValue": "#TEST123" }
      ]
    },
    {
      name: 'Format 3: Direct parameter names',
      parameters: [
        { "name": "Test Customer" },
        { "shop_name": "Befach Logistics" },
        { "order_number": "#TEST123" }
      ]
    },
    {
      name: 'Format 4: Array of values',
      parameters: ["Test Customer", "Befach Logistics", "#TEST123"]
    },
    {
      name: 'Format 5: No parameters',
      parameters: []
    }
  ];
  
  for (let i = 0; i < testFormats.length; i++) {
    const format = testFormats[i];
    console.log(`\n🔍 Test ${i + 1}: ${format.name}`);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
        {
          template_name: 'shopify_default_order_complete_v6',
          broadcast_name: "Befach Logistics",
          parameters: format.parameters
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
      console.log('Info:', response.data.info);
      
      if (response.data.result) {
        console.log('🎉 SUCCESS! This format works!');
        console.log('📱 Check your WhatsApp now!');
        break;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.statusText);
    }
    
    // Wait 2 seconds between tests
    if (i < testFormats.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('If any format worked, use that for your messages!');
}

// Run the test
testWatiParameters();







