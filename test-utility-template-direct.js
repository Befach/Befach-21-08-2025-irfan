const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testUtilityTemplateDirect() {
  console.log('🔍 Testing Utility Template Directly...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phone = '9182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Extract instance ID correctly
  let instanceId = process.env.WATI_INSTANCE_ID;
  if (instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1];
  }
  
  console.log('📱 Testing with phone:', phone);
  console.log('🔧 Instance ID:', instanceId);
  console.log('');
  
  // Test with your actual utility template
  const templateName = 'followup_required_lead';
  
  console.log(`🔍 Testing template: ${templateName}`);
  
  try {
    const response = await axios.post(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
      {
        template_name: templateName,
        broadcast_name: "Befach Logistics",
        parameters: [] // Start with no parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Response received!');
    console.log('Result:', response.data.result);
    console.log('Info:', response.data.info);
    
    if (response.data.result === true) {
      console.log('🎯 SUCCESS! Your utility template works!');
      console.log('📱 Perfect for shipment status updates!');
    }
    
  } catch (error) {
    console.log('❌ Failed:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    
    // Try to understand the error better
    if (error.response?.data?.items) {
      console.log('\n🔍 Detailed error info:');
      error.response.data.items.forEach((item, index) => {
        console.log(`  ${index + 1}. Code: ${item.code}, Description: ${item.description}`);
      });
    }
  }
}

testUtilityTemplateDirect();

