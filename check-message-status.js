// Check message delivery status
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkMessageStatus() {
  console.log('🔍 Checking Message Delivery Status\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  const testPhone = '+918802308802';
  
  console.log('📱 Checking status for phone:', testPhone);
  console.log('');
  
  try {
    // Get recent messages for this number
    console.log('🔍 Getting recent messages...');
    const response = await axios.get(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/getMessages/${testPhone}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Messages response:', response.data);
    
    if (response.data && response.data.messages && response.data.messages.items) {
      console.log(`📋 Found ${response.data.messages.items.length} messages`);
      
      response.data.messages.items.forEach((msg, index) => {
        console.log(`\n${index + 1}. Message ID: ${msg.id || 'N/A'}`);
        console.log(`   Full message object:`, JSON.stringify(msg, null, 2));
      });
    } else {
      console.log('❌ No messages found or unexpected response format');
      console.log('Response structure:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error getting messages:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data || error.message);
  }
  
  console.log('\n🎯 What this tells us:');
  console.log('1. If messages show as "sent" but not delivered: WhatsApp blocking');
  console.log('2. If no messages found: API issue or wrong endpoint');
  console.log('3. If messages show as "failed": Template/parameter issue');
}

checkMessageStatus();
