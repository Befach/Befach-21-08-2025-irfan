const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');

async function testFixedService() {
  console.log('🧪 Testing Fixed WhatsApp Service...\n');
  
  try {
    const result = await sendStatusOnlyWhatsApp(
      'TEST-456',
      'Delivered Successfully',
      '+91919182992530'
    );
    
    console.log('📱 Test Result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('🎉 WhatsApp service is working correctly!');
      console.log('📱 Check your mobile for the message');
    } else {
      console.log('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testFixedService();

