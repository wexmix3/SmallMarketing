/**
 * Accessibility Tests for AI Customer Service Assistant
 * 
 * This script runs accessibility tests using axe-core.
 */

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URLs to test
const TEST_URLS = [
  'http://localhost:8000/chatbot-demo-enhanced.html',
  'http://localhost:8000/chatbot-fullpage.html',
  'http://localhost:8000/landing-page.html'
];

// Output directory for reports
const OUTPUT_DIR = path.join(__dirname, 'reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Run accessibility tests
 */
async function runAccessibilityTests() {
  console.log('Starting accessibility tests...');
  
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Create a new page
  const page = await browser.newPage();
  
  // Results object
  const results = {};
  
  // Test each URL
  for (const url of TEST_URLS) {
    console.log(`Testing ${url}...`);
    
    try {
      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Run initial accessibility scan
      console.log(`Running initial scan for ${url}...`);
      const initialResults = await new AxePuppeteer(page).analyze();
      
      // Interact with the chatbot if applicable
      if (url.includes('chatbot-demo-enhanced.html')) {
        console.log('Opening chatbot widget...');
        
        // Open the widget
        await page.click('#try-widget-button');
        
        // Wait for widget to open
        await page.waitForSelector('.chatbot-widget.open');
        
        // Send a test message
        await page.type('#messageInput', 'Hello, this is an accessibility test');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(3)');
      } else if (url.includes('chatbot-fullpage.html')) {
        console.log('Interacting with full page chatbot...');
        
        // Send a test message
        await page.type('#messageInput', 'Hello, this is an accessibility test');
        await page.click('#sendButton');
        
        // Wait for response
        await page.waitForSelector('.bot-message:nth-child(2)');
      }
      
      // Run final accessibility scan
      console.log(`Running final scan for ${url}...`);
      const finalResults = await new AxePuppeteer(page).analyze();
      
      // Store results
      results[url] = {
        initial: {
          violations: initialResults.violations,
          passes: initialResults.passes.length,
          incomplete: initialResults.incomplete.length,
          inapplicable: initialResults.inapplicable.length
        },
        final: {
          violations: finalResults.violations,
          passes: finalResults.passes.length,
          incomplete: finalResults.incomplete.length,
          inapplicable: finalResults.inapplicable.length
        }
      };
      
      // Log summary
      console.log(`Initial scan for ${url}:`);
      console.log(`  Violations: ${initialResults.violations.length}`);
      console.log(`  Passes: ${initialResults.passes.length}`);
      console.log(`  Incomplete: ${initialResults.incomplete.length}`);
      console.log(`  Inapplicable: ${initialResults.inapplicable.length}`);
      
      console.log(`Final scan for ${url}:`);
      console.log(`  Violations: ${finalResults.violations.length}`);
      console.log(`  Passes: ${finalResults.passes.length}`);
      console.log(`  Incomplete: ${finalResults.incomplete.length}`);
      console.log(`  Inapplicable: ${finalResults.inapplicable.length}`);
      
      // Generate detailed report
      const reportPath = path.join(OUTPUT_DIR, `accessibility-${path.basename(url, '.html')}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(finalResults, null, 2));
      console.log(`Detailed report saved to: ${reportPath}`);
      
      // Generate HTML report
      const htmlReportPath = path.join(OUTPUT_DIR, `accessibility-${path.basename(url, '.html')}.html`);
      const htmlReport = generateHtmlReport(url, finalResults);
      fs.writeFileSync(htmlReportPath, htmlReport);
      console.log(`HTML report saved to: ${htmlReportPath}`);
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
    }
  }
  
  // Close browser
  await browser.close();
  
  // Save summary results
  const summaryPath = path.join(OUTPUT_DIR, 'accessibility-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`Summary results saved to: ${summaryPath}`);
  
  // Generate summary HTML report
  const summaryHtmlPath = path.join(OUTPUT_DIR, 'accessibility-summary.html');
  const summaryHtml = generateSummaryHtmlReport(results);
  fs.writeFileSync(summaryHtmlPath, summaryHtml);
  console.log(`Summary HTML report saved to: ${summaryHtmlPath}`);
  
  return results;
}

/**
 * Generate HTML report for a single URL
 */
function generateHtmlReport(url, results) {
  const violationsList = results.violations.map(violation => `
    <div class="violation">
      <h3>${violation.id}: ${violation.help}</h3>
      <p><strong>Impact:</strong> ${violation.impact}</p>
      <p>${violation.description}</p>
      <p><strong>Help URL:</strong> <a href="${violation.helpUrl}" target="_blank">${violation.helpUrl}</a></p>
      <h4>Affected Elements:</h4>
      <ul>
        ${violation.nodes.map(node => `
          <li>
            <pre>${escapeHtml(node.html)}</pre>
            <p><strong>Failure Summary:</strong> ${node.failureSummary}</p>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Report - ${url}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #0071e3;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        h2 {
          color: #0071e3;
          margin-top: 30px;
        }
        h3 {
          margin-top: 20px;
          color: #d32f2f;
        }
        .summary {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .summary-item {
          display: inline-block;
          margin-right: 30px;
        }
        .violation {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
        }
        .impact-critical {
          color: #d32f2f;
          font-weight: bold;
        }
        .impact-serious {
          color: #f57c00;
          font-weight: bold;
        }
        .impact-moderate {
          color: #fbc02d;
          font-weight: bold;
        }
        .impact-minor {
          color: #7cb342;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Accessibility Report</h1>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <h2>Summary</h2>
        <div class="summary-item">
          <strong>Violations:</strong> ${results.violations.length}
        </div>
        <div class="summary-item">
          <strong>Passes:</strong> ${results.passes.length}
        </div>
        <div class="summary-item">
          <strong>Incomplete:</strong> ${results.incomplete.length}
        </div>
        <div class="summary-item">
          <strong>Inapplicable:</strong> ${results.inapplicable.length}
        </div>
      </div>
      
      <h2>Violations</h2>
      ${results.violations.length === 0 ? '<p>No violations found. Great job!</p>' : violationsList}
    </body>
    </html>
  `;
}

/**
 * Generate summary HTML report for all URLs
 */
function generateSummaryHtmlReport(results) {
  const urlResults = Object.entries(results).map(([url, data]) => `
    <div class="url-result">
      <h2>${url}</h2>
      
      <h3>Initial Scan</h3>
      <div class="summary">
        <div class="summary-item">
          <strong>Violations:</strong> ${data.initial.violations.length}
        </div>
        <div class="summary-item">
          <strong>Passes:</strong> ${data.initial.passes}
        </div>
        <div class="summary-item">
          <strong>Incomplete:</strong> ${data.initial.incomplete}
        </div>
        <div class="summary-item">
          <strong>Inapplicable:</strong> ${data.initial.inapplicable}
        </div>
      </div>
      
      <h3>Final Scan (After Interaction)</h3>
      <div class="summary">
        <div class="summary-item">
          <strong>Violations:</strong> ${data.final.violations.length}
        </div>
        <div class="summary-item">
          <strong>Passes:</strong> ${data.final.passes}
        </div>
        <div class="summary-item">
          <strong>Incomplete:</strong> ${data.final.incomplete}
        </div>
        <div class="summary-item">
          <strong>Inapplicable:</strong> ${data.final.inapplicable}
        </div>
      </div>
      
      <h3>Violations</h3>
      ${data.final.violations.length === 0 ? '<p>No violations found. Great job!</p>' : `
        <table class="violations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Impact</th>
              <th>Elements</th>
            </tr>
          </thead>
          <tbody>
            ${data.final.violations.map(violation => `
              <tr>
                <td><a href="${violation.helpUrl}" target="_blank">${violation.id}</a></td>
                <td>${violation.help}</td>
                <td class="impact-${violation.impact}">${violation.impact}</td>
                <td>${violation.nodes.length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
      
      <p><a href="accessibility-${path.basename(url, '.html')}.html">View detailed report</a></p>
    </div>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Summary Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #0071e3;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        h2 {
          color: #0071e3;
          margin-top: 30px;
        }
        h3 {
          margin-top: 20px;
        }
        .summary {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .summary-item {
          display: inline-block;
          margin-right: 30px;
        }
        .url-result {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .violations-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .violations-table th, .violations-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .violations-table th {
          background-color: #f5f5f5;
        }
        .impact-critical {
          color: #d32f2f;
          font-weight: bold;
        }
        .impact-serious {
          color: #f57c00;
          font-weight: bold;
        }
        .impact-moderate {
          color: #fbc02d;
          font-weight: bold;
        }
        .impact-minor {
          color: #7cb342;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Accessibility Summary Report</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      
      ${urlResults}
    </body>
    </html>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Run the tests
runAccessibilityTests()
  .then(() => {
    console.log('Accessibility tests completed successfully!');
  })
  .catch(error => {
    console.error('Error running accessibility tests:', error);
  });
