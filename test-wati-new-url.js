// Test script for updated WATI service with correct URL structure
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testWatiNewURL() {
  console.log('🧪 Testing Updated WATI Service with Correct URL Structure\n');
  
  const apiKey = process.env.WATI_API_KEY;
  let instanceId = process.env.WATI_INSTANCE_ID;
  
  if (!apiKey || !instanceId) {
    console.log('❌ Missing environment variables:');
    console.log('WATI_API_KEY:', apiKey ? '✅ SET' : '❌ MISSING');
    console.log('WATI_INSTANCE_ID:', instanceId ? '✅ SET' : '❌ MISSING');
    return;
  }
  
  // Fix: Extract instance ID if it's a full URL
  if (instanceId.includes('wati.io')) {
    // Extract instance ID from URL like: https://live-mt-server.wati.io/349028
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1]; // Get the last part (349028)
    console.log('🔧 Fixed: Extracted instance ID from URL');
  }
  
  console.log('✅ Environment variables found');
  console.log('Original WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID);
  console.log('Extracted Instance ID:', instanceId);
  console.log('');
  
  // Test the new URL structure
  const newBaseURL = `https://live-server-${instanceId}.wati.io/api/v1`;
  const oldBaseURL = `https://live-mt-server.wati.io/349028/api/v1`;
  
  console.log('🔍 URL Structure Comparison:');
  console.log('OLD (404 errors):', oldBaseURL);
  console.log('NEW (should work):', newBaseURL);
  console.log('');
  
  try {
    // Test 1: Check if new URL structure works
    console.log('📋 Test 1: Testing new URL structure...');
    
    const response = await axios.get(
      `${newBaseURL}/getTemplates`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! New URL structure works!');
    console.log('Response status:', response.status);
    console.log('Templates found:', response.data?.templates?.length || 0);
    
    if (response.data?.templates) {
      console.log('\n📋 Available Templates:');
      response.data.templates.forEach(template => {
        console.log(`- ${template.name}: ${template.status} (${template.language})`);
      });
    }
    
  } catch (error) {
    console.log('❌ New URL structure still has issues:');
    console.log('Error:', error.response?.status, error.response?.statusText);
    console.log('Message:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 This suggests the instance ID might be wrong');
      console.log('Check your WATI dashboard for the correct instance ID');
    }
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If new URL works: Test sending a message');
  console.log('2. If still 404: Check your WATI instance ID');
  console.log('3. Verify your WATI account is active and approved');
}

// Run the test
testWatiNewURL();
