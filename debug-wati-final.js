// Final WATI debug with proper phone number formats
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function finalWatiDebug() {
  console.log('🔍 Final WATI Debug\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('📋 Environment:');
  console.log('API Key:', apiKey ? '✅ SET' : '❌ MISSING');
  console.log('Instance ID:', instanceId ? '✅ SET' : '❌ MISSING');
  console.log('');
  
  // Test different phone number formats
  const phoneNumbers = [
    '9182992530',
    '+9182992530', 
    '9182992530',
    '9182992530'
  ];
  
  for (let i = 0; i < phoneNumbers.length; i++) {
    const phone = phoneNumbers[i];
    console.log(`\n🧪 Test ${i + 1}: Phone format "${phone}"`);
    
    try {
      // Try to send a simple template message
      const response = await axios.post(
        `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
        {
          template_name: 'befach_in',
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": "TEST" },
            { "2": "DEBUG" },
            { "3": "Message" }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Response:');
      console.log('Result:', response.data?.result);
      console.log('Info:', response.data?.info);
      console.log('Phone Number:', response.data?.phone_number);
      console.log('Valid WhatsApp Number:', response.data?.validWhatsAppNumber);
      
      if (response.data?.result === true) {
        console.log('🎉 SUCCESS! This phone format worked!');
        break;
      } else {
        console.log('❌ Failed:', response.data?.info);
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
    
    // Wait between tests
    if (i < phoneNumbers.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🔍 Additional Checks:');
  console.log('1. Is your WATI instance approved and active?');
  console.log('2. Do you have sufficient credits in your WATI account?');
  console.log('3. Is the phone number registered on WhatsApp?');
  console.log('4. Have you sent a template message to this number before?');
  console.log('5. Check your WATI dashboard for any error messages');
}

finalWatiDebug();








