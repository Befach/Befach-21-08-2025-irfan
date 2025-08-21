// Comprehensive WATI delivery debug script
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function debugWatiDelivery() {
  console.log('🔍 WATI Message Delivery Debug\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ SET' : '❌ MISSING');
  console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ SET' : '❌ MISSING');
  console.log('');
  
  if (!process.env.WATI_API_KEY || !process.env.WATI_INSTANCE_ID) {
    console.log('❌ Missing environment variables. Cannot proceed.');
    return;
  }
  
  const testPhone = '9182992530';
  const formattedPhone = testPhone.startsWith('+') ? testPhone : `+${testPhone}`;
  
  console.log('📱 Test Phone:', testPhone);
  console.log('📱 Formatted Phone:', formattedPhone);
  console.log('');
  
  try {
    // Step 1: Check if phone number is valid in WATI
    console.log('🔍 Step 1: Validating phone number in WATI...');
    
    const validationResponse = await axios.get(
      `https://live-mt-server.wati.io/349028/getContact/${formattedPhone}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Phone validation response:');
    console.log('Contact ID:', validationResponse.data?.id);
    console.log('Contact Status:', validationResponse.data?.contactStatus);
    console.log('WhatsApp Number Valid:', validationResponse.data?.validWhatsAppNumber);
    console.log('Opted In:', validationResponse.data?.optedIn);
    console.log('');
    
    // Step 2: Check available templates
    console.log('🔍 Step 2: Checking available templates...');
    
    const templatesResponse = await axios.get(
      'https://live-mt-server.wati.io/349028/getTemplates',
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Available templates:');
    if (templatesResponse.data?.templates) {
      templatesResponse.data.templates.forEach(template => {
        console.log(`- ${template.name}: ${template.status}`);
      });
    } else {
      console.log('No templates found');
    }
    console.log('');
    
    // Step 3: Send a simple test message
    console.log('🔍 Step 3: Sending test message...');
    
    const testMessage = {
      messageText: `🔍 Test message from WATI API - ${new Date().toISOString()}`
    };
    
    const sendResponse = await axios.post(
      `https://live-mt-server.wati.io/349028/api/v1/sendSessionMessage/${formattedPhone}`,
      testMessage,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Send response:');
    console.log('Result:', sendResponse.data?.result);
    console.log('Info:', sendResponse.data?.info);
    console.log('Message ID:', sendResponse.data?.id);
    console.log('');
    
    // Step 4: Check message status if we have a message ID
    if (sendResponse.data?.id) {
      console.log('🔍 Step 4: Checking message status...');
      
      // Wait a bit for message to be processed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const statusResponse = await axios.get(
          `https://live-mt-server.wati.io/349028/getMessageStatus/${sendResponse.data.id}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('✅ Message status:');
        console.log('Status:', statusResponse.data?.status);
        console.log('Details:', statusResponse.data);
      } catch (statusError) {
        console.log('❌ Could not check message status:', statusError.message);
      }
    }
    
    // Step 5: Check WATI instance status
    console.log('\n🔍 Step 5: Checking WATI instance status...');
    
    try {
      const instanceResponse = await axios.get(
        'https://live-mt-server.wati.io/349028/getInstanceStatus',
        {
          headers: {
            'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Instance status:');
      console.log('Status:', instanceResponse.data?.status);
      console.log('Details:', instanceResponse.data);
    } catch (instanceError) {
      console.log('❌ Could not check instance status:', instanceError.message);
    }
    
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Check if your WATI instance is active and approved');
    console.log('2. Verify the phone number is registered on WhatsApp');
    console.log('3. Check if you need to send a template message first');
    console.log('4. Verify your WATI account has sufficient credits');
    console.log('5. Check WATI dashboard for any error messages');
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

debugWatiDelivery();








