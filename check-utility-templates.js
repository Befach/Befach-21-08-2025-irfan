require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkUtilityTemplates() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔍 Checking Utility Templates...');
    console.log('================================');
    console.log('🔑 Instance ID:', instanceId);
    console.log('🔑 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Utility templates are usually in /api/v2
    console.log('\n📋 Checking /api/v2 for utility templates...');
    
    try {
      const response = await axios.get(`https://live-mt-server.wati.io/${instanceId}/api/v2/getMessageTemplates`, {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data) {
        const templates = response.data.data;
        console.log(`✅ Found ${templates.length} templates in /api/v2:`);
        
        // Filter for utility templates
        const utilityTemplates = templates.filter(template => 
          template.category === 'utility' || 
          template.category === 'transactional' ||
          template.name.includes('status') ||
          template.name.includes('update') ||
          template.name.includes('notification')
        );
        
        console.log('\n🟢 Utility/Transactional Templates:');
        if (utilityTemplates.length > 0) {
          utilityTemplates.forEach((template, index) => {
            console.log(`  ${index + 1}. ${template.name} - Status: ${template.status} - Category: ${template.category}`);
          });
        } else {
          console.log('  ❌ No utility templates found');
        }
        
        console.log('\n🔵 All Available Templates:');
        templates.forEach((template, index) => {
          console.log(`  ${index + 1}. ${template.name} - Status: ${template.status} - Category: ${template.category}`);
        });
        
      } else {
        console.log('❌ No templates found');
      }
      
    } catch (error) {
      console.log('❌ Error checking /api/v2:', error.response?.status, error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking templates:', error.message);
  }
}

checkUtilityTemplates();

