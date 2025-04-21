/**
 * Performance Tests for AI Customer Service Assistant
 * 
 * This script runs performance tests using Lighthouse and custom metrics.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('./lighthouse-config');

// URLs to test
const TEST_URLS = [
  'http://localhost:8000/chatbot-demo-enhanced.html',
  'http://localhost:8000/chatbot-fullpage.html',
  'http://localhost:8000/landing-page.html'
];

// Custom metrics to measure
const CUSTOM_METRICS = [
  {
    name: 'Chatbot Widget Load Time',
    expression: 'window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart'
  },
  {
    name: 'Time to First Message',
    expression: 'window.chatbotMetrics && window.chatbotMetrics.timeToFirstMessage'
  },
  {
    name: 'Message Response Time',
    expression: 'window.chatbotMetrics && window.chatbotMetrics.averageResponseTime'
  },
  {
    name: 'Memory Usage',
    expression: 'window.performance.memory ? window.performance.memory.usedJSHeapSize / 1048576 : 0'
  },
  {
    name: 'DOM Element Count',
    expression: 'document.querySelectorAll("*").length'
  }
];

// Output directory for reports
const OUTPUT_DIR = path.join(__dirname, 'reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Run Lighthouse performance tests
 */
async function runLighthouseTests() {
  console.log('Starting Lighthouse performance tests...');
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  // Options for Lighthouse
  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  };
  
  // Run tests for each URL
  for (const url of TEST_URLS) {
    console.log(`Testing ${url}...`);
    
    try {
      // Run Lighthouse
      const result = await lighthouse(url, options, config);
      
      // Save report
      const reportPath = path.join(OUTPUT_DIR, `lighthouse-${path.basename(url, '.html')}.html`);
      fs.writeFileSync(reportPath, result.report);
      
      // Log results
      console.log(`Lighthouse scores for ${url}:`);
      console.log(`  Performance: ${result.lhr.categories.performance.score * 100}`);
      console.log(`  Accessibility: ${result.lhr.categories.accessibility.score * 100}`);
      console.log(`  Best Practices: ${result.lhr.categories['best-practices'].score * 100}`);
      console.log(`  SEO: ${result.lhr.categories.seo.score * 100}`);
      console.log(`  Report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
    }
  }
  
  // Close Chrome
  await chrome.kill();
}

/**
 * Run custom performance metrics
 */
async function runCustomMetrics() {
  console.log('\nRunning custom performance metrics...');
  
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Create a new page
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 800 });
  
  // Inject metrics collection script
  await page.evaluateOnNewDocument(() => {
    window.chatbotMetrics = {
      timeToFirstMessage: 0,
      messageResponseTimes: [],
      
      // Record time to first message
      recordFirstMessage() {
        if (this.timeToFirstMessage === 0) {
          this.timeToFirstMessage = performance.now();
        }
      },
      
      // Record message response time
      recordMessageSent() {
        this._lastMessageTime = performance.now();
      },
      
      // Record bot response time
      recordBotResponse() {
        if (this._lastMessageTime) {
          const responseTime = performance.now() - this._lastMessageTime;
          this.messageResponseTimes.push(responseTime);
          this._lastMessageTime = 0;
        }
      },
      
      // Calculate average response time
      get averageResponseTime() {
        if (this.messageResponseTimes.length === 0) return 0;
        const sum = this.messageResponseTimes.reduce((a, b) => a + b, 0);
        return sum / this.messageResponseTimes.length;
      }
    };
    
    // Observe DOM changes to detect messages
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Check for new bot messages
          const botMessages = mutation.addedNodes && Array.from(mutation.addedNodes).filter(node => 
            node.nodeType === 1 && node.classList && node.classList.contains('bot-message')
          );
          
          if (botMessages && botMessages.length > 0) {
            window.chatbotMetrics.recordFirstMessage();
            window.chatbotMetrics.recordBotResponse();
          }
          
          // Check for new user messages
          const userMessages = mutation.addedNodes && Array.from(mutation.addedNodes).filter(node => 
            node.nodeType === 1 && node.classList && node.classList.contains('user-message')
          );
          
          if (userMessages && userMessages.length > 0) {
            window.chatbotMetrics.recordMessageSent();
          }
        }
      }
    });
    
    // Start observing once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      const chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        observer.observe(chatMessages, { childList: true, subtree: true });
      }
    });
  });
  
  // Results object
  const results = {};
  
  // Test each URL
  for (const url of TEST_URLS) {
    console.log(`Testing custom metrics for ${url}...`);
    results[url] = {};
    
    try {
      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Collect initial metrics
      for (const metric of CUSTOM_METRICS) {
        const value = await page.evaluate(metric.expression);
        results[url][metric.name] = value;
      }
      
      // Interact with the chatbot
      if (url.includes('chatbot-demo-enhanced.html')) {
        // Open the widget
        await page.click('#try-widget-button');
        
        // Wait for widget to open
        await page.waitForSelector('.chatbot-widget.open');
        
        // Send a test message
        await page.type('#messageInput', 'Hello, this is a performance test');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(3)');
        
        // Send another message
        await page.type('#messageInput', 'What are your business hours?');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(5)');
      } else if (url.includes('chatbot-fullpage.html')) {
        // Send a test message
        await page.type('#messageInput', 'Hello, this is a performance test');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(2)');
        
        // Send another message
        await page.type('#messageInput', 'What are your business hours?');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(4)');
      }
      
      // Collect final metrics
      for (const metric of CUSTOM_METRICS) {
        const value = await page.evaluate(metric.expression);
        results[url][metric.name] = value;
      }
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
    }
  }
  
  // Close browser
  await browser.close();
  
  // Save results
  const resultsPath = path.join(OUTPUT_DIR, 'custom-metrics.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  // Log results
  console.log('\nCustom metrics results:');
  for (const url in results) {
    console.log(`\n${url}:`);
    for (const metric in results[url]) {
      console.log(`  ${metric}: ${results[url][metric]}`);
    }
  }
  console.log(`\nResults saved to: ${resultsPath}`);
}

/**
 * Run all performance tests
 */
async function runPerformanceTests() {
  try {
    // Run Lighthouse tests
    await runLighthouseTests();
    
    // Run custom metrics
    await runCustomMetrics();
    
    console.log('\nAll performance tests completed successfully!');
  } catch (error) {
    console.error('Error running performance tests:', error);
  }
}

// Run the tests
runPerformanceTests();
