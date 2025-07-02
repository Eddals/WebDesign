<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You - Devtone</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .header {
      background-color: #9519cc;
      color: white;
      padding: 40px 20px;
      text-align: center;
      position: relative;
    }
    .logo {
      max-height: 40px;
      margin-bottom: 30px;
    }
    .header img.mascot {
      position: absolute;
      right: 20px;
      top: 40px;
      max-height: 260px;
    }
    .header h1 {
      font-size: 36px;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .content {
      text-align: center;
      padding: 40px 20px;
    }
    .content h2 {
      color: #333;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #a052e2, #9519cc);
      color: white;
      padding: 12px 24px;
      margin-top: 20px;
      border: none;
      border-radius: 25px;
      font-weight: bold;
      text-decoration: none;
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      background-color: #9519cc;
      color: white;
      padding: 40px 20px;
      gap: 40px;
    }
    .feature-box {
      max-width: 280px;
      text-align: center;
    }
    .feature-box h3 {
      margin-top: 10px;
      font-size: 20px;
    }
    .feature-box p {
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .header img.mascot {
        position: static;
        max-width: 100%;
        margin-top: 20px;
      }
      .features {
        flex-direction: column;
        align-items: center;
      }
    }
  </style>
</head>
<body>

  <div class="header">
    <img src="https://i.imgur.com/W7uxhn7.png" alt="DevTone Logo" class="logo"/>
    <h1>Thank you for contacting us!</h1>
    <p>
      Have a question, request, or project in mind? We're here to help.<br>
      Fill out the form below and a member of our team will get back to you within 24–48 hours.<br>
      Whether you're looking for more information about our services, need a custom quote, or just want to say hello — we’d love to hear from you!
    </p>
    <img src="https://i.imgur.com/C9BSumy.png" alt="Mascot" class="mascot" />
  </div>

  <div class="content">
    <h2>Hello,</h2>
    <p>While we review your message, you can help us move things forward by filling out a quick project form.<br>
    This will give us a better understanding of your goals, timeline, and expectations.</p>
    <a href="#" class="btn">Get a Estimate</a>
  </div>

  <div class="features">
    <div class="feature-box">
      <img src="https://i.imgur.com/eyetkn6.png" alt="Estimate Icon" width="80"/>
      <h3>Get a Free Estimate</h3>
      <p>Request a quick, no-obligation quote tailored to your needs.</p>
    </div>
    <div class="feature-box">
      <img src="https://i.imgur.com/A7ZOXjo.png" alt="Competitive Icon" width="80"/>
      <h3>Competitive</h3>
      <p>Offering high-quality services at prices that beat the competition.</p>
    </div>
  </div>

</body>
</html>
