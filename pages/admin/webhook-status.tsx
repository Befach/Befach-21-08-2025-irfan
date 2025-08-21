import { useState } from 'react';
import ClientOnlyAdmin from '../../components/ClientOnlyAdmin';

export default function WebhookStatus() {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const testHealth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Testing health endpoint...');
      const response = await fetch('/api/health');
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setTestResults(prev => ({ ...prev, health: result }));
      console.log('Health check result:', result);
    } catch (err) {
      console.error('Health check error:', err);
      setError(err.message || 'Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhookAPI = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Testing webhook API endpoint...');
      const response = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Webhook API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook API failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      setTestResults(prev => ({ ...prev, webhookAPI: result }));
      console.log('Webhook API result:', result);
    } catch (err) {
      console.error('Webhook API error:', err);
      setError(err.message || 'Webhook API test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testZohoWebhook = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Testing Zoho Flow webhook directly...');
      const response = await fetch('/api/test-zoho-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Zoho webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Zoho webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      setTestResults(prev => ({ ...prev, zohoWebhook: result }));
      console.log('Zoho webhook result:', result);
    } catch (err) {
      console.error('Zoho webhook error:', err);
      setError(err.message || 'Zoho webhook test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testMainWebhook = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Testing main webhook endpoint...');
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

      const response = await fetch('/api/webhook/zoho-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Main webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Main webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      setTestResults(prev => ({ ...prev, mainWebhook: result }));
      console.log('Main webhook result:', result);
    } catch (err) {
      console.error('Main webhook error:', err);
      setError(err.message || 'Main webhook test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Webhook Status">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Webhook Integration Status</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ API Routes Working</h2>
          <p className="text-green-700">
            Your API routes are now working properly! The CORS error from the direct webhook test was expected.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <button
            onClick={testHealth}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mr-4"
          >
            {isLoading ? 'Testing...' : 'Test Health API'}
          </button>
          
          <button
            onClick={testWebhookAPI}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mr-4"
          >
            {isLoading ? 'Testing...' : 'Test Webhook API'}
          </button>
          
          <button
            onClick={testZohoWebhook}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mr-4"
          >
            {isLoading ? 'Testing...' : 'Test Zoho Webhook'}
          </button>
          
          <button
            onClick={testMainWebhook}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Main Webhook'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            {testResults.health && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-600">✅ Health API Result</h3>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults.health, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {testResults.webhookAPI && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">✅ Webhook API Result</h3>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults.webhookAPI, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {testResults.zohoWebhook && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-orange-600">✅ Zoho Webhook Result</h3>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults.zohoWebhook, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {testResults.mainWebhook && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-purple-600">✅ Main Webhook Result</h3>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults.mainWebhook, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Next Steps</h2>
          <ul className="text-blue-700 space-y-1">
            <li>• If all tests pass, your webhook integration is working!</li>
            <li>• Check your Zoho Flow dashboard for incoming webhook data</li>
            <li>• Create a real shipment to test email notifications</li>
            <li>• Update shipment status to test stage change notifications</li>
          </ul>
        </div>
      </div>
    </ClientOnlyAdmin>
  );
} 