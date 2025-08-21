require('dotenv').config({ path: '.env.local' });
const { sendShipmentWhatsApp } = require('./lib/watiWhatsAppService');

async function testYourExactNumber() {
  console.log('🧪 Testing with YOUR exact number format...\n');
  
  const shipmentData = {
    tracking_id: 'EXACT-TEST-123',
    shipment_name: 'Exact Test Package'
  };
  
  try {
    console.log('📱 Testing different phone formats...\n');
    
    // Test 1: With +91 prefix
    console.log('1️⃣ Testing: +919182992530');
    const result1 = await sendShipmentWhatsApp(
      shipmentData,
      '+919182992530',
      'Test Customer',
      'creation'
    );
    console.log('Result 1:', result1.success ? '✅ SUCCESS' : '❌ FAILED');
    if (!result1.success) console.log('Error 1:', result1.error);
    
    console.log('\n2️⃣ Testing: 919182992530 (without +)');
    const result2 = await sendShipmentWhatsApp(
      shipmentData,
      '919182992530',
      'Test Customer',
      'creation'
    );
    console.log('Result 2:', result2.success ? '✅ SUCCESS' : '❌ FAILED');
    if (!result2.success) console.log('Error 2:', result2.error);
    
    console.log('\n3️⃣ Testing: 9182992530 (10 digits)');
    const result3 = await sendShipmentWhatsApp(
      shipmentData,
      '9182992530',
      'Test Customer',
      'creation'
    );
    console.log('Result 3:', result3.success ? '✅ SUCCESS' : '❌ FAILED');
    if (!result3.success) console.log('Error 3:', result3.error);
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testYourExactNumber();
