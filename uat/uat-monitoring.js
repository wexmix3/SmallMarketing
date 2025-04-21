
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
    dataDir: 'uat\data',
    logsDir: 'uat\logs',
    feedbackDir: 'uat\feedback'
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
                const filename = `feedback-${timestamp}.json`;
                
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
                const filename = `test-result-${testResult.testCase}.json`;
                
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
                const filename = `performance-logs-${timestamp}.json`;
                
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
    console.log(`UAT monitoring server running at http://localhost:${config.port}/`);
});

// Process to handle server shutdown
process.on('SIGINT', () => {
    console.log('Shutting down UAT monitoring server...');
    server.close(() => {
        console.log('UAT monitoring server closed');
        process.exit(0);
    });
});
