const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function debugApiEndpoints() {
  console.log('🔍 Debugging WATI API Endpoints...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('🔧 Environment Variables:');
  console.log('Instance ID:', instanceId);
  console.log('API Key (first 20 chars):', apiKey.substring(0, 20) + '...');
  console.log('');
  
  // Test different API endpoints
  const endpoints = [
    {
      name: 'Get Message Templates (Current)',
      url: `https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`,
      method: 'GET'
    },
    {
      name: 'Get Message Templates (Alternative)',
      url: `https://live-mt-server.wati.io/${instanceId}/api/v1/getTemplates`,
      method: 'GET'
    },
    {
      name: 'Get Message Templates (Dashboard)',
      url: `https://live-mt-server.wati.io/${instanceId}/api/v1/templates`,
      method: 'GET'
    }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`🔍 Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    
    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Response received!');
      console.log('Status:', response.status);
      console.log('Data keys:', Object.keys(response.data));
      
      if (response.data.templates) {
        console.log(`📋 Templates found: ${response.data.templates.length}`);
      } else if (response.data.data && response.data.data.templates) {
        console.log(`📋 Templates found: ${response.data.data.templates.length}`);
      } else {
        console.log('📋 No templates array found in response');
        console.log('Response structure:', JSON.stringify(response.data, null, 2).substring(0, 500));
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.response?.status || error.code);
      if (error.response?.data) {
        console.log('Error details:', error.response.data);
      } else if (error.code === 'ECONNABORTED') {
        console.log('Error: Request timeout');
      } else {
        console.log('Error:', error.message);
      }
    }
    
    console.log('');
  }
}

debugApiEndpoints();

