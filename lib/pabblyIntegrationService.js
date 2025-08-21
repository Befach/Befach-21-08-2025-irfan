// Pabbly Integration Service for WhatsApp Messaging via WATI
const axios = require('axios');

/**
 * Pabbly Integration Service
 * This service integrates Pabbly workflows with your existing WATI WhatsApp service
 */

class PabblyIntegrationService {
  constructor() {
    this.pabblyApiKey = process.env.PABBLY_API_KEY;
    this.pabblyWebhookUrl = process.env.PABBLY_WEBHOOK_URL;
    this.watiService = require('./watiWhatsAppService');
  }

  /**
   * Send message through Pabbly workflow
   */
  async sendMessageViaPabbly(workflowData) {
    try {
      if (!this.pabblyWebhookUrl) {
        throw new Error('Missing PABBLY_WEBHOOK_URL in environment variables.');
      }

      const response = await axios.post(this.pabblyWebhookUrl, workflowData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.pabblyApiKey}`,
        }
      });

      console.log('✅ Message sent via Pabbly workflow:', response.data);
      return {
        success: true,
        message: 'Message sent via Pabbly workflow',
        data: response.data
      };
    } catch (error) {
      console.error('❌ Pabbly workflow failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Send WhatsApp message through Pabbly + WATI
   * This combines Pabbly workflow management with WATI messaging
   */
  async sendWhatsAppViaPabblyWati(phoneNumber, messageData, workflowName = 'default') {
    try {
      // First, trigger Pabbly workflow
      const pabblyResult = await this.sendMessageViaPabbly({
        workflow: workflowName,
        action: 'send_whatsapp',
        data: {
          phone: phoneNumber,
          message: messageData,
          timestamp: new Date().toISOString()
        }
      });

      if (!pabblyResult.success) {
        throw new Error(`Pabbly workflow failed: ${pabblyResult.error}`);
      }

      // Then send via WATI (your existing service)
      const watiResult = await this.watiService.sendWhatsAppMessage(phoneNumber, messageData);

      return {
        success: true,
        pabbly: pabblyResult,
        wati: watiResult,
        message: 'Message sent successfully via Pabbly + WATI integration'
      };

    } catch (error) {
      console.error('❌ Pabbly + WATI integration failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send shipment notification through Pabbly + WATI
   */
  async sendShipmentNotificationViaPabbly(shipmentData, clientPhone, clientName, notificationType = 'creation') {
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

      // Trigger Pabbly workflow
      const pabblyResult = await this.sendMessageViaPabbly(workflowData);

      if (!pabblyResult.success) {
        throw new Error(`Pabbly workflow failed: ${pabblyResult.error}`);
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
        pabbly: pabblyResult,
        wati: watiResult,
        message: 'Shipment notification sent via Pabbly + WATI'
      };

    } catch (error) {
      console.error('❌ Shipment notification via Pabbly + WATI failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test Pabbly integration
   */
  async testPabblyIntegration() {
    console.log('🧪 Testing Pabbly Integration...\n');
    
    const testData = {
      workflow: 'test',
      action: 'test_connection',
      data: {
        message: 'Test message from Pabbly integration',
        timestamp: new Date().toISOString()
      }
    };

    const result = await this.sendMessageViaPabbly(testData);
    
    if (result.success) {
      console.log('✅ Pabbly integration working!');
      console.log('Response:', result.data);
    } else {
      console.log('❌ Pabbly integration failed:', result.error);
    }

    return result;
  }
}

module.exports = PabblyIntegrationService;






