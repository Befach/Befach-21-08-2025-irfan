const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking WATI Templates');
console.log('==========================');

async function checkTemplates() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('📱 Instance ID:', instanceId);
    
    // Get all templates
    console.log('\n📋 Getting all templates...');
    
    const response = await axios.get(`https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Response received');
    console.log('📊 Response data:', response.data);
    
    // Check if response.data is an array
    if (!Array.isArray(response.data)) {
      console.log('❌ Response is not an array:', typeof response.data);
      return;
    }
    
    console.log(`✅ Found ${response.data.length} templates`);
    
    // Look for logistic template
    const logisticTemplate = response.data.find(t => t.name === 'logistic');
    
    if (logisticTemplate) {
      console.log('\n✅ LOGISTIC TEMPLATE FOUND:');
      console.log('   Name:', logisticTemplate.name);
      console.log('   Status:', logisticTemplate.status);
      console.log('   Category:', logisticTemplate.category);
      console.log('   Language:', logisticTemplate.language);
      
      if (logisticTemplate.status !== 'APPROVED') {
        console.log('❌ Template is not approved! Status:', logisticTemplate.status);
        console.log('💡 You need to get it approved by WhatsApp first');
      }
    } else {
      console.log('\n❌ LOGISTIC TEMPLATE NOT FOUND!');
      console.log('💡 You need to create the logistic template in WATI dashboard');
      
      console.log('\n📋 Available templates:');
      response.data.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.name} (${template.status}) - ${template.category}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Failed to check templates:');
    console.log('   Status:', error.response?.status);
    console.log('   Data:', error.response?.data);
    console.log('   Message:', error.message);
  }
}

checkTemplates().catch(console.error);
