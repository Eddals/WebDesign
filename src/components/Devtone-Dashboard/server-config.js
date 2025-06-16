// This file configures the DevtoneDashboard to be served at /devtone-dashboard path
const express = require('express');
const path = require('path');
const fs = require('fs');

// Function to serve the DevtoneDashboard
function serveDevtoneDashboard(app) {
  // Serve static files from the DevtoneDashboard build directory
  app.use('/devtone-dashboard', express.static(path.join(__dirname, 'client/dist')));

  // Handle API requests for the DevtoneDashboard
  app.use('/api', require('./server/routes'));

  // For any other requests to /devtone-dashboard, serve the index.html
  app.get('/devtone-dashboard/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });

  console.log('DevtoneDashboard configured to be served at /devtone-dashboard');
}

module.exports = serveDevtoneDashboard;