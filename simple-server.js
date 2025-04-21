const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.url}`);
    
    // Serve the test-server.html file for the root path
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'test-server.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading test-server.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // Serve the UAT dashboard
    if (req.url === '/uat-dashboard') {
        fs.readFile(path.join(__dirname, 'uat/uat-dashboard.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading uat-dashboard.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // Serve the UAT chatbot
    if (req.url === '/uat-chatbot') {
        fs.readFile(path.join(__dirname, 'uat/integrated-chatbot-uat.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading integrated-chatbot-uat.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // Serve CSS files
    if (req.url.endsWith('.css')) {
        const cssPath = path.join(__dirname, req.url);
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS file not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
        return;
    }
    
    // Serve JavaScript files
    if (req.url.endsWith('.js')) {
        const jsPath = path.join(__dirname, req.url);
        fs.readFile(jsPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('JavaScript file not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
        return;
    }
    
    // Default: 404 Not Found
    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`UAT Dashboard: http://localhost:${PORT}/uat-dashboard`);
    console.log(`UAT Chatbot: http://localhost:${PORT}/uat-chatbot`);
});
