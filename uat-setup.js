/**
 * UAT Environment Setup Script
 * 
 * This script prepares the AI Customer Service Assistant for User Acceptance Testing.
 * It creates a dedicated UAT environment, loads test data, and configures the system
 * for testing.
 */

// Configuration
const config = {
    environment: 'uat',
    resetDatabase: true,
    loadTestData: true,
    enableLogging: true,
    createTestUsers: true,
    testDataPath: './test-data/',
    logPath: './logs/uat/'
};

// Import required modules
const fs = require('fs');
const path = require('path');

/**
 * Main setup function
 */
async function setupUATEnvironment() {
    console.log('Starting UAT environment setup...');
    
    try {
        // Create necessary directories
        createDirectories();
        
        // Copy the latest chatbot version to UAT environment
        copyLatestVersion();
        
        // Configure UAT-specific settings
        configureUATSettings();
        
        // Set up logging
        setupLogging();
        
        // Load test data if configured
        if (config.loadTestData) {
            await loadTestData();
        }
        
        // Create test users if configured
        if (config.createTestUsers) {
            await createTestUsers();
        }
        
        // Generate access links for testers
        const accessLinks = generateAccessLinks();
        
        // Save setup information
        saveSetupInfo(accessLinks);
        
        console.log('UAT environment setup completed successfully!');
        console.log('Access links for testers have been saved to uat-access-links.json');
        
        return {
            success: true,
            accessLinks,
            setupTime: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error setting up UAT environment:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Create necessary directories for UAT
 */
function createDirectories() {
    console.log('Creating necessary directories...');
    
    const directories = [
        './uat',
        './uat/logs',
        './uat/data',
        './uat/reports',
        './uat/feedback'
    ];
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
}

/**
 * Copy the latest version of the chatbot to UAT environment
 */
function copyLatestVersion() {
    console.log('Copying latest chatbot version to UAT environment...');
    
    // Copy the main HTML file
    fs.copyFileSync(
        'integrated-chatbot-basic.html',
        './uat/integrated-chatbot-uat.html'
    );
    
    // Create a backup copy
    fs.copyFileSync(
        'integrated-chatbot-basic.html',
        './uat/integrated-chatbot-backup.html'
    );
    
    console.log('Latest version copied to UAT environment');
}

/**
 * Configure UAT-specific settings
 */
function configureUATSettings() {
    console.log('Configuring UAT-specific settings...');
    
    // Read the UAT HTML file
    let chatbotHtml = fs.readFileSync('./uat/integrated-chatbot-uat.html', 'utf8');
    
    // Add UAT-specific configurations
    chatbotHtml = chatbotHtml.replace(
        '// Performance optimization variables',
        `// UAT Environment Configuration
        const UAT_MODE = true;
        const UAT_VERSION = '${new Date().toISOString()}';
        const UAT_LOGGING = true;
        const UAT_FEEDBACK_ENABLED = true;
        
        // Performance optimization variables`
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
        
        // Add UAT feedback button
        if (UAT_MODE && UAT_FEEDBACK_ENABLED) {
            window.addEventListener('load', () => {
                const feedbackButton = document.createElement('button');
                feedbackButton.classList.add('uat-feedback-button');
                feedbackButton.textContent = 'Provide Feedback';
                feedbackButton.addEventListener('click', collectUATFeedback);
                document.body.appendChild(feedbackButton);
                
                // Add UAT indicator
                const uatIndicator = document.createElement('div');
                uatIndicator.classList.add('uat-indicator');
                uatIndicator.textContent = 'UAT MODE';
                document.body.appendChild(uatIndicator);
            });
        }
        </script>`
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
            bottom: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
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
        </style>`
    );
    
    // Write the modified file
    fs.writeFileSync('./uat/integrated-chatbot-uat.html', chatbotHtml);
    
    console.log('UAT-specific settings configured');
}

/**
 * Set up logging for UAT
 */
function setupLogging() {
    console.log('Setting up logging for UAT...');
    
    // Create log directory if it doesn't exist
    if (!fs.existsSync('./uat/logs')) {
        fs.mkdirSync('./uat/logs', { recursive: true });
    }
    
    // Create a log file for this UAT session
    const logFileName = `uat-session-${new Date().toISOString().replace(/:/g, '-')}.log`;
    fs.writeFileSync(`./uat/logs/${logFileName}`, `UAT Session started at ${new Date().toISOString()}\n`);
    
    console.log(`Logging set up. Log file: ${logFileName}`);
}

/**
 * Load test data for UAT
 */
async function loadTestData() {
    console.log('Loading test data...');
    
    // Sample test data - in a real scenario, this would load from files or a database
    const testData = {
        intents: [
            {
                name: 'test_intent_1',
                patterns: [
                    { text: 'test question 1', weight: 1.0 },
                    { text: 'test query 1', weight: 0.9 }
                ],
                responses: [
                    "This is a test response for UAT testing.",
                    "This is an alternative test response for UAT."
                ]
            },
            {
                name: 'test_intent_2',
                patterns: [
                    { text: 'test question 2', weight: 1.0 },
                    { text: 'test query 2', weight: 0.9 }
                ],
                responses: [
                    "This is another test response for UAT testing.",
                    "This is an alternative test response for the second test intent."
                ]
            }
        ],
        testFiles: [
            {
                name: 'test-image-1.jpg',
                type: 'image/jpeg',
                size: 1024 * 50 // 50KB
            },
            {
                name: 'test-document-1.pdf',
                type: 'application/pdf',
                size: 1024 * 100 // 100KB
            }
        ]
    };
    
    // Save test data to UAT environment
    fs.writeFileSync('./uat/data/test-data.json', JSON.stringify(testData, null, 2));
    
    console.log('Test data loaded');
}

/**
 * Create test users for UAT
 */
async function createTestUsers() {
    console.log('Creating test users...');
    
    // Sample test users - in a real scenario, this would create actual user accounts
    const testUsers = [
        {
            id: 'uat-tester-1',
            name: 'Internal Tester 1',
            email: 'internal-tester-1@example.com',
            role: 'internal',
            permissions: ['basic', 'advanced']
        },
        {
            id: 'uat-tester-2',
            name: 'Internal Tester 2',
            email: 'internal-tester-2@example.com',
            role: 'internal',
            permissions: ['basic', 'advanced']
        },
        {
            id: 'uat-tester-3',
            name: 'External Tester 1',
            email: 'external-tester-1@example.com',
            role: 'external',
            permissions: ['basic']
        },
        {
            id: 'uat-tester-4',
            name: 'External Tester 2',
            email: 'external-tester-2@example.com',
            role: 'external',
            permissions: ['basic']
        }
    ];
    
    // Save test users to UAT environment
    fs.writeFileSync('./uat/data/test-users.json', JSON.stringify(testUsers, null, 2));
    
    console.log('Test users created');
}

/**
 * Generate access links for testers
 */
function generateAccessLinks() {
    console.log('Generating access links for testers...');
    
    // In a real scenario, these would be actual URLs with authentication tokens
    const baseUrl = 'http://localhost:8080/uat/integrated-chatbot-uat.html';
    
    const accessLinks = {
        internal: {
            basic: `${baseUrl}?role=internal&mode=basic&session=${Date.now()}`,
            advanced: `${baseUrl}?role=internal&mode=advanced&session=${Date.now()}`
        },
        external: {
            basic: `${baseUrl}?role=external&mode=basic&session=${Date.now()}`
        }
    };
    
    // Save access links to file
    fs.writeFileSync('./uat/uat-access-links.json', JSON.stringify(accessLinks, null, 2));
    
    console.log('Access links generated');
    
    return accessLinks;
}

/**
 * Save setup information
 */
function saveSetupInfo(accessLinks) {
    console.log('Saving setup information...');
    
    const setupInfo = {
        timestamp: new Date().toISOString(),
        environment: config.environment,
        version: require('./package.json').version || '1.0.0',
        config,
        accessLinks
    };
    
    // Save setup info to file
    fs.writeFileSync('./uat/uat-setup-info.json', JSON.stringify(setupInfo, null, 2));
    
    console.log('Setup information saved');
}

// Execute the setup if this script is run directly
if (require.main === module) {
    setupUATEnvironment()
        .then(result => {
            if (result.success) {
                console.log('UAT environment is ready for testing!');
            } else {
                console.error('Failed to set up UAT environment:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unexpected error during UAT setup:', error);
            process.exit(1);
        });
}

module.exports = {
    setupUATEnvironment
};
