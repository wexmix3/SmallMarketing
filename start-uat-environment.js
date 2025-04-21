/**
 * UAT Environment Starter Script
 * 
 * This script starts the UAT environment by:
 * 1. Deploying the latest chatbot version to the UAT environment
 * 2. Starting the monitoring server
 * 3. Starting a web server to serve the UAT files
 */

const { execSync, spawn } = require('child_process');
const { deployUATEnvironment } = require('./deploy-uat-environment');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
    httpServerPort: 8080,
    monitoringServerPort: 8081
};

/**
 * Main function to start the UAT environment
 */
async function startUATEnvironment() {
    console.log('Starting UAT environment...');
    
    try {
        // Step 1: Deploy the latest chatbot version to UAT environment
        console.log('Deploying latest chatbot version to UAT environment...');
        const deployResult = await deployUATEnvironment();
        
        if (!deployResult.success) {
            throw new Error(`Failed to deploy UAT environment: ${deployResult.error}`);
        }
        
        console.log('UAT environment deployed successfully!');
        
        // Step 2: Start the monitoring server
        console.log('Starting monitoring server...');
        const monitoringServer = spawn('node', ['uat/uat-monitoring.js'], {
            stdio: 'inherit',
            detached: true
        });
        
        monitoringServer.on('error', (error) => {
            console.error('Error starting monitoring server:', error);
        });
        
        // Step 3: Start the web server
        console.log('Starting web server...');
        
        // Check if http-server is installed
        try {
            execSync('npx http-server --version', { stdio: 'ignore' });
        } catch (error) {
            console.log('http-server not found, installing...');
            execSync('npm install -g http-server', { stdio: 'inherit' });
        }
        
        const webServer = spawn('npx', ['http-server', '.', '-p', config.httpServerPort], {
            stdio: 'inherit',
            detached: true
        });
        
        webServer.on('error', (error) => {
            console.error('Error starting web server:', error);
        });
        
        // Create a file with access URLs
        const accessInfo = {
            uatDashboard: `http://localhost:${config.httpServerPort}/uat/uat-dashboard.html`,
            uatChatbot: `http://localhost:${config.httpServerPort}/uat/integrated-chatbot-uat.html`,
            monitoringServer: `http://localhost:${config.monitoringServerPort}`
        };
        
        fs.writeFileSync('uat-access-info.json', JSON.stringify(accessInfo, null, 2));
        
        console.log('\nUAT Environment is now running!');
        console.log('--------------------------------');
        console.log(`UAT Dashboard: ${accessInfo.uatDashboard}`);
        console.log(`UAT Chatbot: ${accessInfo.uatChatbot}`);
        console.log(`Monitoring Server: ${accessInfo.monitoringServer}`);
        console.log('\nPress Ctrl+C to stop the UAT environment.');
        
        // Keep the script running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', () => {
            console.log('\nStopping UAT environment...');
            
            // Kill child processes
            if (monitoringServer.pid) {
                process.kill(-monitoringServer.pid);
            }
            
            if (webServer.pid) {
                process.kill(-webServer.pid);
            }
            
            console.log('UAT environment stopped.');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Error starting UAT environment:', error);
        process.exit(1);
    }
}

// Start the UAT environment
startUATEnvironment();
