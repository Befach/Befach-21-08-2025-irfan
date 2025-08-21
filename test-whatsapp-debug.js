require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWhatsAppDebug() {
  console.log('🧪 WhatsApp Debug Test...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phone = '919182992530';
  
  console.log('📱 API Key:', apiKey ? '✅ Present' : '❌ Missing');
  console.log('📱 Phone:', phone);
  console.log('📱 Base URL: https://live-mt-server.wati.io/349028\n');
  
  try {
    // Test 1: Check if we can get templates
    console.log('1️⃣ Testing: Get Templates');
    try {
      const templatesResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/api/v1/getMessageTemplates',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Templates Response:', templatesResponse.status);
      console.log('Available Templates:', templatesResponse.data.map(t => t.name));
    } catch (error) {
      console.log('❌ Templates Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    console.log('\n2️⃣ Testing: Send Simple Template Message');
    try {
      const messageResponse = await axios.post(
        `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
        {
          template_name: 'befach_in',
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": "🚚 Test Message: Your shipment TEST-123 has been created!" }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Message Response Status:', messageResponse.status);
      console.log('✅ Message Response:', JSON.stringify(messageResponse.data, null, 2));
      
      if (messageResponse.data.result === true) {
        console.log('✅ API says: Message sent successfully');
        console.log('📱 Phone Number:', messageResponse.data.phone_number);
        console.log('📱 Template Used:', messageResponse.data.template_name);
        console.log('📱 Contact Name:', messageResponse.data.contact?.fullName);
        console.log('📱 Valid WhatsApp:', messageResponse.data.validWhatsAppNumber);
      } else {
        console.log('❌ API says: Message failed');
      }
      
    } catch (error) {
      console.log('❌ Message Error:', error.response?.status);
      console.log('❌ Error Details:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ General Error:', error.message);
  }
}

testWhatsAppDebug();
