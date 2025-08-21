require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...');
console.log('=====================================');

const requiredVars = [
  'WATI_API_KEY',
  'WATI_INSTANCE_ID',
  'WATI_INSTANCE',
  'NEXT_PUBLIC_BASE_URL'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? 'Present' : value}`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log('\n🔧 Current WhatsApp Service Configuration:');
console.log('==========================================');

// Check what the WhatsApp service will use
const instanceId = process.env.WATI_INSTANCE_ID;
const instance = process.env.WATI_INSTANCE;

if (instance && instance.includes('wati.io')) {
  console.log('✅ Using full instance URL:', instance);
  console.log('🔗 WhatsApp API endpoint will be:', `${instance}/api/v2`);
} else if (instanceId) {
  console.log('✅ Using instance ID:', instanceId);
  console.log('🔗 WhatsApp API endpoint will be:', `https://live-mt-server.wati.io/${instanceId}/api/v2`);
} else {
  console.log('❌ No WATI configuration found');
}
