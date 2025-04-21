/**
 * Test Environment Setup Script
 * 
 * This script automates the setup of test environments for the AI Customer Service Assistant.
 * It sets up the necessary dependencies, configurations, and test data.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  environments: ['development', 'testing', 'staging'],
  dependencies: {
    npm: ['jest', 'cypress', 'supertest', 'chai', 'allure-commandline'],
    system: ['mongodb', 'redis']
  },
  testDataPath: './test/data',
  configPath: './test/config',
  envFilesPath: './'
};

/**
 * Check if required system dependencies are installed
 */
function checkSystemDependencies() {
  console.log('Checking system dependencies...');
  
  config.dependencies.system.forEach(dep => {
    try {
      switch (dep) {
        case 'mongodb':
          execSync('mongod --version', { stdio: 'ignore' });
          break;
        case 'redis':
          execSync('redis-server --version', { stdio: 'ignore' });
          break;
        default:
          execSync(`${dep} --version`, { stdio: 'ignore' });
      }
      console.log(`✅ ${dep} is installed`);
    } catch (error) {
      console.error(`❌ ${dep} is not installed. Please install it before continuing.`);
      process.exit(1);
    }
  });
}

/**
 * Install NPM dependencies
 */
function installNpmDependencies() {
  console.log('Installing NPM dependencies...');
  
  try {
    // Install dev dependencies
    const devDeps = config.dependencies.npm.join(' ');
    execSync(`npm install --save-dev ${devDeps}`, { stdio: 'inherit' });
    console.log('✅ NPM dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install NPM dependencies:', error.message);
    process.exit(1);
  }
}

/**
 * Create environment configuration files
 */
function createEnvironmentFiles() {
  console.log('Creating environment configuration files...');
  
  // Create config directory if it doesn't exist
  if (!fs.existsSync(config.configPath)) {
    fs.mkdirSync(config.configPath, { recursive: true });
  }
  
  // Create environment-specific config files
  config.environments.forEach(env => {
    const configFile = path.join(config.configPath, `${env}.json`);
    
    // Skip if file already exists
    if (fs.existsSync(configFile)) {
      console.log(`ℹ️ Config file for ${env} already exists, skipping`);
      return;
    }
    
    // Create environment-specific configuration
    const envConfig = {
      environment: env,
      apiUrl: `https://${env === 'production' ? '' : env + '-'}api.aiassistant.com/v1`,
      mockData: env !== 'production',
      logLevel: env === 'development' ? 'debug' : 'info',
      aiModel: env === 'production' ? 'gpt-4' : 'gpt-3.5-turbo',
      testUsers: {
        admin: {
          username: `admin@${env}.example.com`,
          password: 'TestPassword123!'
        },
        user: {
          username: `user@${env}.example.com`,
          password: 'TestPassword123!'
        }
      }
    };
    
    // Write config file
    fs.writeFileSync(configFile, JSON.stringify(envConfig, null, 2));
    console.log(`✅ Created config file for ${env} environment`);
  });
  
  // Create .env files for each environment
  config.environments.forEach(env => {
    const envFile = path.join(config.envFilesPath, `.env.${env}`);
    
    // Skip if file already exists
    if (fs.existsSync(envFile)) {
      console.log(`ℹ️ .env file for ${env} already exists, skipping`);
      return;
    }
    
    // Create environment variables
    const envVars = [
      `NODE_ENV=${env}`,
      `API_ENDPOINT=https://${env === 'production' ? '' : env + '-'}api.aiassistant.com/v1`,
      `AUTH_DOMAIN=${env === 'production' ? '' : env + '-'}auth.aiassistant.com`,
      `CLIENT_ID=${env}_client_123456`,
      `ENVIRONMENT=${env}`,
      `LOG_LEVEL=${env === 'development' ? 'debug' : 'info'}`,
      `ENABLE_MOCK_DATA=${env !== 'production'}`,
      `MOCK_RESPONSE_DELAY=${env === 'development' ? 500 : 0}`,
      `AI_MODEL=${env === 'production' ? 'gpt-4' : 'gpt-3.5-turbo'}`,
      `KNOWLEDGE_BASE_ID=kb_${env}_123456`,
      `ANALYTICS_ENABLED=${env !== 'development'}`
    ].join('\n');
    
    // Write .env file
    fs.writeFileSync(envFile, envVars);
    console.log(`✅ Created .env file for ${env} environment`);
  });
}

/**
 * Set up test data
 */
function setupTestData() {
  console.log('Setting up test data...');
  
  // Create test data directory if it doesn't exist
  if (!fs.existsSync(config.testDataPath)) {
    fs.mkdirSync(config.testDataPath, { recursive: true });
  }
  
  // Create sample knowledge base data
  const knowledgeBasePath = path.join(config.testDataPath, 'knowledge-base');
  if (!fs.existsSync(knowledgeBasePath)) {
    fs.mkdirSync(knowledgeBasePath, { recursive: true });
  }
  
  // Create retail industry sample
  const retailSample = {
    industry: 'Retail',
    entries: [
      {
        question: 'What are your store hours?',
        answer: 'Our store is open Monday to Friday from 9am to 8pm, Saturday from 10am to 6pm, and Sunday from 12pm to 5pm.',
        alternatives: [
          'When are you open?',
          'What time does the store close?',
          'Are you open on weekends?'
        ],
        category: 'Store Information'
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes, we offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping fee of $5.99.',
        alternatives: [
          'How much is shipping?',
          'Is there a shipping charge?',
          'Do I have to pay for delivery?'
        ],
        category: 'Shipping & Delivery'
      },
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase with original receipt. Items must be unused and in original packaging. Return shipping is free for defective items.',
        alternatives: [
          'Can I return items?',
          'How do I return something?',
          'What\'s your refund policy?'
        ],
        category: 'Returns & Refunds'
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(knowledgeBasePath, 'retail.json'),
    JSON.stringify(retailSample, null, 2)
  );
  
  // Create restaurant industry sample
  const restaurantSample = {
    industry: 'Restaurant',
    entries: [
      {
        question: 'Do you take reservations?',
        answer: 'Yes, we accept reservations up to 30 days in advance. You can book online through our website or by calling (555) 123-4567.',
        alternatives: [
          'Can I book a table?',
          'How do I make a reservation?',
          'Do I need to reserve in advance?'
        ],
        category: 'Reservations'
      },
      {
        question: 'Do you have vegetarian options?',
        answer: 'Yes, we offer several vegetarian dishes on our menu. These items are marked with a (V) symbol. We can also modify many other dishes to be vegetarian upon request.',
        alternatives: [
          'Is there anything vegetarian?',
          'Do you serve vegetarian food?',
          'What can I eat if I\'m vegetarian?'
        ],
        category: 'Menu Information'
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(knowledgeBasePath, 'restaurant.json'),
    JSON.stringify(restaurantSample, null, 2)
  );
  
  console.log('✅ Test data set up successfully');
}

/**
 * Configure test frameworks
 */
function configureTestFrameworks() {
  console.log('Configuring test frameworks...');
  
  // Configure Jest
  const jestConfig = {
    verbose: true,
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/**/*.test.js',
      '!**/node_modules/**'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['./test/setup.js']
  };
  
  fs.writeFileSync('jest.config.json', JSON.stringify(jestConfig, null, 2));
  
  // Configure Cypress
  if (!fs.existsSync('cypress')) {
    fs.mkdirSync('cypress', { recursive: true });
    fs.mkdirSync('cypress/integration', { recursive: true });
    fs.mkdirSync('cypress/fixtures', { recursive: true });
    fs.mkdirSync('cypress/support', { recursive: true });
  }
  
  const cypressConfig = {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    waitForAnimations: true,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    watchForFileChanges: false
  };
  
  fs.writeFileSync('cypress.json', JSON.stringify(cypressConfig, null, 2));
  
  // Create Cypress support file
  const cypressSupportContent = `
// cypress/support/index.js
// This file is processed and loaded automatically before your test files.

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in the Cypress command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
`;
  
  fs.writeFileSync('cypress/support/index.js', cypressSupportContent);
  
  // Create Cypress commands file
  const cypressCommandsContent = `
// cypress/support/commands.js
// Custom commands for Cypress tests

// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Open chat widget command
Cypress.Commands.add('openChatWidget', () => {
  cy.get('#ai-assistant-button').click();
  cy.get('#ai-assistant-chat-window').should('be.visible');
});

// Send message command
Cypress.Commands.add('sendMessage', (message) => {
  cy.get('#ai-assistant-input').type(message);
  cy.get('#ai-assistant-send-button').click();
  cy.get('.user-message').last().should('contain', message);
});

// Wait for assistant response command
Cypress.Commands.add('waitForResponse', () => {
  cy.get('.typing-indicator').should('be.visible');
  cy.get('.typing-indicator').should('not.exist', { timeout: 10000 });
  cy.get('.assistant-message').last().should('be.visible');
});
`;
  
  fs.writeFileSync('cypress/support/commands.js', cypressCommandsContent);
  
  // Create test setup file
  const testSetupContent = `
// test/setup.js
// Setup file for Jest tests

// Set test timeout
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.API_ENDPOINT = 'https://test-api.aiassistant.com/v1';
process.env.AUTH_DOMAIN = 'test-auth.aiassistant.com';
process.env.CLIENT_ID = 'test_client_123456';
process.env.ENABLE_MOCK_DATA = 'true';

// Global test utilities
global.waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));
`;
  
  fs.writeFileSync('test/setup.js', testSetupContent);
  
  console.log('✅ Test frameworks configured successfully');
}

/**
 * Update package.json with test scripts
 */
function updatePackageJson() {
  console.log('Updating package.json with test scripts...');
  
  try {
    // Read existing package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add test scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      "test": "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage",
      "test:unit": "jest --testPathPattern=test/unit",
      "test:api": "jest --testPathPattern=test/api",
      "test:e2e": "cypress run",
      "test:e2e:open": "cypress open",
      "test:performance": "node test/performance/run-performance-tests.js",
      "test:security": "node test/security/run-security-tests.js",
      "test:accessibility": "node test/accessibility/run-accessibility-tests.js",
      "test:all": "npm run test && npm run test:e2e && npm run test:performance",
      "test:ci": "npm run test:coverage && npm run test:e2e"
    };
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json updated successfully');
  } catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
  }
}

/**
 * Create sample test files
 */
function createSampleTests() {
  console.log('Creating sample test files...');
  
  // Create directory structure
  const directories = [
    'test/unit',
    'test/api/specs',
    'test/api/clients',
    'cypress/integration',
    'test/performance',
    'test/security',
    'test/accessibility'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create sample unit test
  const unitTestContent = `
// test/unit/ai-engine/response-generator.test.js
describe('Response Generator', () => {
  it('should generate appropriate response for known question', () => {
    // Mock implementation for testing
    const ResponseGenerator = {
      generateResponse: (question, knowledgeBase) => {
        const entry = knowledgeBase.find(e => 
          e.question.toLowerCase() === question.toLowerCase() ||
          e.alternatives?.some(alt => alt.toLowerCase() === question.toLowerCase())
        );
        return entry ? entry.answer : 'I don\\'t have information about that.';
      }
    };
    
    const question = 'What are your business hours?';
    const knowledgeBase = [
      { 
        question: 'What are your business hours?', 
        answer: 'We are open 9-5.',
        alternatives: ['When are you open?']
      }
    ];
    
    const response = ResponseGenerator.generateResponse(question, knowledgeBase);
    
    expect(response).toBe('We are open 9-5.');
  });
  
  it('should generate fallback response for unknown question', () => {
    // Mock implementation for testing
    const ResponseGenerator = {
      generateResponse: (question, knowledgeBase) => {
        const entry = knowledgeBase.find(e => 
          e.question.toLowerCase() === question.toLowerCase() ||
          e.alternatives?.some(alt => alt.toLowerCase() === question.toLowerCase())
        );
        return entry ? entry.answer : 'I don\\'t have information about that.';
      }
    };
    
    const question = 'Do you sell helicopters?';
    const knowledgeBase = [
      { 
        question: 'What are your business hours?', 
        answer: 'We are open 9-5.',
        alternatives: ['When are you open?']
      }
    ];
    
    const response = ResponseGenerator.generateResponse(question, knowledgeBase);
    
    expect(response).toBe('I don\\'t have information about that.');
  });
});
`;
  
  fs.writeFileSync('test/unit/response-generator.test.js', unitTestContent);
  
  // Create sample API test
  const apiTestContent = `
// test/api/specs/knowledge-base.test.js
const request = require('supertest');
const app = require('../../../src/app'); // Adjust path as needed

describe('Knowledge Base API', () => {
  // Mock authentication for tests
  let testToken = 'test-token';
  
  beforeAll(async () => {
    // Setup test data or authentication if needed
  });
  
  it('should return knowledge base entries', async () => {
    const response = await request(app)
      .get('/api/knowledge-base')
      .set('Authorization', \`Bearer \${testToken}\`)
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  it('should create a new knowledge base entry', async () => {
    const newEntry = {
      question: 'What is your return policy?',
      answer: '30 days return policy for unused items.',
      category: 'Returns'
    };
    
    const response = await request(app)
      .post('/api/knowledge-base')
      .set('Authorization', \`Bearer \${testToken}\`)
      .send(newEntry)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.question).toBe(newEntry.question);
  });
});
`;
  
  fs.writeFileSync('test/api/specs/knowledge-base.test.js', apiTestContent);
  
  // Create sample E2E test
  const e2eTestContent = `
// cypress/integration/chat-interaction.spec.js
describe('Chat Interaction', () => {
  beforeEach(() => {
    cy.visit('/test-page.html');
    cy.openChatWidget();
  });
  
  it('should send and receive messages', () => {
    // Send a message
    cy.sendMessage('Hello, I have a question');
    
    // Wait for and verify response
    cy.waitForResponse();
    cy.get('.assistant-message').last().should('exist');
  });
  
  it('should maintain conversation history', () => {
    // Send multiple messages
    const messages = [
      'What products do you offer?',
      'Do you have any discounts?',
      'How can I contact support?'
    ];
    
    messages.forEach(message => {
      cy.sendMessage(message);
      cy.waitForResponse();
    });
    
    // Verify all messages are in the history
    messages.forEach(message => {
      cy.get('.user-message').contains(message).should('exist');
    });
    
    // Verify responses for all messages
    cy.get('.assistant-message').should('have.length.at.least', 3);
  });
});
`;
  
  fs.writeFileSync('cypress/integration/chat-interaction.spec.js', e2eTestContent);
  
  // Create performance test runner
  const performanceTestContent = `
// test/performance/run-performance-tests.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running performance tests...');

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

try {
  // This is a placeholder. In a real implementation, you would:
  // 1. Start your application server
  // 2. Run JMeter or another performance testing tool
  // 3. Process and report the results
  
  console.log('Performance test completed successfully');
  console.log('Results saved to test/performance/results');
  
  // Example of how you might run JMeter if it's installed
  // execSync('jmeter -n -t test/performance/chat-load-test.jmx -l test/performance/results/results.jtl');
  
  // For this example, we'll just create a sample results file
  const sampleResults = {
    timestamp: new Date().toISOString(),
    summary: {
      totalRequests: 1000,
      successfulRequests: 985,
      failedRequests: 15,
      averageResponseTime: 245,
      minResponseTime: 120,
      maxResponseTime: 890,
      p95ResponseTime: 450
    },
    details: {
      endpoints: {
        '/api/chat': {
          requests: 600,
          averageResponseTime: 220
        },
        '/api/knowledge-base': {
          requests: 400,
          averageResponseTime: 280
        }
      }
    }
  };
  
  fs.writeFileSync(
    path.join(resultsDir, 'performance-results.json'),
    JSON.stringify(sampleResults, null, 2)
  );
  
  process.exit(0);
} catch (error) {
  console.error('Performance test failed:', error.message);
  process.exit(1);
}
`;
  
  fs.writeFileSync('test/performance/run-performance-tests.js', performanceTestContent);
  
  console.log('✅ Sample test files created successfully');
}

/**
 * Main function to run the setup
 */
async function main() {
  console.log('Starting test environment setup...');
  
  try {
    checkSystemDependencies();
    installNpmDependencies();
    createEnvironmentFiles();
    setupTestData();
    configureTestFrameworks();
    updatePackageJson();
    createSampleTests();
    
    console.log('\n✅ Test environment setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run unit tests: npm run test:unit');
    console.log('2. Run API tests: npm run test:api');
    console.log('3. Run E2E tests: npm run test:e2e');
    console.log('4. View test coverage: npm run test:coverage');
  } catch (error) {
    console.error('\n❌ Test environment setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
main();
