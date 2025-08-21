// List all available WATI templates
const axios = require('axios');

async function listTemplates() {
  console.log('🔍 Fetching available WATI templates...\n');
  
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTYwY2Q2NS00NDAyLTQ1M2EtODU2ZC04YmQ3MjhlYjIyYWIiLCJ1bmlxdWVfbmFtZSI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwibmFtZWlkIjoibWFya2V0aW5nQGJlZmFjaC5jb20iLCJlbWFpbCI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwiYXV0aF90aW1lIjoiMDgvMDcvMjAyNSAxMzoxMjozOCIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJUUklBTCIsIlRSSUFMUEFJRCJdLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.BYlXlIl6pRiStNEl5vx8FJUlKjG2ePNzY3MWHUUFFX4';
  const instanceId = '349028';
  
  try {
    const response = await axios.get(
      `https://app-server.wati.io/api/v1/getTemplates/${instanceId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Templates fetched successfully!');
    console.log('📋 Available templates:\n');
    
    if (response.data && response.data.length > 0) {
      response.data.forEach((template, index) => {
        console.log(`${index + 1}. Template Name: ${template.name}`);
        console.log(`   Status: ${template.status}`);
        console.log(`   Language: ${template.language}`);
        console.log(`   Category: ${template.category}`);
        console.log(`   Components: ${template.components?.length || 0}`);
        console.log('');
      });
    } else {
      console.log('No templates found');
    }
    
  } catch (error) {
    console.log('❌ Failed to fetch templates:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    
    // Try alternative endpoint
    console.log('\n🔄 Trying alternative endpoint...');
    try {
      const altResponse = await axios.get(
        `https://app-server.wati.io/api/v1/getTemplates`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Alternative endpoint worked!');
      console.log('📋 Templates:', altResponse.data);
      
    } catch (altError) {
      console.log('❌ Alternative endpoint also failed:', altError.response?.status);
    }
  }
}

// Run the function
listTemplates().catch(console.error);






