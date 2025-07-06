// Simple test for contact endpoint
import fetch from 'node-fetch';

async function testContact() {
  console.log('🧪 Testing contact endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/contact-brevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'test',
        message: 'test message'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Response JSON:', json);
    } catch (e) {
      console.log('Not JSON response');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testContact(); 