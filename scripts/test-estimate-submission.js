#!/usr/bin/env node

// Test script to verify estimate submission is working

const testEstimateSubmission = async () => {
  console.log('Testing estimate submission...\n');

  // Test data
  const testData = {
    nome: 'Test User',
    email: 'test@example.com',
    telefone: '(555) 123-4567',
    empresa: 'Test Company',
    pais: 'United States',
    industria: 'Technology',
    tipo_projeto: 'landing',
    orcamento: '$500 - $1,500',
    prazo: '1 Month',
    mensagem: 'This is a test submission',
    recursos: 'Contact Form, SEO Optimization',
    timestamp: new Date().toISOString(),
    fonte: 'test-script'
  };

  try {
    // Test ActivePieces webhook directly
    console.log('1. Testing ActivePieces webhook...');
    const webhookUrl = 'https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    let responseBody;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        responseBody = await response.json();
        console.log('Response body (JSON):', JSON.stringify(responseBody, null, 2));
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        responseBody = await response.text();
        console.log('Response body (text):', responseBody);
      }
    } else {
      responseBody = await response.text();
      console.log('Response body (text):', responseBody);
    }

    if (response.ok) {
      console.log('✅ ActivePieces webhook test successful!\n');
    } else {
      console.log('❌ ActivePieces webhook test failed\n');
    }

    // Test the API endpoint if available
    console.log('2. Testing API endpoint...');
    const apiUrl = 'https://api.devtone.agency/api/estimate';
    
    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: testData.nome,
          email: testData.email,
          phone: testData.telefone,
          company: testData.empresa,
          country: testData.pais,
          industry: testData.industria,
          projectType: testData.tipo_projeto,
          budget: testData.orcamento,
          timeline: testData.prazo,
          description: testData.mensagem,
          features: testData.recursos.split(', ')
        }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      console.log('API Response status:', apiResponse.status);
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log('API Response:', JSON.stringify(apiData, null, 2));
        console.log('✅ API endpoint test successful!\n');
      } else {
        console.log('❌ API endpoint returned error\n');
      }
    } catch (apiError) {
      console.log('❌ API endpoint not available:', apiError.message, '\n');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testEstimateSubmission();