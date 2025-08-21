require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// Quick WhatsApp test - replace with your actual phone number
const testPhone = '+91XXXXXXXXXX'; // ⚠️ REPLACE XXXXXXXXXX WITH YOUR ACTUAL 10-DIGIT PHONE NUMBER

async function quickWhatsAppTest() {
  console.log('🚀 Quick WhatsApp Test Starting...\n');
  
  // Check if we have the required environment variables
  if (!process.env.WATI_API_KEY) {
    console.log('❌ WATI_API_KEY not found in environment variables');
    console.log('💡 Make sure you have a .env file with your WATI credentials');
    return;
  }
  
  if (!process.env.WATI_INSTANCE_ID) {
    console.log('❌ WATI_INSTANCE_ID not found in environment variables');
    console.log('💡 Make sure you have a .env file with your WATI instance ID');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log('📱 Testing with phone:', testPhone);
  console.log('🔑 API Key:', process.env.WATI_API_KEY.substring(0, 10) + '...');
  console.log('🏢 Instance ID:', process.env.WATI_INSTANCE_ID);
  
  try {
    // Clean instance ID
    let instanceId = process.env.WATI_INSTANCE_ID;
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      instanceId = urlParts[urlParts.length - 1];
    }
    
    const baseURL = `https://live-mt-server.wati.io/${instanceId}/api/v1`;
    console.log('\n🌐 Using base URL:', baseURL);
    
    // Test 1: Check account status
    console.log('\n🔍 Test 1: Checking account status...');
    try {
      const statusResponse = await axios.get(`${baseURL}/getTemplates`, {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statusResponse.data && statusResponse.data.list) {
        console.log(`✅ Account active - found ${statusResponse.data.list.length} templates`);
        
        // Show template statuses
        statusResponse.data.list.forEach(template => {
          const status = template.status === 'APPROVED' ? '✅' : '❌';
          console.log(`  ${status} ${template.name} (${template.status})`);
        });
      }
    } catch (error) {
      console.log('❌ Account check failed:', error.response?.status, error.response?.data?.message || error.message);
    }
    
    // Test 2: Try sending a simple template message
    console.log('\n📤 Test 2: Trying to send template message...');
    try {
      const templateResponse = await axios.post(
        `${baseURL}/sendTemplateMessage?whatsappNumber=${testPhone}`,
        {
          template_name: 'befach_import_export',
          broadcast_name: "Befach Logistics",
          parameters: []
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('📤 Template Response:', templateResponse.data);
      
      if (templateResponse.data.result === true) {
        console.log('✅ Template message sent successfully!');
        console.log('📱 Check your phone for the message');
      } else {
        console.log('❌ Template message failed:', templateResponse.data.info || 'Unknown error');
      }
      
    } catch (error) {
      console.log('❌ Template message failed:', error.response?.data || error.message);
      
      // Try direct message as fallback
      console.log('\n🔄 Trying direct message as fallback...');
      try {
        const directResponse = await axios.post(
          `${baseURL}/sendSessionMessage`,
          {
            whatsappNumber: testPhone,
            messageText: "🔍 Test message from your shipment tracker. If you receive this, WhatsApp integration is working!"
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('📤 Direct Message Response:', directResponse.data);
        
        if (directResponse.data.result === true) {
          console.log('✅ Direct message sent successfully!');
          console.log('📱 Check your phone for the message');
        } else {
          console.log('❌ Direct message failed:', directResponse.data.info || 'Unknown error');
        }
        
      } catch (directError) {
        console.log('❌ Direct message also failed:', directError.response?.data || directError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
  
  console.log('\n🔍 Troubleshooting Tips:');
  console.log('1. Make sure your phone number is correct and includes country code');
  console.log('2. Check if your WATI account is activated and approved');
  console.log('3. Verify your templates are approved by WhatsApp');
  console.log('4. Check if your phone number is registered with WhatsApp');
  console.log('5. Look for any error messages in the console above');
}

// Run the test
quickWhatsAppTest();
