// Find working template name
const axios = require('axios');

async function findWorkingTemplate() {
  console.log('🔍 Finding working template...\n');
  
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTYwY2Q2NS00NDAyLTQ1M2EtODU2ZC04YmQ3MjhlYjIyYWIiLCJ1bmlxdWVfbmFtZSI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwibmFtZWlkIjoibWFya2V0aW5nQGJlZmFjaC5jb20iLCJlbWFpbCI6Im1hcmtldGluZ0BiZWZhY2guY29tIiwiYXV0aF90aW1lIjoiMDgvMDcvMjAyNSAxMzoxMjozOCIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJUUklBTCIsIlRSSUFMUEFJRCJdLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.BYlXlIl6pRiStNEl5vx8FJUlKjG2ePNzY3MWHUUFFX4';
  const phone = '919182992530';
  
  // Common template names to test
  const templates = [
    'hello_world',
    'welcome',
    'notification',
    'update',
    'message',
    'alert',
    'info',
    'reminder',
    'status',
    'tracking'
  ];
  
  for (const template of templates) {
    console.log(`🔍 Testing template: ${template}`);
    
    try {
      const response = await axios.post(
        `https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=${phone}`,
        {
          template_name: template,
          broadcast_name: "Befach Logistics",
          parameters: [
            { "1": "Test message" }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ SUCCESS with template: ${template}`);
      console.log('Response:', response.data);
      return template; // Found working template
      
    } catch (error) {
      if (error.response?.data?.info?.includes('Invalid Template Name')) {
        console.log(`❌ Template ${template} doesn't exist`);
      } else {
        console.log(`❌ Other error with ${template}:`, error.response?.data?.info);
      }
    }
  }
  
  console.log('\n❌ No working templates found');
  return null;
}

// Run the function
findWorkingTemplate().catch(console.error);






