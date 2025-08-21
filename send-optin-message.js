const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('📱 Sending Opt-In WhatsApp Message');
console.log('==================================');

async function sendOptInMessage() {
  try {
    const phone = '919182992530';
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('📱 Phone:', phone);
    console.log('📱 Instance ID:', instanceId);
    
    // Send a session message (doesn't require opt-in)
    console.log('\n📤 Sending session message to trigger opt-in...');
    
    const response = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v1/sendSessionMessage`, {
      whatsappNumber: phone,
      messageText: "Hello! This is a test message from Befach Logistics. Please reply 'OK' to confirm you want to receive shipment notifications."
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Session Message Response:', response.data);
    
    if (response.data.result === true) {
      console.log('\n🎉 Opt-in message sent successfully!');
      console.log('📱 Check your WhatsApp and reply to the message');
      console.log('💡 After you reply, you should be able to receive template messages');
    } else {
      console.log('❌ Failed to send opt-in message:', response.data);
    }
    
  } catch (error) {
    console.log('❌ Failed to send opt-in message:');
    console.log('   Status:', error.response?.status);
    console.log('   Data:', error.response?.data);
    console.log('   Message:', error.message);
  }
}

sendOptInMessage().catch(console.error);
