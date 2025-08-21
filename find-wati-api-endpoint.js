// Find the correct WATI API endpoint
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function findWatiApiEndpoint() {
  console.log('🔍 Finding the Correct WATI API Endpoint\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const instanceId = process.env.WATI_INSTANCE_ID;
  
  console.log('🔑 API Key:', apiKey ? '✅ Present' : '❌ Missing');
  console.log('🆔 Instance ID:', instanceId);
  
  // Test different possible WATI API patterns
  const possibleEndpoints = [
    // Pattern 1: live-mt-server.wati.io/{instanceId}/api/v1
    `https://live-mt-server.wati.io/${instanceId}/api/v1`,
    
    // Pattern 2: live-server-{instanceId}.wati.io/api/v1
    `https://live-server-${instanceId}.wati.io/api/v1`,
    
    // Pattern 3: {instanceId}.wati.io/api/v1
    `https://${instanceId}.wati.io/api/v1`,
    
    // Pattern 4: api.wati.io/v1/{instanceId}
    `https://api.wati.io/v1/${instanceId}`,
    
    // Pattern 5: app.wati.io/api/v1/{instanceId}
    `https://app.wati.io/api/v1/${instanceId}`,
    
    // Pattern 6: wati.io/api/v1/{instanceId}
    `https://wati.io/api/v1/${instanceId}`,
    
    // Pattern 7: live.wati.io/api/v1/{instanceId}
    `https://live.wati.io/api/v1/${instanceId}`,
    
    // Pattern 8: live.wati.io/{instanceId}/api/v1 (what we tested)
    `https://live.wati.io/${instanceId}/api/v1`
  ];
  
  console.log('🌐 Testing Different WATI API Patterns:\n');
  
  for (let i = 0; i < possibleEndpoints.length; i++) {
    const endpoint = possibleEndpoints[i];
    console.log(`🔍 Test ${i + 1}: ${endpoint}`);
    
    try {
      // Try to get account info (this should work if endpoint is correct)
      const response = await axios.get(
        `${endpoint}/getAccountInfo`,
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
      console.log('🎉 This is the correct API endpoint!');
      console.log('📝 Update your .env.local to use this domain structure.');
      break;
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${error.response.status}: ${error.response.statusText}`);
        if (error.response.status === 404) {
          console.log('   → Endpoint not found (wrong URL structure)');
        } else if (error.response.status === 405) {
          console.log('   → Method not allowed (web dashboard, not API)');
        } else if (error.response.status === 401) {
          console.log('   → Unauthorized (wrong API key or endpoint)');
        }
      } else if (error.code === 'ENOTFOUND') {
        console.log('❌ DNS Error: Domain not found');
      } else {
        console.log('❌ Error:', error.message);
      }
    }
    
    if (i < possibleEndpoints.length - 1) {
      console.log('⏳ Waiting 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If any endpoint worked, use that URL structure');
  console.log('2. If all failed, check your WATI dashboard for the correct API URL');
  console.log('3. Contact WATI support for the correct API endpoint');
}

// Run the search
findWatiApiEndpoint();







