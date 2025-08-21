// WhatsApp Service for Shipment Status Updates using WATI API
const axios = require('axios');

/**
 * Get the correct WATI base URL using instance ID
 */
function getWatiBaseURL() {
  // Check if we have the full instance URL
  if (process.env.WATI_INSTANCE && process.env.WATI_INSTANCE.includes('wati.io')) {
    const baseUrl = process.env.WATI_INSTANCE;
    console.log('🔧 WATI: Using full instance URL:', baseUrl);
    // Add /api/v2 to the base URL for utility templates
    return `${baseUrl}/api/v2`;
  }

  // Fallback to instance ID
  const instanceId = process.env.WATI_INSTANCE_ID;
  if (!instanceId) {
    throw new Error('Missing WATI_INSTANCE_ID in environment variables.');
  }

  console.log('🔧 WATI: Using instance ID:', instanceId);
  // Use /api/v2 for utility templates like 'logistic'
  return `https://live-mt-server.wati.io/${instanceId}/api/v2`;
}

/**
 * Send WhatsApp message using WATI API
 */
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    if (!process.env.WATI_API_KEY) {
      throw new Error('Missing WATI_API_KEY in environment variables.');
    }

    if (!process.env.WATI_INSTANCE_ID) {
      throw new Error('Missing WATI_INSTANCE_ID in environment variables.');
    }

    // Format phone number (remove + if present and ensure it starts with country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await axios.post(
      `${getWatiBaseURL()}/sendTemplateMessage?whatsappNumber=${formattedPhone}`,
      {
        template_name: 'befach_import_export',
        broadcast_name: "Befach Logistics",
        parameters: [] // This template has no parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp message sent successfully:', response.data);
    return { 
      success: true, 
      message: 'WhatsApp message sent successfully via WATI', 
      data: response.data 
    };
  } catch (error) {
    console.error('WATI WhatsApp sending failed:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

/**
 * Send WhatsApp message using WATI template
 */
async function sendWhatsAppTemplate(phoneNumber, templateName, parameters = {}) {
  try {
    if (!process.env.WATI_API_KEY) {
      throw new Error('Missing WATI_API_KEY in environment variables.');
    }

    if (!process.env.WATI_INSTANCE_ID) {
      throw new Error('Missing WATI_INSTANCE_ID in environment variables.');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await axios.post(
      `${getWatiBaseURL()}/sendTemplateMessage?whatsappNumber=${formattedPhone}`,
      {
        template_name: templateName,
        broadcast_name: "Befach Logistics",
        parameters: Object.entries(parameters).map(([key, value]) => ({ [key]: value }))
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp template sent successfully:', response.data);
    return { 
      success: true, 
      message: 'WhatsApp template sent successfully via WATI', 
      data: response.data 
    };
  } catch (error) {
    console.error('WATI WhatsApp template sending failed:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

/**
 * Get available WATI templates
 */
async function getWatiTemplates() {
  try {
    if (!process.env.WATI_API_KEY) {
      throw new Error('Missing WATI_API_KEY in environment variables.');
    }

      const response = await axios.get(
    `${getWatiBaseURL()}/getMessageTemplates`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

    console.log('WATI templates retrieved successfully:', response.data);
    return { 
      success: true, 
      templates: response.data.templates || [],
      data: response.data 
    };
  } catch (error) {
    console.error('Failed to get WATI templates:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

/**
 * Format phone number for WATI API
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 0, replace with country code (assuming +91 for India)
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  
  // If it doesn't start with country code, add +91 (India)
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
}

/**
 * Send shipment notification using single WATI template
 * This function handles both shipment creation and status updates using one template
 */
async function sendShipmentWhatsApp(shipmentData, clientPhone, clientName, notificationType = 'creation', previousStatus = null, newStatus = null) {
  try {
    // Generate simple message based on notification type
    let message;
    
    if (notificationType === 'creation') {
      message = `🚚 *New Shipment Created*

Dear ${clientName},

Your shipment has been successfully created and is now being processed.

*Shipment Details:*
📦 Tracking ID: ${shipmentData.tracking_id}
📋 Shipment Name: ${shipmentData.shipment_name || 'Shipment'}
🌍 Origin: ${shipmentData.origin_country || 'N/A'}
🎯 Destination: ${shipmentData.destination_country || 'N/A'}

We'll keep you updated on your shipment's progress. Thank you for choosing our services!

Best regards,
Befach Logistics Team`;
    } else if (notificationType === 'status-update') {
      message = `📦 *Shipment Status Update*

Dear ${clientName},

Your shipment status has been updated!

*Shipment Details:*
📦 Tracking ID: ${shipmentData.tracking_id}
📋 Shipment Name: ${shipmentData.shipment_name || 'Shipment'}
🔄 Status Changed: ${previousStatus} → ${newStatus}

We'll continue to keep you updated on your shipment's progress.

Best regards,
Befach Logistics Team`;
    } else {
      message = `📦 *Shipment Update*

Dear ${clientName},

Your shipment has been updated.

*Shipment Details:*
📦 Tracking ID: ${shipmentData.tracking_id}
📋 Shipment Name: ${shipmentData.shipment_name || 'Shipment'}

Best regards,
Befach Logistics Team`;
    }
    
    // Send simple WhatsApp message
    console.log(`Sending ${notificationType} WhatsApp message...`);
    return await sendWhatsAppMessage(clientPhone, message);
    
  } catch (error) {
    console.error('Failed to send shipment WhatsApp:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send shipment creation WhatsApp (wrapper for backward compatibility)
 */
async function sendShipmentCreationWhatsApp(shipmentData, clientPhone, clientName) {
  return await sendShipmentWhatsApp(shipmentData, clientPhone, clientName, 'creation');
}

/**
 * Send status update WhatsApp (wrapper for backward compatibility)
 */
async function sendShipmentStatusUpdateWhatsApp(shipmentData, clientPhone, clientName, previousStatus, newStatus) {
  return await sendShipmentWhatsApp(shipmentData, clientPhone, clientName, 'status-update', previousStatus, newStatus);
}

/**
 * Generate unified shipment WhatsApp message (fallback)
 * This function handles both creation and status updates
 */
function generateShipmentWhatsAppMessage(shipmentData, clientName = 'Valued Customer', notificationType = 'creation', previousStatus = null, newStatus = null) {
  const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track?tracking_id=${shipmentData.tracking_id}`;
  
  let header, statusSection;
  
  if (notificationType === 'creation') {
    header = '🚚 *New Shipment Created*';
    statusSection = '';
  } else if (notificationType === 'status-update') {
    header = '📦 *Shipment Status Update*';
    statusSection = `
*Status Change:*
🔄 From: ${previousStatus}
✅ To: ${newStatus}`;
  } else {
    header = '📦 *Shipment Update*';
    statusSection = '';
  }
  
  return `${header}

Dear ${clientName},

${notificationType === 'creation' ? 'Your shipment has been successfully created and is now being processed.' : 'Your shipment status has been updated!'}

*Shipment Details:*
📦 Tracking ID: ${shipmentData.tracking_id}
📋 Shipment Name: ${shipmentData.shipment_name}
🌍 Origin: ${shipmentData.origin_country}
🎯 Destination: ${shipmentData.destination_country}
📅 Estimated Delivery: ${shipmentData.estimated_delivery || 'To be confirmed'}${statusSection}

*Track Your Shipment:*
${trackingUrl}

${notificationType === 'creation' ? 
  "We'll keep you updated on your shipment's progress. Thank you for choosing our services!" : 
  "We'll continue to keep you updated on your shipment's progress."}

Best regards,
Befach Logistics Team`;
}

/**
 * Generate shipment creation WhatsApp message (fallback - for backward compatibility)
 */
function generateCreationWhatsAppMessage(shipmentData, clientName = 'Valued Customer') {
  return generateShipmentWhatsAppMessage(shipmentData, clientName, 'creation');
}

/**
 * Generate status update WhatsApp message (fallback - for backward compatibility)
 */
function generateStatusUpdateWhatsAppMessage(shipmentData, clientName = 'Valued Customer', previousStatus, newStatus) {
  return generateShipmentWhatsAppMessage(shipmentData, clientName, 'status-update', previousStatus, newStatus);
}

/**
 * Validate phone number format
 */
function isValidPhoneNumber(phoneNumber) {
  // Basic validation - should contain only digits and optionally start with +
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phoneNumber) && phoneNumber.replace(/\D/g, '').length >= 10;
}

/**
 * Send status-only WhatsApp (just the status update)
 */
async function sendStatusOnlyWhatsApp(trackingId, status, clientPhone, additionalData = {}) {
  try {
    // Validate inputs
    if (!trackingId || !status || !clientPhone) {
      throw new Error('Missing required parameters: trackingId, status, or clientPhone');
    }

    if (!process.env.WATI_API_KEY) {
      throw new Error('Missing WATI_API_KEY in environment variables.');
    }

    if (!process.env.WATI_INSTANCE_ID) {
      throw new Error('Missing WATI_INSTANCE_ID in environment variables.');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(clientPhone);
    const phoneWithPlus = `+${formattedPhone}`;
    
    // Generate message with additional data
    const message = generateStatusOnlyMessage(trackingId, status, additionalData);
    
    console.log('🔍 Debug - Tracking ID:', trackingId);
    console.log('🔍 Debug - Status:', status);
    console.log('🔍 Debug - Phone:', clientPhone);
    console.log('🔍 Debug - Formatted Phone:', formattedPhone);
    console.log('🔍 Debug - Phone with +:', phoneWithPlus);
    console.log('🔍 Debug - Additional Data:', additionalData);
    console.log('🔍 Debug - Customer Name:', additionalData.customerName);
    console.log('🔍 Debug - Shipment Name:', additionalData.shipmentName);
    console.log('🔍 Debug - Origin:', additionalData.origin);
    console.log('🔍 Debug - Destination:', additionalData.destination);
    console.log('🔍 Debug - Message:', message);
    console.log('🔍 Debug - Message Length:', message.length);
    
    // Validate message
    if (!message || message.trim().length === 0) {
      throw new Error('Generated message is empty or invalid');
    }

          // Try your new logistic template first (perfect for shipments with all details!)
      console.log('📤 Trying new logistic template...');
      
      try {
              // Debug: Log the template parameters being sent
      const templateParams = [
        { name: "1", value: additionalData.customerName || "Valued Customer" },
        { name: "2", value: additionalData.shipmentName || "Shipment" },
        { name: "3", value: trackingId },
        { name: "4", value: status },
        { name: "5", value: additionalData.origin || "N/A" },
        { name: "6", value: additionalData.destination || "N/A" },
        { name: "7", value: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?tracking_id=${trackingId}` }
      ];
      
      console.log('📤 Template Parameters being sent:');
      templateParams.forEach((param, index) => {
        console.log(`  ${param.name}: "${param.value}"`);
      });
      
      const templateResponse = await axios.post(
        `${getWatiBaseURL()}/sendTemplateMessage?whatsappNumber=${phoneWithPlus}`,
        {
          template_name: 'logistic',
          broadcast_name: "Befach Logistics",
          parameters: templateParams
        },
          {
            headers: {
              'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

      console.log('📤 Template response:', templateResponse.data);
      
      if (templateResponse.data && templateResponse.data.result === false) {
        console.log('❌ Template logistic failed, trying other templates...');
        
        // Try other suitable templates as fallback
        const fallbackTemplates = [
          'requirement_received_state', // Primary working template
          'documentation_chech_state',
          'pending_specs_state'
        ];
        
        for (const fallbackTemplate of fallbackTemplates) {
          try {
            console.log(`📤 Trying fallback template: ${fallbackTemplate}`);
            
            const fallbackResponse = await axios.post(
              `${getWatiBaseURL()}/sendTemplateMessage?whatsappNumber=${phoneWithPlus}`,
              {
                template_name: fallbackTemplate,
                broadcast_name: "Befach Logistics",
                parameters: [
                  { name: "1", value: `Shipment ${trackingId}: ${status}` }
                ]
              },
              {
                headers: {
                  'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (fallbackResponse.data && fallbackResponse.data.result === true) {
              console.log(`✅ Fallback template ${fallbackTemplate} worked!`);
              return { 
                success: true, 
                message: `WhatsApp message sent successfully via ${fallbackTemplate}`, 
                data: fallbackResponse.data 
              };
            }
            
          } catch (fallbackError) {
            console.log(`❌ Fallback template ${fallbackTemplate} failed:`, fallbackError.message);
            continue;
          }
        }
        
        // If all templates fail, try direct message
        console.log('❌ All templates failed, trying direct message...');
        throw new Error('All templates failed');
      }
      
              console.log('✅ Logistic template message sent successfully!');
        return { 
          success: true, 
          message: 'WhatsApp message sent successfully via logistic template', 
          data: templateResponse.data 
        };
      
    } catch (templateError) {
      console.log('❌ Template failed, trying direct message...');
      console.log('Template error:', templateError.message);
      
      // Fallback to direct message
      try {
        const directResponse = await axios.post(
          `${getWatiBaseURL()}/sendSessionMessage`,
          {
            whatsappNumber: phoneWithPlus,
            messageText: message
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.WATI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('📤 Direct message response:', directResponse.data);
        
        if (directResponse.data && directResponse.data.result === false) {
          throw new Error(`Direct message failed: ${directResponse.data.info || 'Unknown error'}`);
        }
        
        console.log('✅ Direct message sent successfully!');
        return { 
          success: true, 
          message: 'WhatsApp message sent successfully via direct message', 
          data: directResponse.data 
        };
        
      } catch (directError) {
        throw new Error(`All methods failed. Template: ${templateError.message}, Direct: ${directError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ All WhatsApp methods failed:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Generate simple status-only message for template
 */
function generateStatusOnlyMessage(trackingId, status, additionalData = {}) {
  // Create a professional shipment status message
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `🚚 SHIPMENT STATUS UPDATE

📦 Shipment ID: ${trackingId}`;
  
  // Add customer name if available
  if (additionalData.customerName) {
    message += `\n👤 Customer: ${additionalData.customerName}`;
  }
  
  // Add shipment name if available
  if (additionalData.shipmentName) {
    message += `\n📋 Shipment: ${additionalData.shipmentName}`;
  }
  
  // Add origin and destination if available
  if (additionalData.origin) {
    message += `\n🌍 Origin: ${additionalData.origin}`;
  }
  
  if (additionalData.destination) {
    message += `\n🎯 Destination: ${additionalData.destination}`;
  }
  
  message += `\n📋 Current Status: ${status}
⏰ Updated: ${timestamp}

Best regards,
BEFACH INTERNATIONAL`;
  
  return message;
}

module.exports = {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  getWatiTemplates,
  sendShipmentWhatsApp,
  sendShipmentCreationWhatsApp,
  sendShipmentStatusUpdateWhatsApp,
  sendStatusOnlyWhatsApp,
  generateShipmentWhatsAppMessage,
  generateCreationWhatsAppMessage,
  generateStatusUpdateWhatsAppMessage,
  generateStatusOnlyMessage,
  formatPhoneNumber,
  isValidPhoneNumber,
  getWatiBaseURL
};

