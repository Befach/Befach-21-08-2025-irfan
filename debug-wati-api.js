// Debug WATI API - Check exact API call and response
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function debugWatiApi() {
  console.log('🔍 Debugging WATI API...\n');
  
  // Check environment variables
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('📋 Environment Variables:');
  console.log('WATI_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : '❌ MISSING');
  console.log('WATI_INSTANCE_ID:', instanceId ? instanceId : '❌ MISSING');
  console.log('');
  
  if (!apiKey || !instanceId) {
    console.log('❌ Missing required environment variables!');
    return;
  }
  
  // Build the API URL
  let cleanInstanceId = instanceId;
  if (instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    cleanInstanceId = urlParts[urlParts.length - 1];
    console.log('🔧 Extracted Instance ID:', cleanInstanceId);
  }
  
  // Use your actual WATI credentials
  const apiUrl = `https://app-server.wati.io/api/v1/349028/sendTemplateMessage?whatsappNumber=919876543210`;
  console.log('🔧 Using your WATI Instance ID: 349028');
  
  console.log('🌐 API URL:', apiUrl);
  console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
  console.log('');
  
  // Test the API call
  try {
    console.log('🚀 Making API call...');
    
    const response = await axios.post(apiUrl, {
      template_name: 'befach_in',
      broadcast_name: "Befach Logistics",
      parameters: [
        { "1": "🧪 Test message from debug script" }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Call Successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ API Call Failed!');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 401 Error Analysis:');
      console.log('1. Check if API key is correct in WATI dashboard');
      console.log('2. Check if Instance ID is correct');
      console.log('3. Check if API key has proper permissions');
      console.log('4. Check if WATI account is active');
    }
  }
}

// Run the debug
debugWatiApi().catch(console.error);
