// Test different parameter formats for befach_international template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testTemplateParameters() {
  console.log('🧪 Testing befach_international Template Parameters\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  const testPhone = '+918802308802';
  const templateName = 'befach_international';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('🔧 Template:', templateName);
  console.log('');
  
  // Test different parameter formats
  const parameterTests = [
    {
      name: 'Test 1: Single parameter with name',
      parameters: [{ name: "1", value: "Test Message" }]
    },
    {
      name: 'Test 2: Single parameter with key',
      parameters: [{ "1": "Test Message" }]
    },
    {
      name: 'Test 3: Single parameter string',
      parameters: "Test Message"
    },
    {
      name: 'Test 4: Array of strings',
      parameters: ["Test Message"]
    },
    {
      name: 'Test 5: Object format',
      parameters: { "1": "Test Message" }
    },
    {
      name: 'Test 6: No parameters',
      parameters: []
    }
  ];
  
  for (let i = 0; i < parameterTests.length; i++) {
    const test = parameterTests[i];
    console.log(`🔍 ${test.name}...`);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`,
        {
          template_name: templateName,
          broadcast_name: "Befach Logistics",
          parameters: test.parameters
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Response:`, response.data);
      
      if (response.data.result === true) {
        console.log('🎉 SUCCESS! This parameter format works!\n');
        return;
      } else {
        console.log(`⚠️  Failed: ${response.data.info}\n`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status} - ${error.response?.data?.info || error.message}\n`);
    }
    
    // Wait a bit between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('❌ All parameter formats failed. The template might have specific requirements.');
}

testTemplateParameters();





