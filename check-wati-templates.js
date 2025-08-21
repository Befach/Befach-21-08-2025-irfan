require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkWatiTemplates() {
  console.log('🔍 Checking available WATI templates...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  
  try {
    console.log('Fetching templates from WATI...');
    
    const response = await axios.get(
      'https://live-mt-server.wati.io/349028/api/v1/getMessageTemplates',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Found templates:');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.templates) {
      console.log('\n📋 Available Templates:');
      response.data.templates.forEach((template, index) => {
        console.log(`${index + 1}. Name: ${template.name || 'N/A'}`);
        console.log(`   Status: ${template.status || 'N/A'}`);
        console.log(`   Language: ${template.language || 'N/A'}`);
        console.log(`   Category: ${template.category || 'N/A'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log('Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    console.log('Full Error:', error.message);
  }
}

checkWatiTemplates();

