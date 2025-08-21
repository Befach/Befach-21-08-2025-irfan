require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testEndpoints() {
  console.log('🔍 Testing different endpoint variations...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phone = '919876543210'; // Your test number without +
  
  const endpoints = [
    `https://live-mt-server.wati.io/349028/sendTemplateMessage/${phone}`,
    `https://live-mt-server.wati.io/349028/api/sendTemplateMessage/${phone}`,
    `https://live-mt-server.wati.io/349028/v1/sendTemplateMessage/${phone}`,
    `https://live-mt-server.wati.io/349028/template/send/${phone}`,
    `https://live-mt-server.wati.io/349028/message/template/${phone}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await axios.post(endpoint, {
        template_name: 'befach_in',
        broadcast_name: "Befach Logistics",
        parameters: { "1": "Test" }
      }, {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ SUCCESS: ${endpoint}`);
      break;
    } catch (error) {
      console.log(`❌ ${endpoint} - Status: ${error.response?.status}, Message: ${error.response?.data?.message || error.message}`);
    }
  }
}

testEndpoints().catch(console.error);

