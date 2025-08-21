require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking WATI Environment Variables...\n');

console.log('WATI_API_KEY:', process.env.WATI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('WATI_INSTANCE_ID:', process.env.WATI_INSTANCE_ID ? '✅ Found' : '❌ Missing');

if (process.env.WATI_API_KEY && process.env.WATI_INSTANCE_ID) {
  console.log('\n✅ Both WATI credentials found!');
  console.log('API Key starts with:', process.env.WATI_API_KEY.substring(0, 20) + '...');
  console.log('Instance ID:', process.env.WATI_INSTANCE_ID);
} else {
  console.log('\n❌ Missing WATI credentials');
}

