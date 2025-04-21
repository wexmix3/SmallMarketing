/**
 * Test Runner for AI Customer Service Assistant
 * 
 * This script runs all tests and generates a combined report.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Output directory for reports
const REPORTS_DIR = path.join(__dirname, 'test-reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Run a command and return the output
 */
function runCommand(command, options = {}) {
  console.log(`\n> ${command}\n`);
  try {
    return execSync(command, {
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    if (!options.ignoreError) {
      throw error;
    }
    return null;
  }
}

/**
 * Run unit tests
 */
function runUnitTests() {
  console.log('\n=== Running Unit Tests ===\n');
  runCommand('npx jest --config=jest.config.js', { ignoreError: true });
}

/**
 * Run integration tests
 */
function runIntegrationTests() {
  console.log('\n=== Running Integration Tests ===\n');
  runCommand('npx cypress run --config-file=cypress.config.js', { ignoreError: true });
}

/**
 * Run end-to-end tests
 */
function runE2ETests() {
  console.log('\n=== Running End-to-End Tests ===\n');
  runCommand('npx playwright test --config=playwright.config.js', { ignoreError: true });
}

/**
 * Run performance tests
 */
function runPerformanceTests() {
  console.log('\n=== Running Performance Tests ===\n');
  runCommand('node tests/performance/performance-test.js', { ignoreError: true });
}

/**
 * Run accessibility tests
 */
function runAccessibilityTests() {
  console.log('\n=== Running Accessibility Tests ===\n');
  runCommand('node tests/accessibility/accessibility-test.js', { ignoreError: true });
}

/**
 * Generate combined report
 */
function generateCombinedReport() {
  console.log('\n=== Generating Combined Report ===\n');
  
  // Collect report data
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      unit: fs.existsSync('coverage/coverage-summary.json') 
        ? JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'))
        : null,
      integration: fs.existsSync('cypress/reports/summary.json')
        ? JSON.parse(fs.readFileSync('cypress/reports/summary.json', 'utf8'))
        : null,
      e2e: fs.existsSync('playwright-report/test-results.json')
        ? JSON.parse(fs.readFileSync('playwright-report/test-results.json', 'utf8'))
        : null,
      performance: fs.existsSync('tests/performance/reports/custom-metrics.json')
        ? JSON.parse(fs.readFileSync('tests/performance/reports/custom-metrics.json', 'utf8'))
        : null,
      accessibility: fs.existsSync('tests/accessibility/reports/accessibility-summary.json')
        ? JSON.parse(fs.readFileSync('tests/accessibility/reports/accessibility-summary.json', 'utf8'))
        : null
    }
  };
  
  // Save combined report data
  const reportPath = path.join(REPORTS_DIR, 'combined-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  // Generate HTML report
  const htmlReportPath = path.join(REPORTS_DIR, 'combined-report.html');
  const htmlReport = generateHtmlReport(reportData);
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  console.log(`Combined report saved to: ${htmlReportPath}`);
}

/**
 * Generate HTML report
 */
function generateHtmlReport(data) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Customer Service Assistant - Test Report</title>
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
        .summary {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background-color: #f5f5f5;
          border-radius: 5px;
          padding: 20px;
          flex: 1;
          min-width: 200px;
        }
        .summary-card h3 {
          margin-top: 0;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .metric {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .metric-value {
          font-weight: bold;
        }
        .good {
          color: #4caf50;
        }
        .warning {
          color: #ff9800;
        }
        .error {
          color: #f44336;
        }
        .report-section {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .links {
          margin-top: 20px;
        }
        .links a {
          display: inline-block;
          margin-right: 20px;
          color: #0071e3;
          text-decoration: none;
        }
        .links a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>AI Customer Service Assistant - Test Report</h1>
      <p><strong>Generated:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Unit Tests</h3>
          ${data.summary.unit ? `
            <div class="metric">
              <span>Coverage:</span>
              <span class="metric-value ${getCoverageClass(data.summary.unit.total.lines.pct)}">${data.summary.unit.total.lines.pct}%</span>
            </div>
            <div class="metric">
              <span>Files:</span>
              <span class="metric-value">${data.summary.unit.total.lines.total}</span>
            </div>
          ` : '<p>No data available</p>'}
        </div>
        
        <div class="summary-card">
          <h3>Integration Tests</h3>
          ${data.summary.integration ? `
            <div class="metric">
              <span>Tests:</span>
              <span class="metric-value">${data.summary.integration.tests}</span>
            </div>
            <div class="metric">
              <span>Passing:</span>
              <span class="metric-value ${getPassClass(data.summary.integration.passes, data.summary.integration.tests)}">${data.summary.integration.passes}</span>
            </div>
            <div class="metric">
              <span>Failing:</span>
              <span class="metric-value ${getFailClass(data.summary.integration.failures)}">${data.summary.integration.failures}</span>
            </div>
          ` : '<p>No data available</p>'}
        </div>
        
        <div class="summary-card">
          <h3>E2E Tests</h3>
          ${data.summary.e2e ? `
            <div class="metric">
              <span>Tests:</span>
              <span class="metric-value">${data.summary.e2e.suites.length}</span>
            </div>
            <div class="metric">
              <span>Passing:</span>
              <span class="metric-value ${getPassClass(data.summary.e2e.passed, data.summary.e2e.suites.length)}">${data.summary.e2e.passed}</span>
            </div>
            <div class="metric">
              <span>Failing:</span>
              <span class="metric-value ${getFailClass(data.summary.e2e.failed)}">${data.summary.e2e.failed}</span>
            </div>
          ` : '<p>No data available</p>'}
        </div>
      </div>
      
      <h2>Detailed Reports</h2>
      
      <div class="report-section">
        <h3>Unit Tests</h3>
        ${data.summary.unit ? `
          <p>Total coverage: ${data.summary.unit.total.lines.pct}% (${data.summary.unit.total.lines.covered}/${data.summary.unit.total.lines.total})</p>
          <p>Statements: ${data.summary.unit.total.statements.pct}%</p>
          <p>Branches: ${data.summary.unit.total.branches.pct}%</p>
          <p>Functions: ${data.summary.unit.total.functions.pct}%</p>
        ` : '<p>No data available</p>'}
        
        <div class="links">
          <a href="../coverage/lcov-report/index.html" target="_blank">View Coverage Report</a>
        </div>
      </div>
      
      <div class="report-section">
        <h3>Integration Tests</h3>
        ${data.summary.integration ? `
          <p>Tests: ${data.summary.integration.tests}</p>
          <p>Passing: ${data.summary.integration.passes}</p>
          <p>Failing: ${data.summary.integration.failures}</p>
          <p>Skipped: ${data.summary.integration.pending}</p>
          <p>Duration: ${Math.round(data.summary.integration.duration / 1000)} seconds</p>
        ` : '<p>No data available</p>'}
        
        <div class="links">
          <a href="../cypress/reports/index.html" target="_blank">View Cypress Report</a>
        </div>
      </div>
      
      <div class="report-section">
        <h3>End-to-End Tests</h3>
        ${data.summary.e2e ? `
          <p>Tests: ${data.summary.e2e.suites.length}</p>
          <p>Passing: ${data.summary.e2e.passed}</p>
          <p>Failing: ${data.summary.e2e.failed}</p>
          <p>Flaky: ${data.summary.e2e.flaky}</p>
          <p>Duration: ${Math.round(data.summary.e2e.duration / 1000)} seconds</p>
        ` : '<p>No data available</p>'}
        
        <div class="links">
          <a href="../playwright-report/index.html" target="_blank">View Playwright Report</a>
        </div>
      </div>
      
      <div class="report-section">
        <h3>Performance Tests</h3>
        ${data.summary.performance ? `
          <p>Tests completed for ${Object.keys(data.summary.performance).length} pages</p>
        ` : '<p>No data available</p>'}
        
        <div class="links">
          <a href="../tests/performance/reports/custom-metrics.json" target="_blank">View Performance Metrics</a>
          <a href="../tests/performance/reports/lighthouse-chatbot-demo-enhanced.html" target="_blank">View Lighthouse Report</a>
        </div>
      </div>
      
      <div class="report-section">
        <h3>Accessibility Tests</h3>
        ${data.summary.accessibility ? `
          <p>Tests completed for ${Object.keys(data.summary.accessibility).length} pages</p>
        ` : '<p>No data available</p>'}
        
        <div class="links">
          <a href="../tests/accessibility/reports/accessibility-summary.html" target="_blank">View Accessibility Report</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get CSS class for coverage percentage
 */
function getCoverageClass(percentage) {
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'warning';
  return 'error';
}

/**
 * Get CSS class for passing tests
 */
function getPassClass(passes, total) {
  const percentage = (passes / total) * 100;
  if (percentage >= 90) return 'good';
  if (percentage >= 70) return 'warning';
  return 'error';
}

/**
 * Get CSS class for failing tests
 */
function getFailClass(failures) {
  if (failures === 0) return 'good';
  if (failures <= 2) return 'warning';
  return 'error';
}

/**
 * Run all tests
 */
function runAllTests() {
  try {
    // Start local server
    console.log('\n=== Starting Local Server ===\n');
    const serverProcess = require('child_process').spawn('npx', ['http-server', '-p', '8000'], {
      stdio: 'ignore',
      detached: true
    });
    
    // Give server time to start
    console.log('Waiting for server to start...');
    setTimeout(() => {
      try {
        // Run tests
        runUnitTests();
        runIntegrationTests();
        runE2ETests();
        runPerformanceTests();
        runAccessibilityTests();
        
        // Generate combined report
        generateCombinedReport();
        
        console.log('\n=== All Tests Completed ===\n');
        
        // Kill server
        process.kill(-serverProcess.pid);
      } catch (error) {
        console.error('Error running tests:', error);
        process.kill(-serverProcess.pid);
      }
    }, 3000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

// Run all tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runUnitTests,
  runIntegrationTests,
  runE2ETests,
  runPerformanceTests,
  runAccessibilityTests,
  runAllTests
};
