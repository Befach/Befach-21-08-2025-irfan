require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testLogisticWithApiV1() {
  try {
    const phone = '919182992530'; // Your number (without +)
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔧 Testing logistic template with /api/v1 (Marketing template)...');
    console.log('📱 Phone:', phone);
    console.log('🔑 Instance ID:', instanceId);
    console.log('🔑 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Test with logistic template using /api/v1 (Marketing templates)
    const response = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=+${phone}`, {
      template_name: 'logistic',
      broadcast_name: "Befach Logistics",
      parameters: [
        { name: "1", value: "Test Customer" },
        { name: "2", value: "Test Shipment" },
        { name: "3", value: "TEST-API-V1-001" },
        { name: "4", value: "Test Status" },
        { name: "5", value: "Mumbai, India" },
        { name: "6", value: "New York, USA" },
        { name: "7", value: "https://example.com/track/TEST-API-V1-001" }
      ]
    }, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Logistic template sent successfully with /api/v1!');
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
    console.error('❌ Error sending logistic template with /api/v1:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
  }
}

testLogisticWithApiV1();
