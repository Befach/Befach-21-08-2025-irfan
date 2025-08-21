// Comprehensive WATI API debugging
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function debugWatiAPI() {
  console.log('🔍 Comprehensive WATI API Debugging\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');
  console.log('🆔 Instance ID:', instanceId);
  
  // Test different possible API endpoints
  const endpoints = [
    {
      name: 'Original (live-mt-server)',
      url: `https://live-mt-server.wati.io/${instanceId}/api/v1`
    },
    {
      name: 'Alternative 1 (live-server)',
      url: `https://live-server-${instanceId}.wati.io/api/v1`
    },
    {
      name: 'Alternative 2 (live)',
      url: `https://live.wati.io/${instanceId}/api/v1`
    },
    {
      name: 'Alternative 3 (app)',
      url: `https://app.wati.io/api/v1`
    }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🔍 Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    
    try {
      // Test 1: Check if endpoint exists (GET request)
      console.log('  📡 Testing endpoint availability...');
      const getResponse = await axios.get(`${endpoint.url}/getTemplates`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('  ✅ Endpoint accessible!');
      console.log('  📊 Templates found:', getResponse.data?.length || 0);
      
      // Test 2: Try to send a message
      console.log('  📤 Testing message sending...');
      const messageResponse = await axios.post(
        `${endpoint.url}/sendSessionMessage/919182992530`,
        {
          messageText: "🚚 Test message from Befach Logistics"
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('  ✅ Message sent successfully!');
      console.log('  📱 Check your WhatsApp now!');
      console.log('  📋 Response:', JSON.stringify(messageResponse.data, null, 2));
      
      // This endpoint works! Use it
      console.log(`\n🎉 SUCCESS! Use this endpoint: ${endpoint.url}`);
      return;
      
    } catch (error) {
      console.log('  ❌ Failed:', error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.log('  📄 Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
  
  console.log('\n❌ All endpoints failed. Possible issues:');
  console.log('1. WATI account not properly configured');
  console.log('2. API key expired or invalid');
  console.log('3. Instance ID incorrect');
  console.log('4. Account suspended or not approved');
  console.log('\n💡 Contact WATI support: support@wati.io');
}

// Run the debug
debugWatiAPI();







