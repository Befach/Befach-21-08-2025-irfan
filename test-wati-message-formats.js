// Test different WATI message formats
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testMessageFormats() {
  console.log('🧪 Testing Different WATI Message Formats\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phoneNumber = '919182992530';
  const apiUrl = 'https://live-mt-server.wati.io/349028/api/v1';
  
  console.log('📱 Testing with phone:', phoneNumber);
  console.log('🌐 API URL:', apiUrl);
  
  // Test different message formats
  const testFormats = [
    {
      name: 'Format 1: messageText (current)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        messageText: "🚚 Hello from Befach Logistics! Test message."
      }
    },
    {
      name: 'Format 2: message (alternative)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        message: "🚚 Hello from Befach Logistics! Test message."
      }
    },
    {
      name: 'Format 3: text (another alternative)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        text: "🚚 Hello from Befach Logistics! Test message."
      }
    },
    {
      name: 'Format 4: body (whatsapp style)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        body: "🚚 Hello from Befach Logistics! Test message."
      }
    },
    {
      name: 'Format 5: content (generic)',
      endpoint: `/sendSessionMessage/${phoneNumber}`,
      data: {
        content: "🚚 Hello from Befach Logistics! Test message."
      }
    }
  ];
  
  for (let i = 0; i < testFormats.length; i++) {
    const format = testFormats[i];
    console.log(`\n🔍 Test ${i + 1}: ${format.name}`);
    
    try {
      const response = await axios.post(
        `${apiUrl}${format.endpoint}`,
        format.data,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Response received');
      console.log('Result:', response.data.result ? 'SUCCESS' : 'FAILED');
      console.log('Info:', response.data.info);
      
      if (response.data.result) {
        console.log('🎉 SUCCESS! This format works!');
        console.log('📱 Check your WhatsApp now!');
        break;
      }
      
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.log('Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Wait 2 seconds between tests
    if (i < testFormats.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('If any format worked, use that for your messages!');
}

// Run the test
testMessageFormats();







