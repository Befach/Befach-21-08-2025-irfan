require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

console.log('🔍 Testing WATI API Endpoints');
console.log('==============================');

const apiKey = process.env.WATI_API_KEY;
const instanceId = process.env.WATI_INSTANCE_ID;
const fullUrl = process.env.WATI_INSTANCE;

console.log('🔑 Environment:');
console.log('API Key:', apiKey ? 'Present' : 'Missing');
console.log('Instance ID:', instanceId);
console.log('Full URL:', fullUrl);

// Test different endpoint structures
const endpoints = [
  `https://live-mt-server.wati.io/${instanceId}`,
  `https://live-mt-server.wati.io/${instanceId}/api`,
  `https://live-mt-server.wati.io/${instanceId}/api/v1`,
  `https://live-mt-server.wati.io/${instanceId}/v1`,
  fullUrl,
  `${fullUrl}/api`,
  `${fullUrl}/api/v1`
];

async function testEndpoint(baseUrl, endpointName) {
  console.log(`\n🔍 Testing: ${endpointName}`);
  console.log(`   URL: ${baseUrl}`);
  
  try {
    // Test 1: Get templates
    const templatesUrl = `${baseUrl}/getMessageTemplates`;
    console.log(`   📋 Testing: ${templatesUrl}`);
    
    const response = await axios.get(templatesUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`   ✅ SUCCESS! Status: ${response.status}`);
    console.log(`   📊 Templates found: ${response.data?.length || 0}`);
    return { success: true, url: baseUrl, templates: response.data?.length || 0 };
    
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.response?.status || 'No response'} - ${error.message}`);
    return { success: false, url: baseUrl, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log('\n🚀 Testing all endpoint variations...\n');
  
  const results = [];
  
  for (let i = 0; i < endpoints.length; i++) {
    const result = await testEndpoint(endpoints[i], `Endpoint ${i + 1}`);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎯 WORKING ENDPOINTS:');
    successful.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.url} (${result.templates} templates)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n🚫 FAILED ENDPOINTS:');
    failed.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.url} - ${result.error}`);
    });
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (successful.length > 0) {
    console.log('✅ Use one of the working endpoints above');
    console.log('✅ Update your .env.local with the working URL');
  } else {
    console.log('❌ No working endpoints found');
    console.log('🔍 Check your WATI account configuration');
    console.log('📞 Contact WATI support for correct API endpoints');
  }
}

testAllEndpoints().catch(console.error);

