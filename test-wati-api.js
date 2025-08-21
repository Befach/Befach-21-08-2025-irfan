require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWatiEndpoints() {
  console.log('🔍 Testing WATI API Endpoints...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('API Key:', apiKey ? '✅ Found' : '❌ Missing');
  console.log('Instance ID:', instanceId ? '✅ Found' : '❌ Missing\n');
  
  if (!apiKey || !instanceId) {
    console.log('❌ Missing credentials');
    return;
  }
  
  // Test different possible endpoints
  const endpoints = [
    'https://api.wati.io/v1/getTemplates',
    'https://live-mt-server.wati.io/349028/api/v1/getTemplates',
    'https://live-mt-server.wati.io/349028/v1/getTemplates',
    'https://live-mt-server.wati.io/349028/getTemplates'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ SUCCESS: ${endpoint}`);
      console.log('Response:', response.data);
      break;
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint} - ${error.response?.status || error.message}`);
    }
  }
}

testWatiEndpoints().catch(console.error);

