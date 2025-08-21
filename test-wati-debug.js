// Debug script to test WATI WhatsApp integration
require('dotenv').config({ path: '.env.local' });

console.log('🔍 WATI WhatsApp Integration Debug\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ SET' : '❌ MISSING');
console.log('');

// Check if axios is available
try {
  const axios = require('axios');
  console.log('📦 Axios:', '✅ AVAILABLE');
} catch (error) {
  console.log('📦 Axios:', '❌ NOT AVAILABLE - Run: npm install axios');
  process.exit(1);
}

// Test WATI service
try {
  const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');
  console.log('🔧 WATI Service:', '✅ LOADED');
  
  // Test with sample data
  console.log('\n🧪 Testing WATI Service...');
  console.log('Phone: 9182992530');
  console.log('Tracking ID: TEST-123');
  console.log('Status: In Transit');
  
  sendStatusOnlyWhatsApp('TEST-123', 'In Transit', '9182992530')
    .then(result => {
      console.log('\n📤 Test Result:');
      console.log('Success:', result.success);
      if (result.success) {
        console.log('Message:', result.message);
      } else {
        console.log('Error:', result.error);
      }
    })
    .catch(error => {
      console.log('\n❌ Test Error:', error.message);
    });
    
} catch (error) {
  console.log('🔧 WATI Service:', '❌ FAILED TO LOAD');
  console.log('Error:', error.message);
}

console.log('\n💡 To fix WATI integration:');
console.log('1. Get your WATI API key from https://wati.io');
console.log('2. Get your WATI Instance ID from your WATI dashboard');
console.log('3. Add these to your .env.local file:');
console.log('   WATI_API_KEY=your_actual_api_key_here');
console.log('   WATI_INSTANCE_ID=your_actual_instance_id_here');
console.log('4. Restart your server');
