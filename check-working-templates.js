require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkWorkingTemplates() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    const apiKey = process.env.WATI_API_KEY;
    
    console.log('🔍 Checking Available WATI Templates...');
    console.log('=====================================');
    console.log('🔑 Instance ID:', instanceId);
    console.log('🔑 API Key:', apiKey ? 'Present' : 'Missing');
    
    // Check templates in both API versions
    const apiVersions = ['/api/v1', '/api/v2'];
    
    for (const apiVersion of apiVersions) {
      console.log(`\n📋 Checking ${apiVersion} templates...`);
      
      try {
        const response = await axios.get(`https://live-mt-server.wati.io/${instanceId}${apiVersion}/getMessageTemplates`, {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.data) {
          const templates = response.data.data;
          console.log(`✅ Found ${templates.length} templates in ${apiVersion}:`);
          
          templates.forEach((template, index) => {
            const status = template.status || 'Unknown';
            const category = template.category || 'Unknown';
            console.log(`  ${index + 1}. ${template.name} - Status: ${status} - Category: ${category}`);
          });
        } else {
          console.log(`❌ No templates found in ${apiVersion}`);
        }
        
      } catch (error) {
        console.log(`❌ Error checking ${apiVersion}:`, error.response?.status, error.response?.data?.message || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking templates:', error.message);
  }
}

checkWorkingTemplates();

