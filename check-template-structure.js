const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function checkTemplateStructure() {
  console.log('🔍 Checking Template Structure...\n');
  
  const apiKey = process.env.WATI_API_KEY;
  const phone = '9182992530';
  
  if (!apiKey) {
    console.log('❌ Missing WATI_API_KEY');
    return;
  }
  
  // Extract instance ID correctly
  let instanceId = process.env.WATI_INSTANCE_ID;
  if (instanceId.includes('wati.io')) {
    const urlParts = instanceId.split('/');
    instanceId = urlParts[urlParts.length - 1];
  }
  
  console.log('📱 Testing template: followup_required_lead');
  console.log('🔧 Instance ID:', instanceId);
  console.log('');
  
  // Test different parameter combinations
  const testCases = [
    {
      name: 'Test 1: No parameters',
      parameters: []
    },
    {
      name: 'Test 2: Single parameter',
      parameters: [
        { name: "1", value: "Test Value" }
      ]
    },
    {
      name: 'Test 3: Two parameters',
      parameters: [
        { name: "1", value: "Parameter 1" },
        { name: "2", value: "Parameter 2" }
      ]
    },
    {
      name: 'Test 4: Three parameters',
      parameters: [
        { name: "1", value: "Parameter 1" },
        { name: "2", value: "Parameter 2" },
        { name: "3", value: "Parameter 3" }
      ]
    },
    {
      name: 'Test 5: Five parameters (what we were trying)',
      parameters: [
        { name: "1", value: "Shipment ID: TEST-123" },
        { name: "2", value: "John Smith" },
        { name: "3", value: "Status: In Transit" },
        { name: "4", value: "Electronics Package" },
        { name: "5", value: "BEFACH INTERNATIONAL" }
      ]
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`🔍 ${testCase.name}`);
    console.log('Parameters:', testCase.parameters);
    
    try {
      const response = await axios.post(
        `https://live-mt-server.wati.io/${instanceId}/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
        {
          template_name: 'followup_required_lead',
          broadcast_name: "Befach Logistics",
          parameters: testCase.parameters
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Response received!');
      console.log('Result:', response.data.result);
      console.log('Info:', response.data.info);
      
      if (response.data.result === true) {
        console.log('🎯 SUCCESS! This parameter combination works!');
        console.log('📱 Check your mobile for the message');
        return testCase.parameters;
      }
      
    } catch (error) {
      console.log('❌ Failed:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }
    
    console.log('');
  }
  
  console.log('❌ No parameter combination worked.');
}

checkTemplateStructure();

