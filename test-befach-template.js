// Test sending message using befach_in template
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testBefachTemplate() {
  console.log('🧪 Testing befach_in Template Message Sending\n');
  
  const apiKey = process.env.WATI_API_KEY;
  let instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Extract instance ID from URL if needed
  if (instanceId && instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1];
    console.log('🔧 Extracted instance ID:', instanceId);
  }
  
  if (!instanceId) {
    console.log('❌ Missing WATI_INSTANCE_ID');
    return;
  }
  
  // Get phone number from command line argument or use default
  const testPhone = process.argv[2] || '919876543210';
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-befach-template.js YOUR_PHONE_NUMBER');
  console.log('');
  
  // Test with the CORRECT template name
  const templateName = 'shopify_default_order_complete_v6'; // Use a working template
  
  // Test 1: Try the old URL structure first (this might actually work!)
  console.log('🔍 Test 1: Trying old URL structure...');
  try {
    const oldResponse = await axios.post(
      `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`,
      {
        template_name: templateName, // Use the variable
        broadcast_name: "Befach Logistics",
        parameters: [
          { "1": "🚚 Test Customer" },
          { "2": "Befach Logistics" },
          { "3": "#TEST123" }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS with old URL!');
    console.log('Response:', oldResponse.data);
    console.log('Message should be delivered to mobile! 📱');
    console.log('Check your WhatsApp now!');
    
  } catch (error) {
    console.log('❌ Old URL failed:', error.response?.status, error.response?.statusText);
    
    // Test 2: Try new URL structure
    console.log('\n🔍 Test 2: Trying new URL structure...');
    try {
      const newResponse = await axios.post(
        `https://live-server-${instanceId}.wati.io/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`,
        {
          template_name: templateName, // Use the variable
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": "🚚 Test Customer" },
            { "2": "Befach Logistics" },
            { "3": "#TEST123" }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ SUCCESS with new URL!');
      console.log('Response:', newResponse.data);
      console.log('Message should be delivered to mobile! 📱');
      console.log('Check your WhatsApp now!');
      
    } catch (error2) {
      console.log('❌ New URL also failed:', error2.response?.status, error2.response?.statusText);
      console.log('Error details:', error2.response?.data || error2.message);
    }
  }
  
  console.log('\n🎯 What to check:');
  console.log('1. Check your WhatsApp for the test message');
  console.log('2. If received: Template is working! 🎉');
  console.log('3. If not received: Check WATI dashboard for template status');
}

// Run the test
testBefachTemplate();
