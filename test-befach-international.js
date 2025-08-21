// Test sending message using befach_international template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testBefachInternationalTemplate() {
  console.log('🧪 Testing befach_international Template Message Sending\n');
  
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
  const testPhone = process.argv[2] || '+918802308802';
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-befach-international.js YOUR_PHONE_NUMBER');
  console.log('');
  
  // Test with the befach_international template (which we know exists and is APPROVED)
  const templateName = 'befach_international';
  
  console.log('🔍 Testing befach_international template...');
  try {
    const response = await axios.post(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`,
      {
        template_name: templateName,
        broadcast_name: "Befach Logistics",
        parameters: [
          { "1": "🚚 Test Shipment Notification - Your shipment has been updated!" }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS!');
    console.log('Response:', response.data);
    
    if (response.data.result === true) {
      console.log('🎉 Template message sent successfully!');
      console.log('Check your WhatsApp now! 📱');
    } else {
      console.log('⚠️  API returned result: false');
      console.log('Info:', response.data.info);
      console.log('This might be a template parameter issue');
    }
    
  } catch (error) {
    console.log('❌ Failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data || error.message);
  }
  
  console.log('\n🎯 What to check:');
  console.log('1. Check your WhatsApp for the test message');
  console.log('2. If received: Template is working! 🎉');
  console.log('3. If not received: Check the error details above');
}

// Run the test
testBefachInternationalTemplate();





