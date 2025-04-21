/**
 * Automated Integration Test Runner for AI Customer Service Assistant
 * 
 * This script can be used to run integration tests in a headless browser
 * as part of a CI/CD pipeline.
 * 
 * Usage:
 * node run-integration-tests.js [--category=<category>] [--report=<report-path>]
 * 
 * Options:
 * --category=<category>  Run tests for a specific category only
 * --report=<report-path> Path to save the test report (default: test-report.md)
 * --timeout=<seconds>    Timeout for the entire test run in seconds (default: 300)
 * --headless             Run in headless mode (no browser UI)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    category: null,
    reportPath: 'test-report.md',
    timeout: 300,
    headless: false
};

args.forEach(arg => {
    if (arg.startsWith('--category=')) {
        options.category = arg.split('=')[1];
    } else if (arg.startsWith('--report=')) {
        options.reportPath = arg.split('=')[1];
    } else if (arg.startsWith('--timeout=')) {
        options.timeout = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--headless') {
        options.headless = true;
    }
});

// Main function to run tests
async function runTests() {
    console.log('Starting automated integration tests...');
    console.log(`Options: ${JSON.stringify(options, null, 2)}`);
    
    // Launch browser
    const browser = await puppeteer.launch({
        headless: options.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1280, height: 800 }
    });
    
    try {
        // Open a new page
        const page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', message => {
            const type = message.type().substr(0, 3).toUpperCase();
            const text = message.text();
            
            // Filter out noisy messages
            if (!text.includes('DevTools') && !text.includes('favicon.ico')) {
                console.log(`[BROWSER ${type}] ${text}`);
            }
        });
        
        // Navigate to the test runner page
        console.log('Loading test runner...');
        await page.goto(`file://${path.resolve('integration-test-runner.html')}`, {
            waitUntil: 'networkidle0',
            timeout: options.timeout * 1000
        });
        
        // Wait for test runner to initialize
        await page.waitForFunction(() => {
            const frame = document.getElementById('chatbotFrame');
            return frame && frame.contentWindow && frame.contentWindow.testRunner;
        }, { timeout: 10000 });
        
        console.log('Test runner loaded successfully');
        
        // Run tests
        let testResults;
        if (options.category) {
            console.log(`Running tests for category: ${options.category}`);
            testResults = await page.evaluate((category) => {
                const frame = document.getElementById('chatbotFrame');
                return frame.contentWindow.testRunner.runCategory(category);
            }, options.category);
        } else {
            console.log('Running all tests');
            testResults = await page.evaluate(() => {
                const frame = document.getElementById('chatbotFrame');
                return frame.contentWindow.testRunner.runAll();
            });
        }
        
        // Generate report
        console.log('Generating test report...');
        const report = await page.evaluate(() => {
            const frame = document.getElementById('chatbotFrame');
            const testResults = frame.contentWindow.testRunner.getResults();
            return frame.contentWindow.generateTestReport(testResults);
        });
        
        // Save report
        fs.writeFileSync(options.reportPath, report);
        console.log(`Test report saved to ${options.reportPath}`);
        
        // Log summary
        console.log(`\nTest Summary:`);
        console.log(`Total: ${testResults.summary.total}`);
        console.log(`Passed: ${testResults.summary.passed}`);
        console.log(`Failed: ${testResults.summary.failed}`);
        console.log(`Pending: ${testResults.summary.pending}`);
        console.log(`Pass Rate: ${Math.round((testResults.summary.passed / testResults.summary.total) * 100)}%`);
        
        // Return exit code based on test results
        return testResults.summary.failed === 0 ? 0 : 1;
    } catch (error) {
        console.error('Error running tests:', error);
        return 2;
    } finally {
        // Close browser
        await browser.close();
    }
}

// Run tests and exit with appropriate code
runTests()
    .then(exitCode => {
        process.exit(exitCode);
    })
    .catch(error => {
        console.error('Unhandled error:', error);
        process.exit(2);
    });
