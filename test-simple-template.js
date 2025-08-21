require('dotenv').config();
const axios = require('axios');

async function testSimpleTemplate() {
  try {
    const phone = '919182992530'; // Your number (without +)
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔧 Testing simple template...');
    console.log('📱 Phone:', phone);
    console.log('🔑 Instance ID:', instanceId);
    
    // Test with a simple template (like 'hii' which we know works)
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
      console.log('📱 Check your WATI dashboard for delivery status');
    } else {
      console.log('❌ WATI returned false result');
    }
    
  } catch (error) {
    console.error('❌ Error sending simple template:', error.response?.data || error.message);
  }
}

testSimpleTemplate();
