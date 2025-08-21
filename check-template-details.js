// Get detailed information about the befach_international template
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkTemplateDetails() {
  console.log('🔍 Getting Detailed Template Information\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = '349028';
  
  try {
    const response = await axios.get(
      `https://live-mt-server.wati.io/${instanceId}/api/v1/getMessageTemplates`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.templates) {
      // Find the befach_international template
      const befachTemplate = response.data.templates.find(t => 
        t.elementName === 'befach_international' && t.status === 'APPROVED'
      );
      
      if (befachTemplate) {
        console.log('✅ Found befach_international template:');
        console.log('ID:', befachTemplate.id);
        console.log('Status:', befachTemplate.status);
        console.log('Category:', befachTemplate.category);
        console.log('Language:', befachTemplate.language);
        console.log('');
        
        if (befachTemplate.body) {
          console.log('📝 Template Body:');
          console.log(befachTemplate.body);
          console.log('');
        }
        
        if (befachTemplate.bodyOriginal) {
          console.log('📝 Original Body:');
          console.log(befachTemplate.bodyOriginal);
          console.log('');
        }
        
        if (befachTemplate.customParams && befachTemplate.customParams.length > 0) {
          console.log('🔧 Custom Parameters:');
          console.log(befachTemplate.customParams);
          console.log('');
        }
        
        // Check if there are any validation issues
        console.log('🔍 Template Analysis:');
        if (befachTemplate.body && befachTemplate.body.includes('{{1}}')) {
          console.log('✅ Template uses {{1}} parameter');
        } else {
          console.log('❌ Template does not use {{1}} parameter');
        }
        
        if (befachTemplate.body && befachTemplate.body.includes('{{name}}')) {
          console.log('✅ Template uses {{name}} parameter');
        } else {
          console.log('❌ Template does not use {{name}} parameter');
        }
        
      } else {
        console.log('❌ befach_international template not found or not approved');
        
        // Show all available templates
        console.log('\n📋 Available templates:');
        response.data.templates.forEach((template, index) => {
          if (template.status === 'APPROVED') {
            console.log(`${index + 1}. ${template.elementName} (${template.status})`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

checkTemplateDetails();





