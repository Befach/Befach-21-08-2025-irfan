import { NextApiRequest, NextApiResponse } from 'next';
import DirectWatiService from '../../lib/directWatiService';

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
      customMessage 
    } = req.body;

    // Validate required fields
    if (!phone || !whatsappType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: phone and whatsappType' 
      });
    }

    console.log('🚀 Direct WATI API called');
    console.log('📱 Type:', whatsappType);
    console.log('📞 Phone:', phone);
    console.log('👤 Client:', clientName);

    // Initialize Direct WATI service
    const directWati = new DirectWatiService();

    let result;

    // Handle different WhatsApp types
    switch (whatsappType) {
      case 'shipment-creation':
        result = await directWati.sendShipmentNotification(
          shipmentData,
          phone,
          clientName || 'Valued Customer',
          'creation'
        );
        break;

      case 'status-update':
        result = await directWati.sendShipmentNotification(
          shipmentData,
          phone,
          clientName || 'Valued Customer',
          'status_update'
        );
        break;

      case 'delivery-confirmation':
        result = await directWati.sendShipmentNotification(
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
        result = await directWati.sendDirectWhatsApp(phone, customMessage);
        break;

      default:
        return res.status(400).json({ 
          success: false, 
          error: `Invalid whatsappType: ${whatsappType}` 
        });
    }

    if (result.success) {
      console.log('✅ Direct WATI WhatsApp sent successfully');
      console.log('📊 Response:', result.data);
      
      return res.status(200).json({
        success: true,
        message: 'WhatsApp message sent successfully via Direct WATI API',
        data: result.data
      });
    } else {
      console.error('❌ Direct WATI WhatsApp failed:', result.error);
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send WhatsApp message'
      });
    }

  } catch (error) {
    console.error('❌ Direct WATI API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}






