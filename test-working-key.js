// Test with Working API Key from curl command
const axios = require('axios');

async function testWorkingKey() {
  console.log('🧪 Testing with Working API Key\n');
  
  // Use the working API key from your curl command
  const workingApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTYwY2Q2NS00NDAyLTQ1M2EtODU2ZC04YmQ3MjhlYjIyYWIiLCJ1bmlxdWVfbmFtZSI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwibmFtZWlkIjoibWFya2V0aW5nQGJlZmFjaC5jb20iLCJlbWFpbCI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwiYXV0aF90aW1lIjoiMDgvMDcvMjAyNSAxMzoxMjozOCIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJUUklBTCIsIlRSSUFMUEFJRCJdLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.BYlXlIl6pRiStNEl5vx8FJUlKjG2ePNzY3MWHUUFFX4';
  
  const testPhone = '919182992530';
  const apiUrl = `https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`;
  
  console.log('🌐 API URL:', apiUrl);
  console.log('📱 Test Phone:', testPhone);
  console.log('🔑 Using working API key from curl command');
  console.log('');
  
  try {
    console.log('🚀 Making API call with working key...');
    
    const response = await axios.post(apiUrl, {
      template_name: 'befach_in',
      broadcast_name: "Befach Logistics",
      parameters: [
        { "1": "🧪 Test message with working API key!" }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${workingApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS with working API key!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    console.log('📱 Check your WhatsApp for the message!');
    
  } catch (error) {
    console.log('❌ Failed even with working API key:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 401 Error Analysis:');
      console.log('1. API key might be expired');
      console.log('2. Account permissions issue');
      console.log('3. WATI server issue');
    }
  }
}

// Run the test
testWorkingKey().catch(console.error);






