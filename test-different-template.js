require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testDifferentTemplate() {
  try {
    const phone = '919182992530';
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔍 Testing Different Template...');
    console.log('================================');
    console.log('📱 Phone:', phone);
    console.log('🔑 Instance ID:', instanceId);
    
    // Try with a simple template that might work
    const templates = [
      'hii',                    // Simple greeting template
      'welcome',                // Welcome template
      'test',                   // Test template
      'notification'            // Notification template
    ];
    
    for (const templateName of templates) {
      console.log(`\n📤 Testing template: ${templateName}`);
      
      try {
        const response = await axios.post(`https://live-mt-server.wati.io/${instanceId}/api/v2/sendTemplateMessage?whatsappNumber=+${phone}`, {
          template_name: templateName,
          broadcast_name: "Befach Logistics",
          parameters: []
        }, {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Template sent successfully!');
        console.log('📱 Response:', response.data);
        
        if (response.data.result === true) {
          console.log(`🎉 ${templateName} template works!`);
          console.log('📱 Check your phone for the message');
          return; // Stop on first success
        }
        
      } catch (error) {
        console.log(`❌ ${templateName} failed:`, error.response?.status, error.response?.data?.error || error.message);
      }
    }
    
    console.log('\n❌ All templates failed. The issue is likely account-wide.');
    
  } catch (error) {
    console.error('❌ Error testing templates:', error.message);
  }
}

testDifferentTemplate();
