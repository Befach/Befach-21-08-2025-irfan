import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test data
    const testData = {
      event_type: 'shipment_created',
      tracking_id: 'BEF-TEST-12345',
      client_email: 'test@example.com',
      shipment_name: 'Test Shipment',
      current_stage: 'Product Insurance',
      origin_country: 'Test Origin',
      destination_country: 'Test Destination',
      estimated_delivery: '2024-12-15',
      notes: 'This is a test webhook'
    };

    const webhookUrl = 'https://flow.zoho.in/60033586716/flow/webhook/incoming?zapikey=1001.a51d4e573e71e6f3e1751dce2e27a291.66d442cca19d1b7de69a453368f0c022&isdebug=false';
    
    console.log('Testing webhook with data:', testData);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testData,
        timestamp: new Date().toISOString(),
        source: 'Befach Shipment Tracker - Test'
      }),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { rawResponse: responseText };
    }

    console.log('Webhook test response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Webhook failed with status ${response.status}`,
        response: responseData
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook test successful',
      response: responseData
    });

  } catch (error) {
    console.error('Webhook test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Webhook test failed',
      details: error.message
    });
  }
} 