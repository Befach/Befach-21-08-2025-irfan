import { NextApiRequest, NextApiResponse } from 'next';
import { whatsappService } from '../../lib/whatsappCloudService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      action, 
      phone, 
      message,
      shipmentData, 
      clientName,
      previousStatus, 
      newStatus,
      trackingId,
      status
    } = req.body;

    // Validate phone number
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }

    let result;

    switch (action) {
      case 'test-connection':
        result = await whatsappService.testConnection();
        break;

      case 'send-text':
        if (!message) {
          return res.status(400).json({ 
            success: false, 
            error: 'Message text is required' 
          });
        }
        result = await whatsappService.sendTextMessage(phone, message);
        break;

      case 'shipment-creation':
        if (!shipmentData) {
          return res.status(400).json({ 
            success: false, 
            error: 'Shipment data is required' 
          });
        }
        result = await whatsappService.sendShipmentCreationMessage(
          phone, 
          shipmentData, 
          clientName || 'Valued Customer'
        );
        break;

      case 'status-update':
        if (!shipmentData || !previousStatus || !newStatus) {
          return res.status(400).json({ 
            success: false, 
            error: 'Shipment data, previous status, and new status are required' 
          });
        }
        result = await whatsappService.sendShipmentStatusUpdateMessage(
          phone,
          shipmentData,
          clientName || 'Valued Customer',
          previousStatus,
          newStatus
        );
        break;

      case 'status-only':
        if (!trackingId || !status) {
          return res.status(400).json({ 
            success: false, 
            error: 'Tracking ID and status are required' 
          });
        }
        result = await whatsappService.sendQuickStatusMessage(phone, trackingId, status);
        break;

      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid action. Supported actions: test-connection, send-text, shipment-creation, status-update, status-only' 
        });
    }

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('WhatsApp Cloud API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process WhatsApp request' 
    });
  }
}
