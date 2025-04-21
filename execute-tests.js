/**
 * Test Execution Script for AI Customer Service Assistant
 * 
 * This script automates the execution of tests for the AI Customer Service Assistant.
 * It can run different types of tests and generate reports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const testTypes = args.length > 0 ? args : ['unit', 'api', 'e2e'];
const generateReport = args.includes('--report');
const environment = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'testing';

// Configuration
const config = {
  testCommands: {
    unit: 'jest --testPathPattern=test/unit',
    api: 'jest --testPathPattern=test/api',
    e2e: 'cypress run',
    performance: 'node test/performance/run-performance-tests.js',
    security: 'node test/security/run-security-tests.js',
    accessibility: 'node test/accessibility/run-accessibility-tests.js'
  },
  reportDir: './test-reports',
  timeoutMinutes: 30
};

/**
 * Run a specific test type
 * @param {string} testType - Type of test to run
 * @returns {boolean} - Whether the test succeeded
 */
function runTest(testType) {
  console.log(`\n📋 Running ${testType} tests...\n`);
  
  const command = config.testCommands[testType];
  if (!command) {
    console.error(`❌ Unknown test type: ${testType}`);
    return false;
  }
  
  try {
    // Set environment variables
    process.env.NODE_ENV = environment;
    process.env.TEST_TYPE = testType;
    
    // Create a timestamp for this test run
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    
    // Execute the test command
    execSync(`${command} --env=${environment}`, { 
      stdio: 'inherit',
      timeout: config.timeoutMinutes * 60 * 1000
    });
    
    // Create test results directory if generating reports
    if (generateReport) {
      const testReportDir = path.join(config.reportDir, testType, timestamp);
      if (!fs.existsSync(testReportDir)) {
        fs.mkdirSync(testReportDir, { recursive: true });
      }
      
      // Copy test results to report directory
      if (testType === 'unit' || testType === 'api') {
        // Copy Jest coverage reports
        if (fs.existsSync('./coverage')) {
          execSync(`cp -r ./coverage ${testReportDir}/`);
        }
      } else if (testType === 'e2e') {
        // Copy Cypress videos and screenshots
        if (fs.existsSync('./cypress/videos')) {
          execSync(`cp -r ./cypress/videos ${testReportDir}/`);
        }
        if (fs.existsSync('./cypress/screenshots')) {
          execSync(`cp -r ./cypress/screenshots ${testReportDir}/`);
        }
      } else if (testType === 'performance') {
        // Copy performance test results
        if (fs.existsSync('./test/performance/results')) {
          execSync(`cp -r ./test/performance/results ${testReportDir}/`);
        }
      }
      
      console.log(`📊 Test report saved to ${testReportDir}`);
    }
    
    console.log(`\n✅ ${testType} tests completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${testType} tests failed: ${error.message}\n`);
    return false;
  }
}

/**
 * Generate a summary report of all test runs
 * @param {Object} results - Test results by type
 */
function generateSummaryReport(results) {
  console.log('\n📊 Generating summary report...');
  
  const summaryDir = path.join(config.reportDir, 'summary');
  if (!fs.existsSync(summaryDir)) {
    fs.mkdirSync(summaryDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const summaryFile = path.join(summaryDir, `summary-${timestamp}.json`);
  
  const summary = {
    timestamp,
    environment,
    results,
    overall: Object.values(results).every(result => result === true)
  };
  
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  // Generate HTML report
  const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Summary Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    h1 { color: #2c3e50; }
    .summary { margin-bottom: 20px; }
    .test-results { border-collapse: collapse; width: 100%; }
    .test-results th, .test-results td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .test-results th { background-color: #f2f2f2; }
    .success { color: #27ae60; }
    .failure { color: #e74c3c; }
    .overall { font-size: 1.2em; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Test Summary Report</h1>
  
  <div class="summary">
    <p><strong>Environment:</strong> ${environment}</p>
    <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
  </div>
  
  <table class="test-results">
    <tr>
      <th>Test Type</th>
      <th>Status</th>
    </tr>
    ${Object.entries(results).map(([type, success]) => `
    <tr>
      <td>${type}</td>
      <td class="${success ? 'success' : 'failure'}">${success ? 'PASSED' : 'FAILED'}</td>
    </tr>
    `).join('')}
  </table>
  
  <p class="overall ${summary.overall ? 'success' : 'failure'}">
    Overall Status: ${summary.overall ? 'PASSED' : 'FAILED'}
  </p>
</body>
</html>
  `;
  
  const htmlReportFile = path.join(summaryDir, `summary-${timestamp}.html`);
  fs.writeFileSync(htmlReportFile, htmlReport);
  
  console.log(`📊 Summary report saved to ${summaryFile}`);
  console.log(`📊 HTML report saved to ${htmlReportFile}`);
}

/**
 * Main function to run tests
 */
async function main() {
  console.log(`\n🚀 Starting test execution in ${environment} environment...\n`);
  console.log(`📋 Tests to run: ${testTypes.join(', ')}`);
  
  // Create report directory if needed
  if (generateReport && !fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true });
  }
  
  // Run each test type and collect results
  const results = {};
  for (const testType of testTypes) {
    if (config.testCommands[testType]) {
      results[testType] = runTest(testType);
    } else {
      console.warn(`⚠️ Skipping unknown test type: ${testType}`);
    }
  }
  
  // Generate summary report if requested
  if (generateReport) {
    generateSummaryReport(results);
  }
  
  // Determine overall success
  const overallSuccess = Object.values(results).every(result => result === true);
  
  console.log('\n📋 Test Execution Summary:');
  Object.entries(results).forEach(([type, success]) => {
    console.log(`${success ? '✅' : '❌'} ${type}: ${success ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n${overallSuccess ? '✅ All tests passed!' : '❌ Some tests failed!'}\n`);
  
  // Exit with appropriate code
  process.exit(overallSuccess ? 0 : 1);
}

// Run the main function
main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
