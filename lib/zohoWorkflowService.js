// Zoho Workflow Integration Service for WhatsApp Messaging via WATI
const axios = require('axios');

/**
 * Zoho Workflow Integration Service
 * This service integrates Zoho workflows with your existing WATI WhatsApp service
 */

class ZohoWorkflowService {
  constructor() {
    this.zohoWebhookUrl = process.env.ZOHO_WEBHOOK_URL;
    this.watiService = require('./watiWhatsAppService');
  }

  /**
   * Send message through Zoho workflow
   */
  async sendMessageViaZoho(workflowData) {
    try {
      if (!this.zohoWebhookUrl) {
        throw new Error('Missing ZOHO_WEBHOOK_URL in environment variables.');
      }

      const response = await axios.post(this.zohoWebhookUrl, workflowData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Message sent via Zoho workflow:', response.data);
      return {
        success: true,
        message: 'Message sent via Zoho workflow',
        data: response.data
      };
    } catch (error) {
      console.error('❌ Zoho workflow failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Send WhatsApp message through Zoho + WATI
   * This combines Zoho workflow management with WATI messaging
   */
  async sendWhatsAppViaZohoWati(phoneNumber, messageData, workflowName = 'default') {
    try {
      // First, trigger Zoho workflow
      const zohoResult = await this.sendMessageViaZoho({
        workflow: workflowName,
        action: 'send_whatsapp',
        data: {
          phone: phoneNumber,
          message: messageData,
          timestamp: new Date().toISOString()
        }
      });

      if (!zohoResult.success) {
        throw new Error(`Zoho workflow failed: ${zohoResult.error}`);
      }

      // Then send via WATI (your existing service)
      const watiResult = await this.watiService.sendWhatsAppMessage(phoneNumber, messageData);

      return {
        success: true,
        zoho: zohoResult,
        wati: watiResult,
        message: 'Message sent successfully via Zoho + WATI integration'
      };

    } catch (error) {
      console.error('❌ Zoho + WATI integration failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send shipment notification through Zoho + WATI
   */
  async sendShipmentNotificationViaZoho(shipmentData, clientPhone, clientName, notificationType = 'creation') {
    try {
      const workflowData = {
        workflow: 'shipment_notification',
        action: 'send_whatsapp',
        data: {
          shipment: shipmentData,
          client: {
            phone: clientPhone,
            name: clientName
          },
          notificationType,
          timestamp: new Date().toISOString()
        }
      };

      // Trigger Zoho workflow
      const zohoResult = await this.sendMessageViaZoho(workflowData);

      if (!zohoResult.success) {
        throw new Error(`Zoho workflow failed: ${zohoResult.error}`);
      }

      // Send WhatsApp via WATI
      const watiResult = await this.watiService.sendShipmentWhatsApp(
        shipmentData, 
        clientPhone, 
        clientName, 
        notificationType
      );

      return {
        success: true,
        zoho: zohoResult,
        wati: watiResult,
        message: 'Shipment notification sent via Zoho + WATI'
      };

    } catch (error) {
      console.error('❌ Shipment notification via Zoho + WATI failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test Zoho integration
   */
  async testZohoIntegration() {
    console.log('🧪 Testing Zoho Integration...\n');
    
    const testData = {
      workflow: 'test',
      action: 'test_connection',
      data: {
        message: 'Test message from Zoho integration',
        timestamp: new Date().toISOString()
      }
    };

    const result = await this.sendMessageViaZoho(testData);
    
    if (result.success) {
      console.log('✅ Zoho integration working!');
      console.log('Response:', result.data);
    } else {
      console.log('❌ Zoho integration failed:', result.error);
    }

    return result;
  }
}

module.exports = ZohoWorkflowService;






