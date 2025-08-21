// Test WATI after fixing WATI_INSTANCE_ID
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiAfterFix() {
  console.log('🧪 Testing WATI After Fixing WATI_INSTANCE_ID\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');
  console.log('🆔 Instance ID:', instanceId);
  
  // Check if instance ID is now correct
  if (instanceId && instanceId.includes('http')) {
    console.log('❌ WATI_INSTANCE_ID still contains full URL!');
    console.log('💡 Please change it to just the numeric ID (e.g., 349028)');
    return;
  }
  
  if (!instanceId || isNaN(instanceId)) {
    console.log('❌ WATI_INSTANCE_ID should be a numeric ID (e.g., 349028)');
    return;
  }
  
  console.log('✅ Instance ID format is correct!');
  
  // Test the correct endpoint
  const apiUrl = `https://live-mt-server.wati.io/${instanceId}/api/v1`;
  console.log('🌐 Testing API endpoint:', apiUrl);
  
  try {
    console.log('\n🔍 Testing simple text message...');
    
    const response = await axios.post(
      `${apiUrl}/sendSessionMessage/919182992530`,
      {
        messageText: "🚚 Hello from Befach Logistics! This is a test message via WATI API."
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Message sent via WATI!');
    console.log('📱 Check your WhatsApp now!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error sending message:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data?.error?.message || JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Network error:', error.message);
    }
  }
}

// Run the test
testWatiAfterFix();







