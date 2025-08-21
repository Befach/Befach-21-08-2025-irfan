// 🔒 SECURE: Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// ✅ SECURE: Use environment variables instead of hardcoded credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables!');
  console.log('');
  console.log('🔒 SECURE SETUP:');
  console.log('1. Create a .env file in your project root:');
  console.log('   SUPABASE_URL=https://your-project.supabase.co');
  console.log('   SUPABASE_ANON_KEY=your-anon-key-here');
  console.log('');
  console.log('2. Install dotenv: npm install dotenv');
  console.log('3. Add this line at the top of this file: require("dotenv").config()');
  console.log('');
  console.log('4. Add .env to your .gitignore file');
  console.log('');
  console.log('⚠️  NEVER commit API keys to version control!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  try {
    console.log('🔍 Checking Supabase database columns...\n');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey.substring(0, 10) + '...\n');

    // Test connection and get shipments table structure
    console.log('📦 Checking SHIPMENTS table...');
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing shipments table:', error.message);
      
      if (error.message.includes('does not exist')) {
        console.log('💡 The shipments table might not exist yet.');
      } else if (error.message.includes('permission')) {
        console.log('💡 Check your RLS (Row Level Security) policies.');
      }
      return;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`✅ Found ${columns.length} columns in shipments table:`);
      columns.forEach((column, index) => {
        console.log(`   ${index + 1}. ${column}`);
      });
    } else {
      console.log('ℹ️  Shipments table exists but is empty');
      
      // Test for common columns
      const commonColumns = [
        'id', 'tracking_number', 'status', 'client_email', 'client_phone',
        'created_at', 'updated_at', 'shipper_name', 'recipient_name',
        'origin', 'destination', 'weight', 'description', 'notes'
      ];

      console.log('\n🧪 Testing for common columns:');
      for (const column of commonColumns) {
        try {
          const { error: colError } = await supabase
            .from('shipments')
            .select(column)
            .limit(1);
          
          if (colError && colError.message.includes('does not exist')) {
            console.log(`   ❌ ${column} - NOT FOUND`);
          } else {
            console.log(`   ✅ ${column} - EXISTS`);
          }
        } catch (err) {
          console.log(`   ❓ ${column} - ERROR: ${err.message}`);
        }
      }
    }

    // Check for other tables
    console.log('\n📋 Checking for other tables...');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tablesError && tables) {
        console.log('✅ Tables in database:');
        tables.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    } catch (err) {
      console.log('ℹ️  Could not list tables (this is normal for some setups)');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkColumns().then(() => {
  console.log('\n✅ Database check completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
