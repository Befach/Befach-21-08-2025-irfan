// Test the new befach_import_export template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testNewBefachTemplate() {
  console.log('🧪 Testing New befach_import_export Template\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  const testPhone = process.argv[2] || '+918802308802';
  
  // Use the new template that was just created
  const templateName = 'befach_import_export';
  
  console.log('📱 Testing with phone:', testPhone);
  console.log('🔧 Template:', templateName);
  console.log('💡 To test with your number: node test-new-befach-template.js YOUR_PHONE_NUMBER');
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
      console.log('🎉 SUCCESS! New template message sent successfully!');
      console.log('Check your WhatsApp now! 📱');
      console.log('');
      console.log('🎯 This means your new template is working!');
      console.log('   You can now use this for shipment notifications.');
    } else {
      console.log('⚠️  API returned result: false');
      console.log('Info:', response.data.info);
      console.log('');
      console.log('🔍 This might need template approval or have other issues.');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data || error.message);
  }
  
  console.log('\n🎯 What to check:');
  console.log('1. Check your WhatsApp for the test message');
  console.log('2. If received: New template is working! 🎉');
  console.log('3. If not received: Check template approval status in WATI dashboard');
}

testNewBefachTemplate();





