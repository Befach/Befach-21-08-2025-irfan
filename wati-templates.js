// WATI Templates Helper Script
require('dotenv').config({ path: '.env.local' });
const { getWatiTemplates, sendWhatsAppTemplate, sendShipmentWhatsApp } = require('./lib/watiWhatsAppService');

async function listWatiTemplates() {
  console.log('🔍 Fetching WATI Templates...\n');

  try {
    const result = await getWatiTemplates();
    
    if (result.success) {
      console.log('✅ Successfully retrieved WATI templates!\n');
      
      if (result.templates && result.templates.length > 0) {
        console.log(`📋 Found ${result.templates.length} templates:\n`);
        
        result.templates.forEach((template, index) => {
          console.log(`${index + 1}. Template Name: ${template.name || 'N/A'}`);
          console.log(`   Status: ${template.status || 'N/A'}`);
          console.log(`   Language: ${template.language || 'N/A'}`);
          console.log(`   Category: ${template.category || 'N/A'}`);
          console.log(`   Components: ${template.components ? template.components.length : 0}`);
          
          if (template.components && template.components.length > 0) {
            console.log('   Parameters:');
            template.components.forEach((component, compIndex) => {
              if (component.type === 'body' && component.text) {
                console.log(`     - Body: ${component.text.substring(0, 100)}...`);
              }
              if (component.type === 'header' && component.text) {
                console.log(`     - Header: ${component.text}`);
              }
              if (component.type === 'button' && component.text) {
                console.log(`     - Button: ${component.text}`);
              }
            });
          }
          console.log('');
        });
        
        // Suggest templates for shipment tracking
        console.log('🚚 Suggested Templates for Shipment Tracking:\n');
        
        const suggestedTemplates = result.templates.filter(template => {
          const name = template.name ? template.name.toLowerCase() : '';
          const body = template.components ? 
            template.components.find(comp => comp.type === 'body')?.text?.toLowerCase() || '' : '';
          
          return name.includes('shipment') || 
                 name.includes('tracking') || 
                 name.includes('order') || 
                 name.includes('delivery') ||
                 name.includes('notification') ||
                 body.includes('shipment') ||
                 body.includes('tracking') ||
                 body.includes('order') ||
                 body.includes('delivery');
        });
        
        if (suggestedTemplates.length > 0) {
          suggestedTemplates.forEach((template, index) => {
            console.log(`${index + 1}. ${template.name || 'Unnamed Template'}`);
            console.log(`   Status: ${template.status || 'N/A'}`);
            console.log(`   Language: ${template.language || 'N/A'}`);
            console.log('');
          });
        } else {
          console.log('No specific shipment-related templates found.');
          console.log('You may need to create a custom template named "shipment_notification" in your WATI dashboard.\n');
        }
        
      } else {
        console.log('❌ No templates found in your WATI account.');
        console.log('Please create a template named "shipment_notification" in your WATI dashboard first.\n');
      }
      
    } else {
      console.log('❌ Failed to retrieve templates:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error fetching templates:', error.message);
  }
}

async function testTemplate(templateName, phoneNumber) {
  console.log(`🧪 Testing template: ${templateName}\n`);
  
  try {
    const result = await sendWhatsAppTemplate(
      phoneNumber,
      templateName,
      {
        "1": "John Doe",
        "2": "BEF-20241201-12345",
        "3": "Test Electronics Package",
        "4": "India",
        "5": "USA",
        "6": "2024-12-15",
        "7": "http://localhost:3000/track?tracking_id=BEF-20241201-12345",
        "8": "New Shipment Created",
        "9": "Shipment Created",
        "10": "creation"
      }
    );
    
    if (result.success) {
      console.log('✅ Template sent successfully!');
      console.log('Response:', result.data);
    } else {
      console.log('❌ Failed to send template:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing template:', error.message);
  }
}

async function testShipmentNotification(phoneNumber, notificationType = 'creation') {
  console.log(`🧪 Testing shipment notification: ${notificationType}\n`);
  
  try {
    const shipmentData = {
      tracking_id: 'BEF-20241201-12345',
      shipment_name: 'Test Electronics Package',
      origin_country: 'India',
      destination_country: 'USA',
      estimated_delivery: '2024-12-15'
    };

    const result = await sendShipmentWhatsApp(
      shipmentData,
      phoneNumber,
      'John Doe',
      notificationType,
      notificationType === 'status-update' ? 'In Transit' : null,
      notificationType === 'status-update' ? 'Out for Delivery' : null
    );
    
    if (result.success) {
      console.log(`✅ ${notificationType} notification sent successfully!`);
      console.log('Response:', result.data);
    } else {
      console.log(`❌ Failed to send ${notificationType} notification:`, result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing shipment notification:', error.message);
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'list') {
  listWatiTemplates();
} else if (command === 'test' && args[1] && args[2]) {
  testTemplate(args[1], args[2]);
} else if (command === 'test-shipment' && args[1]) {
  const notificationType = args[2] || 'creation';
  testShipmentNotification(args[1], notificationType);
} else {
  console.log('🔧 WATI Templates Helper\n');
  console.log('Usage:');
  console.log('  node wati-templates.js list                                    - List all available templates');
  console.log('  node wati-templates.js test <template> <phone>                 - Test a specific template');
  console.log('  node wati-templates.js test-shipment <phone> [creation|status] - Test shipment notification');
  console.log('');
  console.log('Examples:');
  console.log('  node wati-templates.js list');
  console.log('  node wati-templates.js test shipment_notification +919876543210');
  console.log('  node wati-templates.js test-shipment +919876543210 creation');
  console.log('  node wati-templates.js test-shipment +919876543210 status-update');
  console.log('');
  console.log('Note: Make sure your WATI_API_KEY and WATI_INSTANCE_ID are set in .env.local');
  console.log('');
  console.log('📝 Single Template Approach:');
  console.log('  - Use template name: "shipment_notification"');
  console.log('  - Template variables:');
  console.log('    {{1}} - Client Name');
  console.log('    {{2}} - Tracking ID');
  console.log('    {{3}} - Shipment Name');
  console.log('    {{4}} - Origin Country');
  console.log('    {{5}} - Destination Country');
  console.log('    {{6}} - Estimated Delivery');
  console.log('    {{7}} - Tracking URL');
  console.log('    {{8}} - Message Type (New Shipment Created / Shipment Status Update)');
  console.log('    {{9}} - Status Info (Shipment Created / Previous → New Status)');
  console.log('    {{10}} - Notification Type (creation / status-update)');
}
