// Comprehensive WATI status check
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function checkWatiStatus() {
  console.log('🔍 Comprehensive WATI Status Check\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey || !instanceId) {
    console.log('❌ Missing environment variables');
    return;
  }
  
  try {
    // 1. Check instance status
    console.log('📋 1. Checking WATI Instance Status...');
    try {
      const instanceResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/getInstanceStatus',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Instance Status:');
      console.log('Status:', instanceResponse.data?.status);
      console.log('Details:', JSON.stringify(instanceResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Could not get instance status:', error.message);
    }
    
    console.log('');
    
    // 2. Check available templates
    console.log('📋 2. Checking Available Templates...');
    try {
      const templatesResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/getTemplates',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Templates:');
      if (templatesResponse.data?.templates) {
        templatesResponse.data.templates.forEach(template => {
          console.log(`- ${template.name}: ${template.status} (${template.language})`);
        });
      } else {
        console.log('No templates found');
      }
    } catch (error) {
      console.log('❌ Could not get templates:', error.message);
    }
    
    console.log('');
    
    // 3. Check account/credits
    console.log('📋 3. Checking Account Information...');
    try {
      const accountResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/getAccountInfo',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Account Info:');
      console.log('Details:', JSON.stringify(accountResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Could not get account info:', error.message);
    }
    
    console.log('');
    
    // 4. Check if phone number is in contacts
    console.log('📋 4. Checking Phone Number in Contacts...');
    try {
      const contactResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/getContacts',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Contacts:');
      if (contactResponse.data?.contacts) {
        const targetContact = contactResponse.data.contacts.find(
          contact => contact.phone === '9182992530' || contact.phone === '+9182992530'
        );
        
        if (targetContact) {
          console.log('✅ Found contact:', targetContact);
        } else {
          console.log('❌ Phone number not found in contacts');
        }
      } else {
        console.log('No contacts found');
      }
    } catch (error) {
      console.log('❌ Could not get contacts:', error.message);
    }
    
    console.log('\n💡 Troubleshooting Steps:');
    console.log('1. Check your WATI dashboard at https://wati.io');
    console.log('2. Verify your instance is approved and active');
    console.log('3. Check if you have sufficient credits');
    console.log('4. Verify the befach_in template is approved by WhatsApp');
    console.log('5. Try sending a message from WATI dashboard first');
    console.log('6. Check if your phone number is registered on WhatsApp');
    console.log('7. Verify your WATI instance is connected to WhatsApp Business API');
    
  } catch (error) {
    console.error('❌ Main error:', error.message);
  }
}

checkWatiStatus();








