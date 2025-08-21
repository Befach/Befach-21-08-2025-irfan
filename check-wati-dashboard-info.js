// Check WATI dashboard information and API endpoints
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function checkWatiDashboardInfo() {
  console.log('🔍 Checking WATI Dashboard Information\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('🔑 API Key:', apiKey ? '✅ Present' : '❌ Missing');
  console.log('🆔 Instance ID:', instanceId);
  
  // Test different possible WATI domains
  const possibleDomains = [
    `https://live-mt-server.wati.io/${instanceId}/api/v1`,
    `https://live-server-${instanceId}.wati.io/api/v1`,
    `https://live.wati.io/${instanceId}/api/v1`,
    `https://app.wati.io/api/v1`,
    `https://api.wati.io/v1`
  ];
  
  console.log('\n🌐 Testing Different WATI API Endpoints:\n');
  
  for (let i = 0; i < possibleDomains.length; i++) {
    const domain = possibleDomains[i];
    console.log(`🔍 Test ${i + 1}: ${domain}`);
    
    try {
      // Try to get account info
      const response = await axios.get(
        `${domain}/getAccountInfo`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ SUCCESS! Account info received');
      console.log('Status:', response.data.status || 'Unknown');
      console.log('Account:', response.data.account || 'Unknown');
      console.log('🎉 This domain works! Use this for your API calls.');
      break;
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${error.response.status}: ${error.response.statusText}`);
        if (error.response.data) {
          console.log('Error:', JSON.stringify(error.response.data, null, 2));
        }
      } else if (error.code === 'ENOTFOUND') {
        console.log('❌ DNS Error: Domain not found');
      } else {
        console.log('❌ Error:', error.message);
      }
    }
    
    if (i < possibleDomains.length - 1) {
      console.log('⏳ Waiting 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If any domain worked, update your .env.local file');
  console.log('2. If all failed, check your WATI dashboard account status');
  console.log('3. Contact WATI support if account is not active');
}

// Run the check
checkWatiDashboardInfo();







