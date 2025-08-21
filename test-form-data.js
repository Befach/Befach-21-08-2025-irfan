const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Form Data for WhatsApp');
console.log('==================================');

async function testFormData() {
  try {
    console.log('📤 Testing with sample form data...');
    
    // Simulate the exact data structure from your form
    const testData = {
      whatsappType: 'status-only',
      phone: '919182992530',
      trackingId: 'TEST-ORIGIN-001',
      status: 'Shipment Created Successfully',
      additionalData: {
        customerName: 'Test Customer',
        shipmentName: 'Test Shipment',
        origin: 'Mumbai, India',        // This should work
        destination: 'New York, USA'    // This should work
      }
    };
    
    console.log('📋 Test Data Being Sent:');
    console.log('  Phone:', testData.phone);
    console.log('  Tracking ID:', testData.trackingId);
    console.log('  Status:', testData.status);
    console.log('  Customer Name:', testData.additionalData.customerName);
    console.log('  Shipment Name:', testData.additionalData.shipmentName);
    console.log('  Origin:', testData.additionalData.origin);
    console.log('  Destination:', testData.additionalData.destination);
    
    // Test the local API endpoint
    console.log('\n🌐 Testing Local API with sample data...');
    
    const response = await axios.post('http://localhost:3000/api/send-whatsapp', testData, {
      timeout: 15000
    });
    
    console.log('✅ Local API Response:', response.data);
    
    if (response.data.success) {
      console.log('\n🎉 Test successful!');
      console.log('📱 Check your WhatsApp for the message');
      console.log('🔍 Verify that Origin and Destination are included');
    } else {
      console.log('❌ Test failed:', response.data.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log('   Status:', error.response?.status);
    console.log('   Data:', error.response?.data);
    console.log('   Message:', error.message);
  }
}

// Also test with empty origin/destination to see the difference
async function testEmptyData() {
  try {
    console.log('\n🔍 Testing with EMPTY origin/destination...');
    
    const emptyData = {
      whatsappType: 'status-only',
      phone: '919182992530',
      trackingId: 'TEST-EMPTY-001',
      status: 'Shipment Created Successfully',
      additionalData: {
        customerName: 'Test Customer',
        shipmentName: 'Test Shipment',
        origin: 'N/A, N/A',           // This will show as N/A
        destination: 'N/A, N/A'       // This will show as N/A
      }
    };
    
    console.log('📋 Empty Data Being Sent:');
    console.log('  Origin:', emptyData.additionalData.origin);
    console.log('  Destination:', emptyData.additionalData.destination);
    
    const response = await axios.post('http://localhost:3000/api/send-whatsapp', emptyData, {
      timeout: 15000
    });
    
    console.log('✅ Empty Data Response:', response.data);
    
  } catch (error) {
    console.log('❌ Empty data test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting form data tests...\n');
  
  await testFormData();
  await testEmptyData();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Check if you received both WhatsApp messages');
  console.log('2. Compare the Origin/Destination in both messages');
  console.log('3. If both show N/A, the issue is in the form data');
  console.log('4. If the first shows real data, the issue is in your form');
}

runTests().catch(console.error);
