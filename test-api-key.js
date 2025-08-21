// Test script to check API key format
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking WATI API Key Format...\n');

const apiKey = process.env.WATI_API_KEY;

if (!apiKey) {
  console.log('❌ WATI_API_KEY is missing from .env.local file');
} else {
  console.log('✅ WATI_API_KEY found');
  console.log(`Length: ${apiKey.length} characters`);
  console.log(`Starts with: ${apiKey.substring(0, 20)}...`);
  console.log(`Ends with: ...${apiKey.substring(apiKey.length - 20)}`);
  
  if (apiKey.includes('Bearer')) {
    console.log('❌ WARNING: API key contains "Bearer" - remove this!');
    console.log('   Your .env.local should contain ONLY the token, not "Bearer"');
  } else {
    console.log('✅ API key format looks correct (no "Bearer" prefix)');
  }
  
  if (apiKey.length < 100) {
    console.log('❌ WARNING: API key seems too short - should be much longer');
  } else {
    console.log('✅ API key length looks appropriate');
  }
}

console.log('\n📝 Your .env.local should look like this:');
console.log('WATI_API_KEY=eyJhbGciOiJIUzI1NilsInR5cCI6IkpXVCJ9.eyJqdGkiOil5MmM3MDU...');
console.log('WATI_INSTANCE_ID=https://live-mt-server.wati.io/349028');





