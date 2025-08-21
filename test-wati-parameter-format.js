// Test WATI parameter format - checking if parameters need dashboard configuration
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testParameterFormat() {
  console.log('🧪 Testing WATI Parameter Format\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  const apiUrl = 'https://live-mt-server.wati.io/349028/api/v1';
  
  console.log('📱 Testing with phone:', phoneNumber);
  console.log('🌐 API URL:', apiUrl);
  
  // Test different parameter formats
  const testCases = [
    {
      name: 'Test 1: No parameters (basic text)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        messageText: "🚚 Hello from Befach Logistics! This is a test message."
      }
    },
    {
      name: 'Test 2: Template with {{1}} placeholder',
      endpoint: `/sendTemplateMessage/${phoneNumber}`,
      data: {
        template_name: "shopify_default_order_complete_v6",
        parameters: [
          { "1": "Test Customer" },
          { "2": "Befach Logistics" },
          { "3": "#TEST123" }
        ]
      }
    },
    {
      name: 'Test 3: Template with {{name}} placeholder',
      endpoint: `/sendTemplateMessage/${phoneNumber}`,
      data: {
        template_name: "befach_international",
        parameters: [
          { "name": "Test Customer" }
        ]
      }
    },
    {
      name: 'Test 4: Simple text message (no template)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        messageText: "Test message from Befach Logistics"
      }
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🔍 ${testCase.name}`);
    
    try {
      const response = await axios.post(
        `${apiUrl}${testCase.endpoint}`,
        testCase.data,
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
        console.log('🎉 SUCCESS! This format works!');
        console.log('📱 Check your WhatsApp now!');
        break;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.log('Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Wait 3 seconds between tests
    if (i < testCases.length - 1) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('If Test 1 (no parameters) works but others fail,');
  console.log('then WATI needs parameter configuration in dashboard!');
}

// Run the test
testParameterFormat();







