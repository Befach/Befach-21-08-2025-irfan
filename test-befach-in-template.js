require('dotenv').config({ path: '.env.local' });
const { sendWhatsAppTemplate } = require('./lib/watiWhatsAppService');

async function testBefachInTemplate() {
  console.log('🧪 Testing befach_in template...\n');
  
  // Test data for shipment notification
  const testData = {
    clientName: 'John Doe',
    trackingId: 'BEF-20241201-12345',
    shipmentName: 'Electronics Package',
    originCountry: 'India',
    destinationCountry: 'USA',
    estimatedDelivery: '2024-12-15',
    trackingUrl: 'http://localhost:3000/track?tracking_id=BEF-20241201-12345'
  };
  
  const testPhone = '+918802308802'; // Using the number from your complaint templates
  
  try {
      console.log('📱 Sending test message with befach_international template...');
  console.log('Phone:', testPhone);
  console.log('Template: befach_international');
      console.log('Parameters:', {
    "1": testData.clientName // Only 1 parameter for befach_international template
  });
    
    const result = await sendWhatsAppTemplate(
      testPhone,
      'befach_international', // Using existing template
      {
        "1": testData.clientName // Only 1 parameter for this template
      }
    );
    
    if (result.success) {
      console.log('✅ SUCCESS! befach_in template sent successfully');
      console.log('Response:', result.data);
    } else {
      console.log('❌ FAILED to send befach_in template');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.log('❌ ERROR occurred:');
    console.log('Error:', error.message);
  }
}

testBefachInTemplate();
