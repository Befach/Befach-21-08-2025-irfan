// Direct WATI API Service for WhatsApp Messaging
const axios = require('axios');

/**
 * Direct WATI API Service
 * Sends WhatsApp messages directly without workflow dependencies
 */

class DirectWatiService {
  constructor() {
    this.apiKey = process.env.WATI_API_KEY;
    this.instanceId = process.env.WATI_INSTANCE_ID;
    this.baseUrl = this.getWatiBaseURL();
  }

  /**
   * Get the correct WATI base URL using instance ID
   */
  getWatiBaseURL() {
    let instanceId = this.instanceId;
    if (!instanceId) {
      throw new Error('Missing WATI_INSTANCE_ID in environment variables.');
    }
    
    // Fix: Extract instance ID if it's a full URL
    if (instanceId.includes('wati.io')) {
      const urlParts = instanceId.split('/');
      instanceId = urlParts[urlParts.length - 1];
      console.log('🔧 WATI: Extracted instance ID from URL:', instanceId);
    }
    
    // Use the working API version from your curl command
    return `https://app-server.wati.io/api/v1`;
  }

  /**
   * Send WhatsApp message directly via WATI API
   */
  async sendDirectWhatsApp(phoneNumber, message) {
    try {
      if (!this.apiKey) {
        throw new Error('Missing WATI_API_KEY in environment variables.');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

             const response = await axios.post(
         `${this.baseUrl}/sendTemplateMessage?whatsappNumber=${formattedPhone}`,
         {
           template_name: 'befach_international',
           broadcast_name: "Befach Logistics",
           parameters: [
             { "1": message }
           ]
         },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Direct WATI WhatsApp sent successfully:', response.data);
      return { 
        success: true, 
        message: 'WhatsApp message sent successfully via Direct WATI API', 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Direct WATI WhatsApp failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Send shipment notification directly via WATI API
   */
  async sendShipmentNotification(shipmentData, clientPhone, clientName, notificationType = 'creation') {
    try {
      if (!this.apiKey) {
        throw new Error('Missing WATI_API_KEY in environment variables.');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(clientPhone);

      // Generate message based on notification type
      let message;
             let templateName = 'befach_international';

      switch (notificationType) {
        case 'creation':
          message = `🚚 New Shipment Created!\n\nTracking ID: ${shipmentData.trackingId}\nStatus: ${shipmentData.status}\nOrigin: ${shipmentData.origin}\nDestination: ${shipmentData.destination}\n\nDear ${clientName}, your shipment has been created successfully!`;
          break;
        case 'status_update':
          message = `📦 Shipment Status Updated!\n\nTracking ID: ${shipmentData.trackingId}\nNew Status: ${shipmentData.status}\nCurrent Location: ${shipmentData.current_city || 'In Transit'}\n\nDear ${clientName}, your shipment status has been updated!`;
          break;
        case 'delivery':
          message = `🎉 Shipment Delivered!\n\nTracking ID: ${shipmentData.trackingId}\nStatus: Delivered\nDestination: ${shipmentData.destination}\n\nDear ${clientName}, your shipment has been delivered successfully!`;
          break;
        default:
          message = `📋 Shipment Update!\n\nTracking ID: ${shipmentData.trackingId}\nStatus: ${shipmentData.status}\n\nDear ${clientName}, here's your shipment update!`;
      }

      const response = await axios.post(
        `${this.baseUrl}/sendTemplateMessage?whatsappNumber=${formattedPhone}`,
        {
          template_name: templateName,
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": message }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Shipment notification sent via Direct WATI API:', response.data);
      return { 
        success: true, 
        message: 'Shipment notification sent successfully via Direct WATI API', 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Shipment notification via Direct WATI failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Send custom template message
   */
  async sendTemplateMessage(phoneNumber, templateName, parameters = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Missing WATI_API_KEY in environment variables.');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const response = await axios.post(
        `${this.baseUrl}/sendTemplateMessage?whatsappNumber=${formattedPhone}`,
        {
          template_name: templateName,
          broadcast_name: "Befach Logistics",
          parameters: Object.entries(parameters).map(([key, value]) => ({ [key]: value }))
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Template message sent via Direct WATI API:', response.data);
      return { 
        success: true, 
        message: 'Template message sent successfully via Direct WATI API', 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Template message via Direct WATI failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Format phone number for WATI API
   */
  formatPhoneNumber(phoneNumber) {
    let phone = phoneNumber.toString().trim();
    
    // Remove + if present
    if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }
    
    // For Indian numbers, ensure proper format
    if (phone.startsWith('91')) {
      // Already has country code
      return phone;
    } else if (phone.length === 10) {
      // 10-digit number, add 91
      return '91' + phone;
    } else if (phone.length === 12 && phone.startsWith('91')) {
      // 12-digit with country code
      return phone;
    }
    
    // Log the phone number for debugging
    console.log('🔧 Phone formatting:', phoneNumber, '→', phone);
    
    return phone;
  }

  /**
   * Test Direct WATI API connection
   */
  async testConnection() {
    console.log('🧪 Testing Direct WATI API Connection...\n');
    
    try {
      // Test with a simple message
      const result = await this.sendDirectWhatsApp(
        '919876543210', 
        '🧪 Test message from Direct WATI API'
      );
      
      if (result.success) {
        console.log('✅ Direct WATI API connection working!');
        console.log('Response:', result.data);
      } else {
        console.log('❌ Direct WATI API connection failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Direct WATI API test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = DirectWatiService;
