// Debug script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

console.log('Environment variables loaded:');
console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ Found' : '❌ Missing');

if (process.env.WATI_API_KEY) {
  console.log(`API Key length: ${process.env.WATI_API_KEY.length} characters`);
  console.log(`API Key starts with: ${process.env.WATI_API_KEY.substring(0, 20)}...`);
}

if (process.env.WATI_INSTANCE_ID) {
  console.log(`Instance ID: ${process.env.WATI_INSTANCE_ID}`);
}

console.log('\nAll environment variables:');
console.log(Object.keys(process.env).filter(key => key.includes('WATI')));





