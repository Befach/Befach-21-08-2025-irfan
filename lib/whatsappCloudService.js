// WhatsApp Cloud API Service using Meta's official platform
// FREE TIER: 1,000 messages per month

const axios = require('axios');

class WhatsAppCloudService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  // Test connection to WhatsApp Cloud API
  async testConnection() {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        return {
          success: false,
          error: 'Missing WhatsApp Cloud API credentials. Please check your environment variables.'
        };
      }

      // Test by getting phone number info
      const response = await axios.get(
        `${this.baseUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'Connected successfully!',
        phoneNumber: response.data?.phone_number,
        verifiedName: response.data?.verified_name
      };
    } catch (error) {
      return {
        success: false,
        error: `Connection failed: ${error.response?.data?.error?.message || error.message}`
      };
    }
  }

  // Send a simple text message
  async sendTextMessage(phoneNumber, message) {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        return {
          success: false,
          error: 'Missing WhatsApp Cloud API credentials'
        };
      }

      // Format phone number (add + if missing)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'Message sent successfully!',
        messageId: response.data?.messages?.[0]?.id,
        phoneNumber: formattedPhone
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to send message: ${error.response?.data?.error?.message || error.message}`
      };
    }
  }

  // Send shipment creation message
  async sendShipmentCreationMessage(phoneNumber, shipmentData, clientName = 'Valued Customer') {
    const message = `🚚 *New Shipment Created*

*Tracking ID:* ${shipmentData.tracking_id}
*Shipment:* ${shipmentData.shipment_name}
*Origin:* ${shipmentData.origin_country}
*Destination:* ${shipmentData.destination_country}
*Estimated Delivery:* ${shipmentData.estimated_delivery}

Dear ${clientName}, your shipment has been created and is being processed. We'll keep you updated on its progress.

Thank you for choosing Befach Logistics! 📦`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Send shipment status update message
  async sendShipmentStatusUpdateMessage(phoneNumber, shipmentData, clientName, previousStatus, newStatus) {
    const message = `📊 *Shipment Status Update*

*Tracking ID:* ${shipmentData.tracking_id}
*Shipment:* ${shipmentData.shipment_name}
*Previous Status:* ${previousStatus}
*New Status:* ${newStatus}
*Origin:* ${shipmentData.origin_country}
*Destination:* ${shipmentData.destination_country}

Dear ${clientName}, your shipment status has been updated. Track your package in real-time for the latest information.

Thank you for choosing Befach Logistics! 📦`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Send quick status message
  async sendQuickStatusMessage(phoneNumber, trackingId, status) {
    const message = `📱 *Quick Status Update*

*Tracking ID:* ${trackingId}
*Current Status:* ${status}

Your shipment status has been updated. For detailed tracking information, please visit our website.

Thank you for choosing Befach Logistics! 📦`;

    return this.sendTextMessage(phoneNumber, message);
  }

  // Get message delivery status
  async getMessageStatus(messageId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        status: response.data?.status,
        details: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get message status: ${error.message}`
      };
    }
  }
}

const whatsappService = new WhatsAppCloudService();

module.exports = { whatsappService, WhatsAppCloudService };
