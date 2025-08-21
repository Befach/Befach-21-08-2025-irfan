const axios = require('axios');

// Debug WhatsApp delivery issues
async function debugWhatsAppDelivery() {
  console.log('🔍 Starting WhatsApp Delivery Debug...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ Present' : '❌ Missing');
  
  if (!process.env.WATI_API_KEY || !process.env.WATI_INSTANCE_ID) {
    console.log('\n❌ Missing required environment variables. Please check your .env file.');
    return;
  }
  
  // Test phone number (replace with your actual number)
  const testPhone = '+919876543210'; // Replace with your actual number
  console.log('\n📱 Test Phone Number:', testPhone);
  
  try {
    // 1. Check WATI account status
    console.log('\n🔍 Step 1: Checking WATI Account Status...');
    await checkWatiAccountStatus();
    
    // 2. Get available templates
    console.log('\n🔍 Step 2: Getting Available Templates...');
    await getAvailableTemplates();
    
    // 3. Test template message
    console.log('\n🔍 Step 3: Testing Template Message...');
    await testTemplateMessage(testPhone);
    
    // 4. Test direct message
    console.log('\n🔍 Step 4: Testing Direct Message...');
    await testDirectMessage(testPhone);
    
  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
  }
}

async function checkWatiAccountStatus() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    let cleanInstanceId = instanceId;
    
    // Clean instance ID if it's a full URL
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      cleanInstanceId = urlParts[urlParts.length - 1];
    }
    
    const baseURL = `https://live-mt-server.wati.io/${cleanInstanceId}/api/v1`;
    const response = await axios.get(`${baseURL}/getTemplates`, {
      headers: {
        'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ WATI API connection successful');
    console.log('📊 Response status:', response.status);
    
    if (response.data && response.data.list) {
      console.log(`📋 Found ${response.data.list.length} templates`);
    }
    
  } catch (error) {
    console.log('❌ WATI API connection failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 Authentication failed - check your API key');
    } else if (error.response?.status === 403) {
      console.log('🚫 Access forbidden - account might not be activated');
    } else if (error.response?.status === 404) {
      console.log('🔍 Instance not found - check your instance ID');
    }
  }
}

async function getAvailableTemplates() {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    let cleanInstanceId = instanceId;
    
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      cleanInstanceId = urlParts[urlParts.length - 1];
    }
    
    const baseURL = `https://live-mt-server.wati.io/${cleanInstanceId}/api/v1`;
    const response = await axios.get(`${baseURL}/getTemplates`, {
      headers: {
        'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.list) {
      console.log('📋 Available Templates:');
      response.data.list.forEach((template, index) => {
        console.log(`  ${index + 1}. ${template.name} (${template.status})`);
        if (template.status === 'APPROVED') {
          console.log(`     ✅ Approved - can be used`);
        } else {
          console.log(`     ❌ Status: ${template.status}`);
        }
      });
    }
    
  } catch (error) {
    console.log('❌ Failed to get templates:', error.message);
  }
}

async function testTemplateMessage(phoneNumber) {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    let cleanInstanceId = instanceId;
    
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      cleanInstanceId = urlParts[urlParts.length - 1];
    }
    
    const baseURL = `https://live-mt-server.wati.io/${cleanInstanceId}/api/v1`;
    
    // Try the logistic template first
    console.log('📤 Testing logistic template...');
    const templateResponse = await axios.post(
      `${baseURL}/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      {
        template_name: 'logistic',
        broadcast_name: "Befach Logistics",
        parameters: [
          { name: "1", value: "Test Customer" },
          { name: "2", value: "Test Shipment" },
          { name: "3", value: "TEST-123" },
          { name: "4", value: "Test Status" },
          { name: "5", value: "Test Origin" },
          { name: "6", value: "Test Destination" },
          { name: "7", value: "https://example.com/track" }
        ]
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
    } else {
      console.log('❌ Template message failed:', templateResponse.data.info || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Template message test failed:', error.response?.data || error.message);
    
    // Try fallback templates
    await tryFallbackTemplates(phoneNumber);
  }
}

async function tryFallbackTemplates(phoneNumber) {
  const fallbackTemplates = [
    'befach_import_export',
    'requirement_received_state',
    'documentation_chech_state',
    'pending_specs_state'
  ];
  
  console.log('\n🔄 Trying fallback templates...');
  
  for (const template of fallbackTemplates) {
    try {
      console.log(`📤 Trying template: ${template}`);
      
      const instanceId = process.env.WATI_INSTANCE_ID;
      let cleanInstanceId = instanceId;
      
      if (instanceId.includes('wati.io')) {
        const urlParts = instanceId.split('/');
        cleanInstanceId = urlParts[urlParts.length - 1];
      }
      
      const baseURL = `https://live-mt-server.wati.io/${cleanInstanceId}/api/v1`;
      
      const response = await axios.post(
        `${baseURL}/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
        {
          template_name: template,
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
      
      if (response.data.result === true) {
        console.log(`✅ Template ${template} worked!`);
        return;
      } else {
        console.log(`❌ Template ${template} failed:`, response.data.info || 'Unknown error');
      }
      
    } catch (error) {
      console.log(`❌ Template ${template} error:`, error.message);
    }
  }
  
  console.log('❌ All fallback templates failed');
}

async function testDirectMessage(phoneNumber) {
  try {
    const instanceId = process.env.WATI_INSTANCE_ID;
    let cleanInstanceId = instanceId;
    
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      cleanInstanceId = urlParts[urlParts.length - 1];
    }
    
    const baseURL = `https://live-mt-server.wati.io/${cleanInstanceId}/api/v1`;
    
    console.log('📤 Testing direct message...');
    const response = await axios.post(
      `${baseURL}/sendSessionMessage`,
      {
        whatsappNumber: phoneNumber,
        messageText: "🔍 This is a test message from your shipment tracker. If you receive this, WhatsApp integration is working!"
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
    } else {
      console.log('❌ Direct message failed:', response.data.info || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Direct message test failed:', error.response?.data || error.message);
  }
}

// Run the debug
debugWhatsAppDelivery();

