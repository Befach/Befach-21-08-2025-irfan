// Debug script to find the correct WATI API endpoint structure
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWatiEndpoints() {
  console.log('🔍 Testing different WATI API endpoint structures...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028'; // From your dashboard
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  const endpoints = [
    `https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`,
    `https://live-mt-server.wati.io/${instanceId}/api/v1/getTemplates`,
    `https://live-mt-server.wati.io/${instanceId}/getMessageTemplates`,
    `https://live-mt-server.wati.io/${instanceId}/getTemplates`,
    `https://live-mt-server.wati.io/${instanceId}/api/v1/templates`,
    `https://live-mt-server.wati.io/${instanceId}/templates`
  ];
  
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    console.log(`🔍 Testing endpoint ${i + 1}: ${endpoint}`);
    
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ SUCCESS! Status: ${response.status}`);
      console.log(`Response:`, response.data);
      console.log(`🎯 This is the correct endpoint structure!\n`);
      return;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.status || error.message}`);
      if (error.response?.status === 401) {
        console.log(`   🔐 Authentication issue - check your API key\n`);
      } else if (error.response?.status === 404) {
        console.log(`   📍 Endpoint not found - wrong URL structure\n`);
      } else {
        console.log(`   ⚠️  Other error: ${error.response?.data || error.message}\n`);
      }
    }
  }
  
  console.log('❌ All endpoint structures failed. Please check your WATI dashboard for the correct API documentation.');
}

testWatiEndpoints();





