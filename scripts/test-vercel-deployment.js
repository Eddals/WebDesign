#!/usr/bin/env node

// Test script to verify Vercel deployment is working correctly

const testVercelDeployment = async () => {
  console.log('Testing Vercel Deployment for DevTone Agency\n');
  console.log('=' .repeat(60) + '\n');

  // Test domains
  const domains = [
    'https://devtone.agency',
    'https://www.devtone.agency'
  ];

  // Test data
  const testData = {
    name: 'Vercel Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    company: 'Test Company',
    country: 'United States',
    industry: 'Technology',
    projectType: 'landing',
    budget: '$500 - $1,500',
    timeline: '1 Month',
    description: 'This is a test from Vercel deployment script',
    features: ['contact_form', 'seo']
  };

  for (const domain of domains) {
    console.log(`Testing ${domain}...\n`);

    try {
      // Test if the site is accessible
      console.log('1. Checking if site is accessible...');
      const siteResponse = await fetch(domain);
      if (siteResponse.ok) {
        console.log('✅ Site is accessible\n');
      } else {
        console.log(`❌ Site returned status: ${siteResponse.status}\n`);
      }

      // Test the API endpoint
      console.log('2. Testing /api/send-estimate endpoint...');
      const apiUrl = `${domain}/api/send-estimate`;
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': domain
          },
          body: JSON.stringify(testData)
        });

        console.log(`Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response:', JSON.stringify(data, null, 2));
          console.log('✅ API endpoint is working!\n');
        } else {
          let errorMessage = `Status ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            try {
              const errorText = await response.text();
              if (errorText) errorMessage = errorText;
            } catch {}
          }
          console.log(`❌ API error: ${errorMessage}\n`);
        }
      } catch (error) {
        console.log(`❌ API request failed: ${error.message}\n`);
      }

      // Test ActivePieces webhook directly
      console.log('3. Testing ActivePieces webhook...');
      try {
        const webhookData = {
          nome: testData.name,
          email: testData.email,
          telefone: testData.phone,
          empresa: testData.company,
          pais: testData.country,
          industria: testData.industry,
          tipo_projeto: testData.projectType,
          orcamento: testData.budget,
          prazo: testData.timeline,
          mensagem: testData.description,
          recursos: testData.features.join(', '),
          timestamp: new Date().toISOString(),
          fonte: 'vercel-deployment-test'
        };

        const webhookResponse = await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        if (webhookResponse.ok) {
          console.log('✅ ActivePieces webhook is working!\n');
        } else {
          console.log(`❌ ActivePieces webhook returned status: ${webhookResponse.status}\n`);
        }
      } catch (error) {
        console.log(`❌ ActivePieces webhook failed: ${error.message}\n`);
      }

    } catch (error) {
      console.log(`❌ Error testing ${domain}: ${error.message}\n`);
    }

    console.log('-'.repeat(60) + '\n');
  }

  console.log('Deployment Test Summary:');
  console.log('1. ActivePieces webhook is the primary method (no email setup needed)');
  console.log('2. Vercel API route is available for email notifications (requires setup)');
  console.log('3. Form will work even if API is not configured\n');
  
  console.log('To enable email notifications:');
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Choose an email service (SendGrid, Resend, or SMTP)');
  console.log('3. Update /api/send-estimate.js with your email service code');
};

// Run the test
testVercelDeployment();