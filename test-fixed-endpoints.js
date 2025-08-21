const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testFixedEndpoints() {
  console.log('🔍 Testing Fixed API Endpoints...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Extract instance ID correctly
  let instanceId = process.env.WATI_INSTANCE_ID;
  if (instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1];
    console.log('🔧 Extracted instance ID:', instanceId);
  }
  
  console.log('📋 Testing API endpoints with correct instance ID...\n');
  
  // Test the correct endpoint
  try {
    const response = await axios.get(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Templates API working!');
    console.log('Status:', response.status);
    console.log('Templates found:', response.data.templates?.length || 0);
    
    if (response.data.templates && response.data.templates.length > 0) {
      console.log('\n📱 Available Templates:');
      response.data.templates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name} (${template.category}) - ${template.status}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Templates API failed:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

testFixedEndpoints();

