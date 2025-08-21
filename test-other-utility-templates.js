const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testOtherUtilityTemplates() {
  console.log('🔍 Testing Other Utility Templates for Shipment Data...\n');
  
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
  
  // Test other utility templates that might be better for shipment data
  const templates = [
    'rework_price_state',
    'documentation_chech_state', 
    'pending_specs_state',
    'requirement_received_state',
    'enquiry_received'
  ];
  
  for (const templateName of templates) {
    console.log(`🔍 Testing template: ${templateName}`);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
        {
          template_name: templateName,
          broadcast_name: "Befach Logistics",
          parameters: [
            { name: "1", value: "SHIP-2024-001" },
            { name: "2", value: "John Smith" },
            { name: "3", value: "In Transit" }
          ]
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
        console.log('🎯 SUCCESS! This template works with shipment data!');
        console.log('📱 Check your mobile for the message');
        console.log(`💡 Consider using: ${templateName}`);
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }
    
    console.log('');
  }
}

testOtherUtilityTemplates();

