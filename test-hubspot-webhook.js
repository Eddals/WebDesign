// Test script for HubSpot webhook
import fetch from 'node-fetch';

async function testHubSpotWebhook() {
  console.log('Testing HubSpot webhook...');
  
  const testData = {
    submittedAt: Date.now(),
    fields: [
      {
        name: "firstname",
        value: "Test"
      },
      {
        name: "lastname",
        value: "User"
      },
      {
        name: "email",
        value: "test@example.com"
      },
      {
        name: "phone",
        value: "+1234567890"
      },
      {
        name: "company",
        value: "Test Company"
      },
      {
        name: "country",
        value: "United States"
      },
      {
        name: "industry",
        value: "Technology"
      },
      {
        name: "source",
        value: "test_script"
      }
    ],
    context: {
      pageUri: "test-script",
      pageName: "Test Script"
    }
  };
  
  try {
    console.log('Sending test data to HubSpot webhook...');
    
    const response = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Response status:', response.status);
    
    let responseText;
    try {
      responseText = await response.text();
      console.log('Response text:', responseText);
    } catch (error) {
      console.error('Error getting response text:', error);
    }
    
    if (response.ok) {
      console.log('✅ Test successful!');
    } else {
      console.error('❌ Test failed!');
    }
  } catch (error) {
    console.error('Error sending test data:', error);
  }
}

// Run the test
testHubSpotWebhook();