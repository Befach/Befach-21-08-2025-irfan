require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkAvailableTemplates() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔧 Checking available WATI templates...');
    console.log('🔑 Instance ID:', instanceId);
    console.log('🔑 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Check available templates
    const response = await axios.get(`https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Templates retrieved successfully!');
    console.log('📋 Available templates:');
    
    if (response.data && response.data.data) {
      const templates = response.data.data;
      templates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name} - Status: ${template.status} - Category: ${template.category}`);
      });
    } else {
      console.log('📋 No templates found or unexpected response format');
      console.log('📋 Response:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Error getting templates:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
  }
}

checkAvailableTemplates();
