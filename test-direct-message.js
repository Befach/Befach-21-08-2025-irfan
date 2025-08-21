// Test sending a direct message instead of template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testDirectMessage() {
  console.log('🧪 Testing Direct Message (No Template)\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  const testPhone = process.argv[2] || '+918802308802';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('💡 To test with your number: node test-direct-message.js YOUR_PHONE_NUMBER');
  console.log('');
  
  try {
    // Try direct message first (no template)
    console.log('🔍 Testing direct message...');
    const directResponse = await axios.post(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/sendSessionMessage/${testPhone}`,
      {
        messageText: "🚚 Test message from Befach Logistics - This is a direct message test. If you receive this, the API is working but templates have issues."
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Direct message response:', directResponse.data);
    
    if (directResponse.data && directResponse.data.result === false) {
      console.log('❌ Direct message failed:', directResponse.data.info);
    } else {
      console.log('🎉 Direct message sent successfully!');
      console.log('Check your WhatsApp now! 📱');
    }
    
  } catch (error) {
    console.log('❌ Direct message error:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data || error.message);
  }
  
  console.log('\n🎯 What to check:');
  console.log('1. Check your WhatsApp for the direct message');
  console.log('2. If received: API works, template has issues');
  console.log('3. If not received: There\'s a deeper delivery problem');
}

testDirectMessage();





