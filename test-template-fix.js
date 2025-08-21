require('dotenv').config({ path: '.env.local' });
const { sendShipmentWhatsApp } = require('./lib/watiWhatsAppService');

async function testTemplateFix() {
  console.log('🧪 Testing Template Fix with Fewer Parameters...\n');

  const shipmentData = {
    tracking_id: 'BEF-20250807-09991',
    shipment_name: 'Test Package',
    origin_country: 'India',
    destination_country: 'USA',
    estimated_delivery: '2024-12-20',
    contents: 'Test Contents'
  };

  try {
    console.log('📱 Testing with befach_in template (4 parameters)...');
    console.log('Phone: +919182992530');
    console.log('Tracking ID:', shipmentData.tracking_id);

    const result = await sendShipmentWhatsApp(
      shipmentData,
      '+919182992530',
      'Test Customer',
      'creation'
    );

    if (result.success) {
      console.log('✅ SUCCESS! Template message sent');
      console.log('Response:', result.data);
    } else {
      console.log('❌ FAILED to send template message');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
}

testTemplateFix();
