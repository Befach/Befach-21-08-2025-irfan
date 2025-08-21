require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// Fix WhatsApp delivery issues
async function fixWhatsAppDelivery() {
  console.log('🔧 WhatsApp Delivery Fix Script Starting...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ Present' : '❌ Missing');
  
  if (!process.env.WATI_API_KEY || !process.env.WATI_INSTANCE_ID) {
    console.log('\n❌ Missing required environment variables. Please check your .env.local file.');
    return;
  }
  
  // Get user's phone number
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('\n📱 Please enter your phone number to test WhatsApp delivery:');
  console.log('Format: +91XXXXXXXXXX (replace XXXXXXXXXX with your 10-digit number)');
  
  rl.question('Phone number: ', async (phoneNumber) => {
    rl.close();
    
    if (!phoneNumber || phoneNumber === '+91XXXXXXXXXX') {
      console.log('❌ Please provide a valid phone number');
      return;
    }
    
    console.log(`\n📱 Testing with phone: ${phoneNumber}`);
    
    try {
      // Clean instance ID
      let instanceId = process.env.WATI_INSTANCE_ID;
      if (instanceId.includes('wati.io')) {
        const urlParts = instanceId.split('/');
        instanceId = urlParts[urlParts.length - 1];
      }
      
      const baseURL = `https://live-mt-server.wati.io/${instanceId}/api/v1`;
      console.log('🌐 Using base URL:', baseURL);
      
      // Step 1: Check available templates
      console.log('\n🔍 Step 1: Checking available templates...');
      await checkAvailableTemplates(baseURL);
      
      // Step 2: Try different template approaches
      console.log('\n🔍 Step 2: Trying different template approaches...');
      await tryDifferentTemplates(baseURL, phoneNumber);
      
      // Step 3: Test direct message
      console.log('\n🔍 Step 3: Testing direct message...');
      await testDirectMessage(baseURL, phoneNumber);
      
      // Step 4: Provide solutions
      console.log('\n🔍 Step 4: Providing solutions...');
      provideSolutions();
      
    } catch (error) {
      console.log('❌ Fix failed:', error.message);
    }
  });
}

async function checkAvailableTemplates(baseURL) {
  try {
    const response = await axios.get(`${baseURL}/getTemplates`, {
      headers: {
        'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.list) {
      console.log(`✅ Found ${response.data.list.length} templates:`);
      
      const approvedTemplates = [];
      const pendingTemplates = [];
      const rejectedTemplates = [];
      
      response.data.list.forEach(template => {
        if (template.status === 'APPROVED') {
          approvedTemplates.push(template.name);
          console.log(`  ✅ ${template.name} (APPROVED)`);
        } else if (template.status === 'PENDING') {
          pendingTemplates.push(template.name);
          console.log(`  ⏳ ${template.name} (PENDING)`);
        } else {
          rejectedTemplates.push(template.name);
          console.log(`  ❌ ${template.name} (${template.status})`);
        }
      });
      
      console.log(`\n📊 Summary:`);
      console.log(`  ✅ Approved: ${approvedTemplates.length}`);
      console.log(`  ⏳ Pending: ${pendingTemplates.length}`);
      console.log(`  ❌ Rejected/Other: ${rejectedTemplates.length}`);
      
      if (approvedTemplates.length === 0) {
        console.log('\n⚠️  WARNING: No approved templates found!');
        console.log('   This is why your messages are not being delivered.');
      }
      
    }
    
  } catch (error) {
    console.log('❌ Failed to get templates:', error.response?.data || error.message);
  }
}

async function tryDifferentTemplates(baseURL, phoneNumber) {
  // Try different template names that might exist
  const possibleTemplates = [
    'befach_import_export',
    'logistic',
    'requirement_received_state',
    'documentation_chech_state',
    'pending_specs_state',
    'hello_world',
    'sample_shipping_confirmation',
    'sample_shipping_confirmation_1',
    'sample_shipping_confirmation_2'
  ];
  
  console.log('🔄 Trying different template names...');
  
  for (const templateName of possibleTemplates) {
    try {
      console.log(`\n📤 Trying template: ${templateName}`);
      
      const response = await axios.post(
        `${baseURL}/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
        {
          template_name: templateName,
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
      
      console.log('📤 Response:', response.data);
      
      if (response.data.result === true) {
        console.log(`✅ SUCCESS! Template ${templateName} worked!`);
        console.log('📱 Check your phone for the message');
        return true;
      } else {
        console.log(`❌ Template ${templateName} failed:`, response.data.info || 'Unknown error');
      }
      
    } catch (error) {
      console.log(`❌ Template ${templateName} error:`, error.response?.data || error.message);
    }
  }
  
  console.log('❌ All templates failed');
  return false;
}

async function testDirectMessage(baseURL, phoneNumber) {
  try {
    console.log('📤 Testing direct message...');
    
    const response = await axios.post(
      `${baseURL}/sendSessionMessage`,
      {
        whatsappNumber: phoneNumber,
        messageText: "🔍 Test message from your shipment tracker. If you receive this, WhatsApp integration is working!"
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('📤 Direct Message Response:', response.data);
    
    if (response.data.result === true) {
      console.log('✅ Direct message sent successfully!');
      console.log('📱 Check your phone for the message');
      return true;
    } else {
      console.log('❌ Direct message failed:', response.data.info || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Direct message test failed:', error.response?.data || error.message);
  }
  
  return false;
}

function provideSolutions() {
  console.log('\n🔧 SOLUTIONS TO FIX WHATSAPP DELIVERY:');
  console.log('\n1. 📋 TEMPLATE APPROVAL ISSUE:');
  console.log('   - Your templates are not approved by WhatsApp');
  console.log('   - Contact WATI support to get templates approved');
  console.log('   - Or use pre-approved templates from WATI');
  
  console.log('\n2. 📱 PHONE NUMBER ISSUE:');
  console.log('   - Ensure phone number is registered with WhatsApp');
  console.log('   - Use correct country code format (+91XXXXXXXXXX)');
  console.log('   - Test with a different phone number');
  
  console.log('\n3. 🏢 WATI ACCOUNT ISSUE:');
  console.log('   - Your WATI account might not be fully activated');
  console.log('   - Check WATI dashboard for account status');
  console.log('   - Contact WATI support for account activation');
  
  console.log('\n4. 🔑 API CONFIGURATION:');
  console.log('   - Verify WATI_API_KEY is correct');
  console.log('   - Verify WATI_INSTANCE_ID is correct');
  console.log('   - Check if API key has proper permissions');
  
  console.log('\n5. 🚀 IMMEDIATE WORKAROUND:');
  console.log('   - Use direct messages instead of templates');
  console.log('   - Switch to WhatsApp Cloud API (free tier)');
  console.log('   - Use email notifications as backup');
  
  console.log('\n📞 NEXT STEPS:');
  console.log('1. Contact WATI support about template approval');
  console.log('2. Check your WATI dashboard for account status');
  console.log('3. Try the direct message approach');
  console.log('4. Consider switching to WhatsApp Cloud API');
}

// Run the fix
fixWhatsAppDelivery();

