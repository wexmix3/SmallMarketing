// Simple script to help debug the error
const fs = require('fs');
const path = require('path');

// Check if the error is related to a specific module
try {
  const { TwitterApi } = require('twitter-api-v2');
  console.log('Twitter API module loaded successfully');
} catch (error) {
  console.error('Error loading Twitter API module:', error);
}

// Check if the error is related to the database
try {
  const { Sequelize } = require('sequelize');
  console.log('Sequelize module loaded successfully');
} catch (error) {
  console.error('Error loading Sequelize module:', error);
}

// Check if the error is related to Next.js
try {
  const next = require('next');
  console.log('Next.js module loaded successfully');
} catch (error) {
  console.error('Error loading Next.js module:', error);
}

// Check if the error is related to the file system
try {
  const files = fs.readdirSync(path.join(__dirname, 'pages'));
  console.log('Pages directory contains:', files);
} catch (error) {
  console.error('Error reading pages directory:', error);
}

console.log('Debug script completed');
