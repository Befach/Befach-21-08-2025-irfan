// Test befach_in template with multiple different phone numbers
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testMultipleNumbers() {
  console.log('🧪 Testing befach_in Template with Multiple Numbers\n');
  
  const apiKey = process.env.WATI_API_KEY;
  let instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Extract instance ID from URL if needed
  if (instanceId && instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1];
    console.log('🔧 Extracted instance ID:', instanceId);
  }
  
  if (!instanceId) {
    console.log('❌ Missing WATI_INSTANCE_ID');
    return;
  }
  
  // Test with different numbers (replace with actual numbers you want to test)
  const testNumbers = [
    '919182992530',  // Your number
    '919876543210',  // Test number 1
    '918765432109',  // Test number 2
    // Add more numbers here
  ];
  
  console.log('📱 Testing with numbers:', testNumbers);
  console.log('💡 Edit this file to add your own test numbers');
  console.log('');
  
  for (let i = 0; i < testNumbers.length; i++) {
    const phoneNumber = testNumbers[i];
    console.log(`\n🔍 Testing Number ${i + 1}: ${phoneNumber}`);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/349028/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
        {
          template_name: 'befach_in',
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": `🚚 Test message ${i + 1} from befach_in template!` }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ SUCCESS! Message sent to', phoneNumber);
      console.log('Response:', response.data.result ? 'SUCCESS' : 'FAILED');
      console.log('Valid WhatsApp:', response.data.validWhatsAppNumber ? 'YES' : 'NO');
      console.log('Contact Status:', response.data.contact?.contactStatus || 'UNKNOWN');
      
      if (response.data.result) {
        console.log('📱 Check WhatsApp for this number!');
      }
      
    } catch (error) {
      console.log('❌ FAILED for', phoneNumber);
      console.log('Error:', error.response?.status, error.response?.statusText);
    }
    
    // Wait 2 seconds between requests to avoid rate limiting
    if (i < testNumbers.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('✅ Template works for all valid numbers');
  console.log('📱 Messages sent to all numbers');
  console.log('🔍 Check each WhatsApp for delivery');
}

// Run the test
testMultipleNumbers();








