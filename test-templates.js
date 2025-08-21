require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkTemplates() {
  console.log('🧪 Checking Available WATI Templates...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  
  try {
    const response = await axios.get(
      'https://live-mt-server.wati.io/349028/api/v1/getMessageTemplates',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Templates Response Status:', response.status);
    console.log('✅ Templates Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && Array.isArray(response.data)) {
      console.log('\n📋 Available Templates:');
      response.data.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name} (${template.status})`);
        if (template.parameters) {
          console.log(`   Parameters: ${JSON.stringify(template.parameters)}`);
        }
      });
    } else {
      console.log('\n📋 Templates Data Structure:', typeof response.data);
      console.log('Data:', response.data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status);
    console.log('❌ Error Details:', error.response?.data || error.message);
  }
}

checkTemplates();
