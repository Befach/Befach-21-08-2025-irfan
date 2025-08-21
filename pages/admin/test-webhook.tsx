import { useState } from 'react';
import ClientOnlyAdmin from '../../components/ClientOnlyAdmin';

export default function TestWebhook() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const testHealth = async () => {
    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      console.log('Testing health endpoint...');
      const response = await fetch('/api/health');
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setTestResult({ type: 'health', ...result });
      console.log('Health check result:', result);
    } catch (err) {
      console.error('Health check error:', err);
      setError(err.message || 'Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    setIsLoading(true);
    setError('');
    setTestResult(null);

    try {
      console.log('Testing webhook endpoint...');
      const response = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setTestResult({ type: 'webhook', ...result });
      
      if (!result.success) {
        setError(result.error || 'Webhook test failed');
      }
    } catch (err) {
      console.error('Webhook test error:', err);
      setError(err.message || 'Webhook test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnlyAdmin title="Test Webhook">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Test Zoho Flow Webhook</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h2>
          <ul className="text-blue-700 space-y-1">
            <li>• <strong>Test Health</strong>: First test if API routes are working</li>
            <li>• <strong>Test Webhook</strong>: Send a test webhook to Zoho Flow</li>
            <li>• Check your Zoho Flow dashboard for incoming webhook data</li>
            <li>• If configured correctly, you should receive a test email</li>
            <li>• Check the browser console for detailed logs</li>
          </ul>
        </div>

        <div className="mb-6 space-x-4">
          <button
            onClick={testHealth}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Health'}
          </button>
          
          <button
            onClick={testWebhook}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Webhook'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {testResult && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Test Result</h3>
            <div className="bg-white border border-gray-200 rounded p-3">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Troubleshooting</h2>
          <ul className="text-yellow-700 space-y-1">
            <li>• Check browser console for detailed error messages</li>
            <li>• Verify Zoho Flow webhook is properly configured</li>
            <li>• Ensure email templates are set up in Zoho Flow</li>
            <li>• Check if the webhook URL and API key are correct</li>
          </ul>
        </div>
      </div>
    </ClientOnlyAdmin>
  );
} 