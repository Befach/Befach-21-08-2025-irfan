import { NextApiRequest, NextApiResponse } from 'next';
import ZohoWorkflowService from '../../lib/zohoWorkflowService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      whatsappType, 
      phone, 
      clientName, 
      shipmentData, 
      workflowName = 'default',
      customMessage 
    } = req.body;

    // Validate required fields
    if (!phone || !whatsappType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: phone and whatsappType' 
      });
    }

    console.log('🚀 Pabbly + WATI WhatsApp API called');
    console.log('📱 Type:', whatsappType);
    console.log('📞 Phone:', phone);
    console.log('👤 Client:', clientName);
    console.log('📦 Workflow:', workflowName);

    // Initialize Zoho service
    const zohoService = new ZohoWorkflowService();

    let result;

    // Handle different WhatsApp types
    switch (whatsappType) {
      case 'shipment-creation':
        result = await zohoService.sendShipmentNotificationViaZoho(
          shipmentData,
          phone,
          clientName || 'Valued Customer',
          'creation'
        );
        break;

      case 'status-update':
        result = await zohoService.sendShipmentNotificationViaZoho(
          shipmentData,
          phone,
          clientName || 'Valued Customer',
          'status_update'
        );
        break;

      case 'delivery-confirmation':
        result = await zohoService.sendShipmentNotificationViaZoho(
          shipmentData,
          phone,
          clientName || 'Valued Customer',
          'delivery'
        );
        break;

      case 'custom-message':
        if (!customMessage) {
          return res.status(400).json({ 
            success: false, 
            error: 'customMessage is required for custom-message type' 
          });
        }
        result = await zohoService.sendWhatsAppViaZohoWati(
          phone,
          customMessage,
          workflowName
        );
        break;

      default:
        return res.status(400).json({ 
          success: false, 
          error: `Invalid whatsappType: ${whatsappType}` 
        });
    }

    if (result.success) {
              console.log('✅ Zoho + WATI WhatsApp sent successfully');
        console.log('📊 Zoho Result:', result.zoho);
        console.log('📱 WATI Result:', result.wati);
        
        return res.status(200).json({
          success: true,
          message: 'WhatsApp message sent successfully via Zoho + WATI',
          zoho: result.zoho,
          wati: result.wati,
          data: result
        });
    } else {
              console.error('❌ Zoho + WATI WhatsApp failed:', result.error);
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to send WhatsApp message'
        });
    }

  } catch (error) {
    console.error('❌ Zoho + WATI API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
