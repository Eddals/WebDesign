// Quick test for estimate API
const fetch = require('node-fetch');

async function quickTest() {
    console.log('🧪 Quick Estimate API Test');
    console.log('==========================');
    
    const testData = {
        name: "Test User",
        email: "test@example.com", // Change this to your email
        phone: "(555) 123-4567",
        company: "Test Company",
        industry: "Technology",
        projectType: "business",
        budget: "$1,500 - $5,000",
        timeline: "1 Month",
        description: "This is a test to check if emails are being sent",
        features: ["contact_form", "seo"],
        retainer: "none"
    };
    
    try {
        console.log('📤 Sending test data...');
        
        const response = await fetch('http://localhost:3000/api/estimate-brevo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📥 Response status:', response.status);
        
        const result = await response.json();
        console.log('📋 Response data:', JSON.stringify(result, null, 2));
        
        if (response.ok && result.success) {
            console.log('✅ SUCCESS! Email should be sent.');
            console.log('📧 Check your email:', testData.email);
            console.log('🆔 Message ID:', result.messageId);
        } else {
            console.log('❌ FAILED!');
            console.log('📋 Error:', result.error);
            console.log('📋 Details:', result.details);
        }
        
    } catch (error) {
        console.log('❌ EXCEPTION:', error.message);
    }
}

// Run the test
quickTest();