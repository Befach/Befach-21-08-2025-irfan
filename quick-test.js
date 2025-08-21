const { sendStatusOnlyWhatsApp } = require('./lib/watiWhatsAppService');

console.log('🧪 Quick Test of WhatsApp Service...\n');

// Test the function directly
sendStatusOnlyWhatsApp('TEST-789', 'Out for Delivery', '+91919182992530')
  .then(result => {
    console.log('✅ Test completed!');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('🎉 WhatsApp service is working with utility template!');
    } else {
      console.log('❌ Error:', result.error);
    }
  })
  .catch(error => {
    console.log('❌ Test failed:', error.message);
  });

