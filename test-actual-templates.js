const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testActualTemplates() {
  console.log('🔍 Testing Your Actual Utility Templates...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phone = '9182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Your actual utility templates from the dashboard
  const actualTemplates = [
    'followup_required_lead',
    'rework_price_state', 
    'documentation_chech_state',
    'pending_specs_state',
    'requirement_received_state',
    'enquiry_received'
  ];
  
  console.log('📋 Testing Your Dashboard Templates...\n');
  
  for (const templateName of actualTemplates) {
    console.log(`🔍 Testing: ${templateName}`);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
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
        console.log('🎯 SUCCESS! This utility template works!');
        console.log('📱 Perfect for shipment status updates!');
        return templateName;
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }
    
    console.log('');
  }
  
  console.log('❌ None of your utility templates worked.');
  console.log('💡 There might be an API endpoint issue.');
}

testActualTemplates();

