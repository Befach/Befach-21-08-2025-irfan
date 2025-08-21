const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('📱 Sending Opt-In Message to Get You Started');
console.log('=============================================');

async function sendOptInMessage() {
  try {
    const phone = '919182992530'; // Your number
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('📱 Your Phone:', phone);
    console.log('📱 Instance ID:', instanceId);
    
    // Method 1: Try session message (v1 endpoint - doesn't require opt-in)
    console.log('\n📤 Attempting to send session message (v1)...');
    
    try {
      const sessionResponse = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v1/sendSessionMessage`, {
        whatsappNumber: phone,
        messageText: "🚀 Hello from Befach Logistics! This is a test message to get you opted in for shipment notifications. Please reply 'OK' to confirm you want to receive updates about your shipments."
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      console.log('✅ Session message sent successfully!');
      console.log('📱 Response:', sessionResponse.data);
      console.log('\n🎯 Next Steps:');
      console.log('1. Check your WhatsApp for the message');
      console.log('2. Reply with any text (like "OK" or "Hi")');
      console.log('3. This will opt you in automatically');
      console.log('4. Then template messages will work!');
      return;
      
    } catch (sessionError) {
      console.log('❌ Session message failed:', sessionError.response?.status, sessionError.response?.data?.message || sessionError.message);
    }
    
    // Method 2: Try simple template that works (hii template)
    console.log('\n📤 Attempting simple template message...');
    
    try {
      const templateResponse = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=+${phone}`, {
        template_name: 'hii',
        broadcast_name: "Befach Logistics",
        parameters: []
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      console.log('✅ Simple template sent successfully!');
      console.log('📱 Response:', templateResponse.data);
      console.log('\n🎯 Next Steps:');
      console.log('1. Check your WhatsApp for a "👋" message');
      console.log('2. Reply with any text (like "Hi")');
      console.log('3. This will opt you in for future messages');
      
    } catch (templateError) {
      console.log('❌ Template message also failed:', templateError.response?.status, templateError.response?.data?.message || templateError.message);
      
      console.log('\n🔧 Manual Opt-In Required:');
      console.log('Please do one of these:');
      console.log('1. Send a message TO your WATI number from your phone');
      console.log('2. Or login to WATI dashboard and send yourself a message');
      console.log('3. This will opt you in automatically');
    }
    
  } catch (error) {
    console.log('❌ Opt-in process failed:', error.message);
  }
}

sendOptInMessage().catch(console.error);
