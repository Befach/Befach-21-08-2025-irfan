const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function getAllTemplates() {
  console.log('🔍 Getting All Available Templates from WATI...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
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
    
    console.log('✅ Templates retrieved successfully!');
    console.log(`📋 Total templates found: ${response.data.templates?.length || 0}\n`);
    
    if (response.data.templates && response.data.templates.length > 0) {
      console.log('📱 Available Templates:');
      console.log('='.repeat(80));
      
      response.data.templates.forEach((template, index) => {
        console.log(`${index + 1}. Template Name: ${template.name}`);
        console.log(`   Language: ${template.language}`);
        console.log(`   Status: ${template.status}`);
        console.log(`   Category: ${template.category || 'N/A'}`);
        console.log(`   Body: ${template.body?.substring(0, 100)}${template.body?.length > 100 ? '...' : ''}`);
        console.log(`   Header: ${template.header?.text || 'N/A'}`);
        console.log(`   Footer: ${template.footer?.text || 'N/A'}`);
        console.log(`   Buttons: ${template.buttons?.length || 0}`);
        console.log('');
      });
      
      // Categorize templates
      const utilityTemplates = response.data.templates.filter(t => 
        t.category === 'UTILITY' || 
        t.name.toLowerCase().includes('order') ||
        t.name.toLowerCase().includes('shipment') ||
        t.name.toLowerCase().includes('tracking') ||
        t.name.toLowerCase().includes('status') ||
        t.name.toLowerCase().includes('update')
      );
      
      const marketingTemplates = response.data.templates.filter(t => 
        t.category === 'MARKETING' || 
        t.name.toLowerCase().includes('welcome') ||
        t.name.toLowerCase().includes('promo') ||
        t.name.toLowerCase().includes('offer')
      );
      
      console.log('🎯 UTILITY Templates (Good for Shipment Updates):');
      console.log('-'.repeat(50));
      utilityTemplates.forEach(t => console.log(`✅ ${t.name} (${t.status})`));
      
      console.log('\n📢 MARKETING Templates:');
      console.log('-'.repeat(50));
      marketingTemplates.forEach(t => console.log(`📢 ${t.name} (${t.status})`));
      
    } else {
      console.log('❌ No templates found in your WATI account.');
    }
    
  } catch (error) {
    console.log('❌ Failed to get templates:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

getAllTemplates();

