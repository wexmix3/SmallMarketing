# AI Customer Service Assistant - Test Environment Setup Guide

This document provides instructions for setting up testing environments for the AI Customer Service Assistant.

## Table of Contents

1. [Introduction](#introduction)
2. [Development Environment Setup](#development-environment-setup)
3. [Testing Environment Setup](#testing-environment-setup)
4. [Production-Like Environment Setup](#production-like-environment-setup)
5. [Local Testing Environment](#local-testing-environment)
6. [Automated Testing Environment](#automated-testing-environment)
7. [Mobile Testing Environment](#mobile-testing-environment)
8. [Performance Testing Environment](#performance-testing-environment)
9. [Security Testing Environment](#security-testing-environment)
10. [Troubleshooting](#troubleshooting)

## Introduction

This guide outlines the steps to set up various testing environments for the AI Customer Service Assistant. Each environment is configured for specific testing purposes, from development and integration testing to performance and security testing.

## Development Environment Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git
- MongoDB (v4.4 or later)
- Redis (v6 or later)

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.development` file in the root directory with the following content:

```
API_ENDPOINT=https://dev-api.aiassistant.com/v1
AUTH_DOMAIN=dev-auth.aiassistant.com
CLIENT_ID=dev_client_123456
ENVIRONMENT=development
LOG_LEVEL=debug
ENABLE_MOCK_DATA=true
MOCK_RESPONSE_DELAY=500
AI_MODEL=gpt-3.5-turbo
KNOWLEDGE_BASE_ID=kb_dev_123456
ANALYTICS_ENABLED=false
```

4. **Start local MongoDB and Redis**

```bash
# Start MongoDB
mongod --dbpath ./data/db

# Start Redis
redis-server
```

5. **Initialize the database**

```bash
npm run init-db:dev
```

6. **Start the development server**

```bash
npm run dev
```

The development server will be available at `http://localhost:3000`.

## Testing Environment Setup

### Prerequisites

- Same as Development Environment
- Docker and Docker Compose
- Jest testing framework

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.test` file in the root directory with the following content:

```
API_ENDPOINT=https://test-api.aiassistant.com/v1
AUTH_DOMAIN=test-auth.aiassistant.com
CLIENT_ID=test_client_123456
ENVIRONMENT=testing
LOG_LEVEL=info
ENABLE_MOCK_DATA=false
MOCK_RESPONSE_DELAY=0
AI_MODEL=gpt-3.5-turbo
KNOWLEDGE_BASE_ID=kb_test_123456
ANALYTICS_ENABLED=true
```

4. **Start the testing containers**

```bash
docker-compose -f docker-compose.test.yml up -d
```

5. **Run the tests**

```bash
npm test
```

## Production-Like Environment Setup

### Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform (v1.0 or later)
- Docker

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Build the Docker image**

```bash
docker build -t aiassistant/customer-service:staging .
```

3. **Push the image to ECR**

```bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
docker tag aiassistant/customer-service:staging 123456789012.dkr.ecr.us-west-2.amazonaws.com/aiassistant/customer-service:staging
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/aiassistant/customer-service:staging
```

4. **Deploy the staging environment**

```bash
cd terraform/staging
terraform init
terraform apply
```

5. **Verify the deployment**

```bash
curl https://staging-api.aiassistant.com/v1/health
```

## Local Testing Environment

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Browser (Chrome, Firefox, Safari, Edge)

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the mock server**

```bash
npm run mock-server
```

4. **Open the test page**

```bash
npm run test-page
```

This will open a test page at `http://localhost:8080/test.html` with the AI Assistant widget embedded.

5. **Test different configurations**

Edit the `test-config.js` file to test different widget configurations:

```javascript
// test-config.js
window.AIAssistantConfig = {
  theme: 'dark',
  position: 'bottom-left',
  primaryColor: '#ff0000',
  autoOpen: true
};
```

## Automated Testing Environment

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Cypress (v9 or later)
- Docker

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the test environment**

```bash
docker-compose -f docker-compose.cypress.yml up -d
```

4. **Run Cypress tests**

```bash
npm run cypress:open
```

This will open the Cypress test runner where you can run individual test specs.

5. **Run headless tests**

```bash
npm run cypress:run
```

## Mobile Testing Environment

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Appium (v1.22 or later)
- Android Studio with emulator
- Xcode with simulator (for Mac users)

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Start Appium server**

```bash
appium
```

4. **Start Android emulator**

```bash
emulator -avd Pixel_4_API_30
```

5. **Start iOS simulator (Mac only)**

```bash
xcrun simctl boot "iPhone 12"
```

6. **Run mobile tests**

```bash
npm run test:mobile
```

## Performance Testing Environment

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- JMeter (v5.4 or later)
- Docker

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Start the performance test environment**

```bash
docker-compose -f docker-compose.perf.yml up -d
```

3. **Run JMeter tests**

```bash
cd performance-tests
jmeter -n -t chat-load-test.jmx -l results.jtl
```

4. **Generate performance report**

```bash
jmeter -g results.jtl -o report
```

The performance report will be available in the `report` directory.

## Security Testing Environment

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- OWASP ZAP
- Docker

### Setup Steps

1. **Clone the repository (if not already done)**

```bash
git clone https://github.com/aiassistant/customer-service-assistant.git
cd customer-service-assistant
```

2. **Start the security test environment**

```bash
docker-compose -f docker-compose.security.yml up -d
```

3. **Run OWASP ZAP scan**

```bash
docker run -v $(pwd)/security-reports:/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t https://security-test.aiassistant.com -g gen.conf -r security-report.html
```

The security report will be available in the `security-reports` directory.

## Troubleshooting

### Common Issues and Solutions

#### MongoDB Connection Issues

**Issue**: Cannot connect to MongoDB

**Solution**:
1. Ensure MongoDB is running: `ps aux | grep mongo`
2. Check MongoDB logs: `cat /var/log/mongodb/mongod.log`
3. Verify connection string in `.env` file
4. Try connecting manually: `mongo mongodb://localhost:27017/aiassistant`

#### Redis Connection Issues

**Issue**: Cannot connect to Redis

**Solution**:
1. Ensure Redis is running: `ps aux | grep redis`
2. Check Redis logs: `cat /var/log/redis/redis-server.log`
3. Try connecting manually: `redis-cli ping`

#### API Connection Issues

**Issue**: Cannot connect to API

**Solution**:
1. Check API endpoint in `.env` file
2. Verify network connectivity: `curl https://dev-api.aiassistant.com/v1/health`
3. Check for firewall issues: `telnet dev-api.aiassistant.com 443`
4. Verify API key is valid

#### Docker Issues

**Issue**: Docker containers not starting

**Solution**:
1. Check Docker logs: `docker-compose logs`
2. Verify Docker is running: `docker ps`
3. Check for port conflicts: `netstat -tuln`
4. Restart Docker: `systemctl restart docker`

#### Test Failures

**Issue**: Tests are failing

**Solution**:
1. Check test logs for specific errors
2. Verify test environment is properly set up
3. Run tests with verbose logging: `npm test -- --verbose`
4. Try running a single test to isolate the issue: `npm test -- -t "test name"`

### Getting Help

If you encounter issues not covered in this troubleshooting guide, please:

1. Check the project documentation in the `docs` directory
2. Search for similar issues in the project issue tracker
3. Contact the development team on Slack in the `#ai-assistant-testing` channel
4. Submit a detailed bug report with steps to reproduce the issue

---

This guide provides instructions for setting up various testing environments for the AI Customer Service Assistant. Follow the appropriate section based on your testing needs.
