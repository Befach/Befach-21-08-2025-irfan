require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testSimpleWhatsApp() {
  try {
    const phone = '919182992530'; // Your number (without +)
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔧 Testing simple WhatsApp message...');
    console.log('📱 Phone:', phone);
    console.log('🔑 Instance ID:', instanceId);
    console.log('🔑 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Test with a simple template (like 'hii' which might work without opt-in)
    const response = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v2/sendTemplateMessage?whatsappNumber=+${phone}`, {
      template_name: 'hii',
      broadcast_name: "Befach Logistics",
      parameters: []
    }, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Simple template sent successfully!');
    console.log('📱 Response:', response.data);
    
    // Check if message was delivered
    if (response.data.result === true) {
      console.log('🎉 Message sent to WATI successfully!');
      console.log('📱 Now check your mobile WhatsApp for the message');
      console.log('📱 Also check your WATI dashboard for delivery status');
    } else {
      console.log('❌ WATI returned false result');
    }
    
  } catch (error) {
    console.error('❌ Error sending simple template:', error.response?.data || error.message);
  }
}

testSimpleWhatsApp();
