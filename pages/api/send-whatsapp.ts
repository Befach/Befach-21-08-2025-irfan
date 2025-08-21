import { NextApiRequest, NextApiResponse } from 'next';
import { 
  sendShipmentWhatsApp,
  sendShipmentCreationWhatsApp, 
  sendShipmentStatusUpdateWhatsApp,
  sendStatusOnlyWhatsApp,
  isValidPhoneNumber 
} from '../../lib/watiWhatsAppService';

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
      previousStatus, 
      newStatus,
      trackingId,
      status
    } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    let result;

    if (whatsappType === 'shipment-creation') {
      // Send shipment creation WhatsApp
      if (!shipmentData) {
        return res.status(400).json({ error: 'Shipment data is required for creation WhatsApp' });
      }
      result = await sendShipmentWhatsApp(shipmentData, phone, clientName, 'creation');
    } else if (whatsappType === 'status-update') {
      // Send status update WhatsApp
      if (!shipmentData || !previousStatus || !newStatus) {
        return res.status(400).json({ 
          error: 'Shipment data, previous status, and new status are required for status update WhatsApp' 
        });
      }
      result = await sendShipmentWhatsApp(shipmentData, phone, clientName, 'status-update', previousStatus, newStatus);
    } else if (whatsappType === 'status-only') {
      // Send status-only WhatsApp (just the status)
      if (!trackingId || !status) {
        return res.status(400).json({ 
          error: 'Tracking ID and status are required for status-only WhatsApp' 
        });
      }
      const additionalData = req.body.additionalData || {};
      result = await sendStatusOnlyWhatsApp(trackingId, status, phone, additionalData);
    } else {
      return res.status(400).json({ 
        error: 'Invalid WhatsApp type. Use "shipment-creation", "status-update", or "status-only"' 
      });
    }

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'WhatsApp message sent successfully',
        whatsappType,
        recipient: phone
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error,
        whatsappType,
        recipient: phone
      });
    }
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send WhatsApp message' 
    });
  }
}

