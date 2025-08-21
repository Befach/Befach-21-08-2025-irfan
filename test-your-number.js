require('dotenv').config({ path: '.env.local' });
const { sendShipmentWhatsApp } = require('./lib/watiWhatsAppService');

async function testYourNumber() {
  console.log('🧪 Testing with YOUR actual number from the form...\n');

  const shipmentData = {
    tracking_id: 'BEF-20250807-09991',
    shipment_name: 'Test Package',
    origin_country: 'c',
    destination_country: 'c',
    estimated_delivery: '2024-12-20',
    contents: 'Test Contents'
  };

  try {
    console.log('📱 Testing with your form data...');
    console.log('Phone: +919182992530 (adding +91 prefix)');
    console.log('Tracking ID:', shipmentData.tracking_id);

    const result = await sendShipmentWhatsApp(
      shipmentData,
      '+919182992530', // Adding +91 prefix
      'Test Customer',
      'creation'
    );

    if (result.success) {
      console.log('✅ SUCCESS! WhatsApp sent to your number');
      console.log('Response:', result.data);
    } else {
      console.log('❌ FAILED to send WhatsApp');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
}

testYourNumber();
