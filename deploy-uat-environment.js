/**
 * UAT Environment Deployment Script
 * 
 * This script deploys the latest chatbot version to the UAT environment,
 * applies UAT-specific configurations, and sets up monitoring.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
    sourceFile: 'integrated-chatbot-basic.html',
    uatFile: 'uat/integrated-chatbot-uat.html',
    uatDir: 'uat',
    uatSubdirs: ['logs', 'data', 'reports', 'feedback', 'test-files'],
    backupFile: 'uat/integrated-chatbot-backup.html',
    uatVersion: new Date().toISOString()
};

/**
 * Main deployment function
 */
function deployUATEnvironment() {
    console.log('Starting UAT environment deployment...');
    
    try {
        // Create UAT directory structure
        createDirectoryStructure();
        
        // Copy the latest chatbot version to UAT environment
        copyLatestVersion();
        
        // Apply UAT-specific configurations
        applyUATConfigurations();
        
        // Set up monitoring and feedback collection
        setupMonitoringAndFeedback();
        
        console.log('UAT environment deployment completed successfully!');
        
        return {
            success: true,
            uatUrl: 'http://localhost:8080/uat/integrated-chatbot-uat.html',
            deploymentTime: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error deploying UAT environment:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Create UAT directory structure
 */
function createDirectoryStructure() {
    console.log('Creating UAT directory structure...');
    
    // Create main UAT directory if it doesn't exist
    if (!fs.existsSync(config.uatDir)) {
        fs.mkdirSync(config.uatDir);
        console.log(`Created directory: ${config.uatDir}`);
    }
    
    // Create subdirectories
    config.uatSubdirs.forEach(subdir => {
        const dirPath = path.join(config.uatDir, subdir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    });
}

/**
 * Copy the latest chatbot version to UAT environment
 */
function copyLatestVersion() {
    console.log('Copying latest chatbot version to UAT environment...');
    
    // Check if source file exists
    if (!fs.existsSync(config.sourceFile)) {
        throw new Error(`Source file not found: ${config.sourceFile}`);
    }
    
    // Create backup of current UAT file if it exists
    if (fs.existsSync(config.uatFile)) {
        fs.copyFileSync(config.uatFile, config.backupFile);
        console.log(`Created backup: ${config.backupFile}`);
    }
    
    // Copy source file to UAT environment
    fs.copyFileSync(config.sourceFile, config.uatFile);
    console.log(`Copied ${config.sourceFile} to ${config.uatFile}`);
}

/**
 * Apply UAT-specific configurations
 */
function applyUATConfigurations() {
    console.log('Applying UAT-specific configurations...');
    
    // Read the UAT file
    let chatbotHtml = fs.readFileSync(config.uatFile, 'utf8');
    
    // Add UAT-specific configurations
    chatbotHtml = chatbotHtml.replace(
        '// Performance optimization variables',
        `// UAT Environment Configuration
        const UAT_MODE = true;
        const UAT_VERSION = '${config.uatVersion}';
        const UAT_LOGGING = true;
        const UAT_FEEDBACK_ENABLED = true;
        
        // Performance optimization variables`
    );
    
    // Add UAT indicator to title
    chatbotHtml = chatbotHtml.replace(
        '<title>Integrated AI Customer Service Assistant</title>',
        '<title>UAT - Integrated AI Customer Service Assistant</title>'
    );
    
    // Add UAT styles
    chatbotHtml = chatbotHtml.replace(
        '</style>',
        `
        /* UAT Specific Styles */
        .uat-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ff9800;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
        }
        
        .uat-feedback-button {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .uat-feedback-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-width: 90%;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10001;
        }
        
        .uat-feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .uat-feedback-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .uat-feedback-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
        
        .uat-feedback-body {
            padding: 15px;
        }
        
        .uat-rating {
            display: flex;
            justify-content: center;
            margin: 15px 0;
        }
        
        .uat-star {
            font-size: 30px;
            color: #ddd;
            cursor: pointer;
            margin: 0 5px;
        }
        
        .uat-star:hover, .uat-star.selected {
            color: #FFD700;
        }
        
        .uat-feedback-text {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }
        
        .uat-submit-feedback {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
        }
        
        .uat-test-case {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: #2196F3;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
        }
        
        .uat-test-controls {
            position: fixed;
            top: 40px;
            left: 10px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .uat-test-button {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .uat-test-button.pass {
            background-color: #4CAF50;
        }
        
        .uat-test-button.fail {
            background-color: #F44336;
        }
        </style>`
    );
    
    // Add UAT feedback mechanism
    chatbotHtml = chatbotHtml.replace(
        '</script>',
        `
        // UAT Feedback Collection
        function collectUATFeedback() {
            const feedbackContainer = document.createElement('div');
            feedbackContainer.classList.add('uat-feedback-container');
            feedbackContainer.innerHTML = \`
                <div class="uat-feedback-header">
                    <h3>UAT Feedback</h3>
                    <button class="uat-feedback-close">&times;</button>
                </div>
                <div class="uat-feedback-body">
                    <p>Please rate your experience with the chatbot:</p>
                    <div class="uat-rating">
                        <span class="uat-star" data-rating="1">★</span>
                        <span class="uat-star" data-rating="2">★</span>
                        <span class="uat-star" data-rating="3">★</span>
                        <span class="uat-star" data-rating="4">★</span>
                        <span class="uat-star" data-rating="5">★</span>
                    </div>
                    <p>What worked well?</p>
                    <textarea class="uat-feedback-text" id="uatPositive" rows="3"></textarea>
                    <p>What didn't work well?</p>
                    <textarea class="uat-feedback-text" id="uatNegative" rows="3"></textarea>
                    <p>Any suggestions for improvement?</p>
                    <textarea class="uat-feedback-text" id="uatSuggestions" rows="3"></textarea>
                    <button class="uat-submit-feedback">Submit Feedback</button>
                </div>
            \`;
            
            document.body.appendChild(feedbackContainer);
            
            // Add event listeners
            document.querySelector('.uat-feedback-close').addEventListener('click', () => {
                feedbackContainer.remove();
            });
            
            // Star rating
            document.querySelectorAll('.uat-star').forEach(star => {
                star.addEventListener('click', (e) => {
                    const rating = e.target.dataset.rating;
                    document.querySelectorAll('.uat-star').forEach(s => {
                        s.classList.remove('selected');
                        if (s.dataset.rating <= rating) {
                            s.classList.add('selected');
                        }
                    });
                });
            });
            
            // Submit feedback
            document.querySelector('.uat-submit-feedback').addEventListener('click', () => {
                const rating = document.querySelectorAll('.uat-star.selected').length;
                const positive = document.getElementById('uatPositive').value;
                const negative = document.getElementById('uatNegative').value;
                const suggestions = document.getElementById('uatSuggestions').value;
                
                const feedback = {
                    timestamp: new Date().toISOString(),
                    rating,
                    positive,
                    negative,
                    suggestions,
                    conversationHistory: allMessages.map(msg => ({
                        type: msg.type,
                        content: msg.content,
                        time: msg.time
                    }))
                };
                
                // In a real environment, this would send to a server
                console.log('UAT Feedback:', feedback);
                localStorage.setItem('uat-feedback-' + new Date().getTime(), JSON.stringify(feedback));
                
                // Show thank you message
                feedbackContainer.innerHTML = \`
                    <div class="uat-feedback-header">
                        <h3>Thank You!</h3>
                        <button class="uat-feedback-close">&times;</button>
                    </div>
                    <div class="uat-feedback-body">
                        <p>Your feedback has been recorded. Thank you for helping us improve the AI Customer Service Assistant!</p>
                    </div>
                \`;
                
                document.querySelector('.uat-feedback-close').addEventListener('click', () => {
                    feedbackContainer.remove();
                });
                
                // Auto-close after 5 seconds
                setTimeout(() => {
                    if (document.body.contains(feedbackContainer)) {
                        feedbackContainer.remove();
                    }
                }, 5000);
            });
        }
        
        // UAT Test Case Controls
        function setupUATTestControls() {
            // Get test case ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const testCaseId = urlParams.get('testCase');
            
            if (testCaseId) {
                // Add test case indicator
                const testCaseIndicator = document.createElement('div');
                testCaseIndicator.classList.add('uat-test-case');
                testCaseIndicator.textContent = 'Test Case: ' + testCaseId;
                document.body.appendChild(testCaseIndicator);
                
                // Add test controls
                const testControls = document.createElement('div');
                testControls.classList.add('uat-test-controls');
                testControls.innerHTML = \`
                    <button class="uat-test-button pass" id="uatPassButton">Pass Test</button>
                    <button class="uat-test-button fail" id="uatFailButton">Fail Test</button>
                    <select id="uatSeveritySelect" style="margin-top: 5px; display: none;">
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <textarea id="uatTestNotes" placeholder="Test notes..." style="margin-top: 5px; width: 150px; height: 60px;"></textarea>
                \`;
                document.body.appendChild(testControls);
                
                // Add event listeners
                document.getElementById('uatPassButton').addEventListener('click', () => {
                    const notes = document.getElementById('uatTestNotes').value;
                    const result = {
                        testCase: testCaseId,
                        result: 'Pass',
                        notes,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem('uat-test-result-' + testCaseId, JSON.stringify(result));
                    alert('Test case ' + testCaseId + ' marked as PASSED');
                });
                
                document.getElementById('uatFailButton').addEventListener('click', () => {
                    const severitySelect = document.getElementById('uatSeveritySelect');
                    severitySelect.style.display = 'block';
                    
                    // Change event listener for severity select
                    severitySelect.addEventListener('change', () => {
                        const severity = severitySelect.value;
                        const notes = document.getElementById('uatTestNotes').value;
                        const result = {
                            testCase: testCaseId,
                            result: 'Fail',
                            severity,
                            notes,
                            timestamp: new Date().toISOString()
                        };
                        localStorage.setItem('uat-test-result-' + testCaseId, JSON.stringify(result));
                        alert('Test case ' + testCaseId + ' marked as FAILED with ' + severity + ' severity');
                    });
                });
            }
        }
        
        // Add UAT elements when page loads
        if (UAT_MODE) {
            window.addEventListener('load', () => {
                // Add UAT indicator
                const uatIndicator = document.createElement('div');
                uatIndicator.classList.add('uat-indicator');
                uatIndicator.textContent = 'UAT MODE';
                document.body.appendChild(uatIndicator);
                
                // Add feedback button
                const feedbackButton = document.createElement('button');
                feedbackButton.classList.add('uat-feedback-button');
                feedbackButton.textContent = 'Provide Feedback';
                feedbackButton.addEventListener('click', collectUATFeedback);
                document.body.appendChild(feedbackButton);
                
                // Setup test controls if in a test case
                setupUATTestControls();
                
                // Log UAT session start
                console.log('UAT Session Started:', {
                    version: UAT_VERSION,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
            });
            
            // Add performance logging
            const originalLogPerformance = logPerformance;
            logPerformance = function(metric, value) {
                // Call original function
                originalLogPerformance(metric, value);
                
                // Additional UAT logging
                if (UAT_LOGGING) {
                    const logEntry = {
                        metric,
                        value,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Store in localStorage for later retrieval
                    const performanceLogs = JSON.parse(localStorage.getItem('uat-performance-logs') || '[]');
                    performanceLogs.push(logEntry);
                    localStorage.setItem('uat-performance-logs', JSON.stringify(performanceLogs));
                }
            };
        }
        </script>`
    );
    
    // Write the modified file
    fs.writeFileSync(config.uatFile, chatbotHtml);
    console.log('Applied UAT-specific configurations');
}

/**
 * Set up monitoring and feedback collection
 */
function setupMonitoringAndFeedback() {
    console.log('Setting up monitoring and feedback collection...');
    
    // Create monitoring script
    const monitoringScript = `
/**
 * UAT Monitoring Script
 * 
 * This script collects and processes UAT feedback and performance data.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// Configuration
const config = {
    port: 8081,
    dataDir: '${path.join(config.uatDir, 'data')}',
    logsDir: '${path.join(config.uatDir, 'logs')}',
    feedbackDir: '${path.join(config.uatDir, 'feedback')}'
};

// Create HTTP server to collect feedback
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }
    
    // Handle feedback submission
    if (parsedUrl.pathname === '/api/feedback' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const feedback = JSON.parse(body);
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const filename = \`feedback-\${timestamp}.json\`;
                
                fs.writeFileSync(path.join(config.feedbackDir, filename), JSON.stringify(feedback, null, 2));
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error('Error processing feedback:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        
        return;
    }
    
    // Handle test result submission
    if (parsedUrl.pathname === '/api/test-result' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const testResult = JSON.parse(body);
                const filename = \`test-result-\${testResult.testCase}.json\`;
                
                fs.writeFileSync(path.join(config.dataDir, filename), JSON.stringify(testResult, null, 2));
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error('Error processing test result:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        
        return;
    }
    
    // Handle performance log submission
    if (parsedUrl.pathname === '/api/performance-logs' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const logs = JSON.parse(body);
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const filename = \`performance-logs-\${timestamp}.json\`;
                
                fs.writeFileSync(path.join(config.logsDir, filename), JSON.stringify(logs, null, 2));
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error('Error processing performance logs:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        
        return;
    }
    
    // Default response for unknown endpoints
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
});

// Start server
server.listen(config.port, () => {
    console.log(\`UAT monitoring server running at http://localhost:\${config.port}/\`);
});

// Process to handle server shutdown
process.on('SIGINT', () => {
    console.log('Shutting down UAT monitoring server...');
    server.close(() => {
        console.log('UAT monitoring server closed');
        process.exit(0);
    });
});
`;
    
    // Write monitoring script to file
    fs.writeFileSync(path.join(config.uatDir, 'uat-monitoring.js'), monitoringScript);
    console.log('Created monitoring script');
    
    // Create a README file with instructions
    const readmeContent = `# UAT Monitoring and Feedback Collection

## Overview

This directory contains the UAT environment for the AI Customer Service Assistant.

## Files and Directories

- \`integrated-chatbot-uat.html\`: The UAT version of the chatbot
- \`integrated-chatbot-backup.html\`: Backup of the previous UAT version
- \`uat-monitoring.js\`: Script for collecting and processing UAT feedback and performance data
- \`logs/\`: Directory for UAT logs
- \`data/\`: Directory for UAT data
- \`reports/\`: Directory for UAT reports
- \`feedback/\`: Directory for UAT feedback
- \`test-files/\`: Directory for UAT test files

## Starting the UAT Environment

1. Start the monitoring server:
   \`\`\`
   node uat-monitoring.js
   \`\`\`

2. Serve the UAT chatbot:
   \`\`\`
   npx http-server -p 8080
   \`\`\`

3. Access the UAT chatbot at:
   \`\`\`
   http://localhost:8080/uat/integrated-chatbot-uat.html
   \`\`\`

## Running Test Cases

To run a specific test case, add the \`testCase\` parameter to the URL:

\`\`\`
http://localhost:8080/uat/integrated-chatbot-uat.html?testCase=BF-01
\`\`\`

This will display test controls that allow testers to mark the test as passed or failed.

## Collecting Feedback

Testers can provide feedback by clicking the "Provide Feedback" button in the UAT environment.

## Monitoring

The monitoring server collects:
- Test results
- Feedback submissions
- Performance logs

This data is stored in the respective directories for later analysis.
`;
    
    // Write README file
    fs.writeFileSync(path.join(config.uatDir, 'README.md'), readmeContent);
    console.log('Created README file with instructions');
}

// Execute the deployment if this script is run directly
if (require.main === module) {
    const result = deployUATEnvironment();
    
    if (result.success) {
        console.log(`UAT environment deployed successfully!`);
        console.log(`Access the UAT chatbot at: ${result.uatUrl}`);
    } else {
        console.error(`Failed to deploy UAT environment: ${result.error}`);
        process.exit(1);
    }
}

module.exports = {
    deployUATEnvironment
};
