const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debugging WhatsApp Issue');
console.log('============================');

// Check environment variables
console.log('\n🔑 Environment Check:');
console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Present' : '❌ Missing');
console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID);
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing');

// Test WhatsApp directly
async function testWhatsAppDirect() {
  console.log('\n📱 Testing WhatsApp Direct API Call:');
  
  try {
    const phone = '919182992530'; // Your actual number (without +)
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('📱 Phone:', phone);
    console.log('📱 Instance ID:', instanceId);
    console.log('📱 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Test 1: Check if we can reach WATI
    console.log('\n🔍 Test 1: Checking WATI connectivity...');
    try {
      const healthResponse = await axios.get(`https://live-mt-server.wati.io/${instanceId}/api/v2/getMessageTemplates`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      console.log('✅ WATI connectivity: OK');
      console.log('📋 Available templates:', healthResponse.data?.length || 0);
    } catch (error) {
      console.log('❌ WATI connectivity failed:', error.response?.status, error.response?.data || error.message);
    }
    
    // Test 2: Try to send a message
    console.log('\n🔍 Test 2: Trying to send WhatsApp message...');
    try {
      const response = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v2/sendTemplateMessage?whatsappNumber=+${phone}`, {
        template_name: 'logistic',
        broadcast_name: "Befach Logistics",
        parameters: [
          { name: "1", value: "Test Customer" },
          { name: "2", value: "Test Shipment" },
          { name: "3", value: "TEST-123" },
          { name: "4", value: "Test Status" },
          { name: "5", value: "Mumbai, India" },
          { name: "6", value: "New York, USA" },
          { name: "7", value: "https://example.com/track/TEST-123" }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      console.log('✅ WhatsApp API Response:', response.data);
      
      if (response.data.result === true) {
        console.log('🎉 WhatsApp message sent successfully!');
        console.log('📱 Check your phone for the message');
      } else {
        console.log('❌ WhatsApp API returned false result:', response.data);
      }
      
    } catch (error) {
      console.log('❌ WhatsApp sending failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Data:', error.response?.data);
      console.log('   Message:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Test your local API endpoint
async function testLocalAPI() {
  console.log('\n🌐 Testing Local API Endpoint:');
  
  try {
    const response = await axios.post('http://localhost:3000/api/send-whatsapp', {
      whatsappType: 'status-only',
      phone: '919182992530', // Your actual number (without +)
      trackingId: 'TEST-DEBUG-001',
      status: 'Debug Test Status',
      additionalData: {
        customerName: 'Debug Customer',
        shipmentName: 'Debug Shipment',
        origin: 'Mumbai, India',
        destination: 'New York, USA'
      }
    }, {
      timeout: 15000
    });
    
    console.log('✅ Local API Response:', response.data);
    
  } catch (error) {
    console.log('❌ Local API failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Data:', error.response?.data);
    console.log('   Message:', error.message);
  }
}

// Run tests
async function runDebugTests() {
  console.log('🚀 Starting debug tests...\n');
  
  await testWhatsAppDirect();
  await testLocalAPI();
  
  console.log('\n✨ Debug tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Check if you received the WhatsApp message');
  console.log('2. Check the console output above for any errors');
  console.log('3. Verify your phone number is correct');
  console.log('4. Check if your WATI account has the logistic template');
}

runDebugTests().catch(console.error);
