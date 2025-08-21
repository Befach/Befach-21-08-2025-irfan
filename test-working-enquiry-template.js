// Test with the working enquiry template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWorkingEnquiryTemplate() {
  console.log('🧪 Testing Working Enquiry Template\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  const testPhone = '+918802308802';
  
  // Use the template that we know works
  const templateName = 'enquiry_followup_message_template';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('🔧 Template:', templateName);
  console.log('');
  
  try {
    const response = await axios.post(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${testPhone}`,
      {
        template_name: templateName,
        broadcast_name: "Befach Logistics",
        parameters: [] // This template has no parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Response:', response.data);
    
    if (response.data.result === true) {
      console.log('🎉 SUCCESS! Template message sent successfully!');
      console.log('Check your WhatsApp now! 📱');
    } else {
      console.log('⚠️  API returned result: false');
      console.log('Info:', response.data.info);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data || error.message);
  }
}

testWorkingEnquiryTemplate();





