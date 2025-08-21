// Simple WATI API Test - Direct API call
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiSimple() {
  console.log('🧪 Simple WATI API Test\n');
  
  // Get credentials from environment
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('📋 Credentials Check:');
  console.log('API Key (first 20 chars):', apiKey ? `${apiKey.substring(0, 20)}...` : '❌ MISSING');
  console.log('Instance ID:', instanceId ? instanceId : '❌ MISSING');
  console.log('');
  
  if (!apiKey || !instanceId) {
    console.log('❌ Missing credentials!');
    return;
  }
  
  // Test phone number
  const testPhone = '919182992530';
  
  // Build API URL
  const apiUrl = `https://app-server.wati.io/api/v1/${instanceId}/sendTemplateMessage?whatsappNumber=${testPhone}`;
  
  console.log('🌐 API URL:', apiUrl);
  console.log('📱 Test Phone:', testPhone);
  console.log('');
  
  // Test 1: Try with Bearer token
  console.log('🔍 Test 1: With Bearer token...');
  try {
    const response1 = await axios.post(apiUrl, {
      template_name: 'befach_in',
      broadcast_name: "Befach Logistics",
      parameters: [
        { "1": "🧪 Test message from simple script" }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS with Bearer token!');
    console.log('Status:', response1.status);
    console.log('Response:', response1.data);
    
  } catch (error1) {
    console.log('❌ Failed with Bearer token:', error1.response?.status, error1.response?.statusText);
    console.log('Error:', error1.response?.data || error1.message);
    
    // Test 2: Try without Bearer (just the token)
    console.log('\n🔍 Test 2: Without Bearer (just token)...');
    try {
      const response2 = await axios.post(apiUrl, {
        template_name: 'befach_in',
        broadcast_name: "Befach Logistics",
        parameters: [
          { "1": "🧪 Test message from simple script" }
        ]
      }, {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SUCCESS without Bearer!');
      console.log('Status:', response2.status);
      console.log('Response:', response2.data);
      
    } catch (error2) {
      console.log('❌ Failed without Bearer:', error2.response?.status, error2.response?.statusText);
      console.log('Error:', error2.response?.data || error2.message);
      
      // Test 3: Try with X-API-Key header
      console.log('\n🔍 Test 3: With X-API-Key header...');
      try {
        const response3 = await axios.post(apiUrl, {
          template_name: 'befach_in',
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": "🧪 Test message from simple script" }
          ]
        }, {
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ SUCCESS with X-API-Key!');
        console.log('Status:', response3.status);
        console.log('Response:', response3.data);
        
      } catch (error3) {
        console.log('❌ Failed with X-API-Key:', error3.response?.status, error3.response?.statusText);
        console.log('Error:', error3.response?.data || error3.message);
        
        console.log('\n🔍 All authorization methods failed. Possible issues:');
        console.log('1. API key is expired or invalid');
        console.log('2. Instance ID is wrong');
        console.log('3. Account permissions issue');
        console.log('4. WATI server is down');
      }
    }
  }
}

// Run the test
testWatiSimple().catch(console.error);






