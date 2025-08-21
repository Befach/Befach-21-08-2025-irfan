import React, { useState } from 'react';
import ClientOnlyAdmin from '../../components/ClientOnlyAdmin';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function PabblyIntegration() {
  const { user, isAdmin } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('919876543210');
  const [customMessage, setCustomMessage] = useState('🚚 Test message from Pabbly + WATI integration!');
  const [workflowName, setWorkflowName] = useState('test_workflow');

  const testPabblyIntegration = async () => {
    setIsTesting(true);
    setTestResults(null);

            try {
          const response = await fetch('/api/send-direct-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              whatsappType: 'custom-message',
              phone: testPhone,
              clientName: 'Test User',
              customMessage,
              workflowName
            }),
          });

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testShipmentNotification = async () => {
    setIsTesting(true);
    setTestResults(null);

    const testShipment = {
      trackingId: 'TEST123',
      status: 'In Transit',
      origin: 'Mumbai',
      destination: 'Delhi',
      estimatedDelivery: '2024-01-15'
    };

              try {
            const response = await fetch('/api/send-direct-whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                whatsappType: 'shipment-creation',
                phone: testPhone,
                clientName: 'Test Customer',
                shipmentData: testShipment,
                workflowName: 'shipment_creation'
              }),
            });

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <ClientOnlyAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Pabbly + WATI Integration
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Test and manage WhatsApp messaging through Pabbly workflows and WATI
                </p>
              </div>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Configuration Status */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Configuration Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">WATI Integration</p>
                      <p className="text-sm text-gray-500">WhatsApp Business API configured</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Pabbly Integration</p>
                      <p className="text-sm text-gray-500">Requires API key and webhook URL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Test Integration
                </h3>
                
                {/* Test Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Phone Number
                    </label>
                    <input
                      type="text"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="919876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workflow Name
                    </label>
                    <input
                      type="text"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="test_workflow"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Message
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Test Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={testPabblyIntegration}
                    disabled={isTesting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isTesting ? 'Testing...' : 'Test Custom Message'}
                  </button>
                  <button
                    onClick={testShipmentNotification}
                    disabled={isTesting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isTesting ? 'Testing...' : 'Test Shipment Notification'}
                  </button>
                </div>

                {/* Test Results */}
                {testResults && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Test Results</h4>
                    <div className={`p-4 rounded-md ${
                      testResults.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {testResults.success ? (
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className={`text-sm font-medium ${
                            testResults.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {testResults.success ? 'Success' : 'Error'}
                          </h3>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{testResults.message || testResults.error}</p>
                            {testResults.pabbly && (
                              <div className="mt-2">
                                <strong>Pabbly Result:</strong>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                  {JSON.stringify(testResults.pabbly, null, 2)}
                                </pre>
                              </div>
                            )}
                            {testResults.wati && (
                              <div className="mt-2">
                                <strong>WATI Result:</strong>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                  {JSON.stringify(testResults.wati, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Setup Instructions
                </h3>
                <div className="prose prose-sm text-gray-600">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Sign up for a <a href="https://pabbly.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">Pabbly account</a></li>
                    <li>Create a new workflow for WhatsApp messaging</li>
                    <li>Get your API key from the Pabbly dashboard</li>
                    <li>Get your webhook URL from the workflow</li>
                    <li>Add these to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:</li>
                  </ol>
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <code className="text-sm">
                      PABBLY_API_KEY=your_pabbly_api_key_here<br />
                      PABBLY_WEBHOOK_URL=your_pabbly_webhook_url_here
                    </code>
                  </div>
                  <p className="mt-4">
                    <a href="/PABBLY_WATI_INTEGRATION_GUIDE.md" target="_blank" className="text-indigo-600 hover:text-indigo-500">
                      View complete integration guide →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnlyAdmin>
  );
}
