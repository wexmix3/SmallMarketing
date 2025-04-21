# UAT Monitoring and Feedback Collection

## Overview

This directory contains the UAT environment for the AI Customer Service Assistant.

## Files and Directories

- `integrated-chatbot-uat.html`: The UAT version of the chatbot
- `integrated-chatbot-backup.html`: Backup of the previous UAT version
- `uat-monitoring.js`: Script for collecting and processing UAT feedback and performance data
- `logs/`: Directory for UAT logs
- `data/`: Directory for UAT data
- `reports/`: Directory for UAT reports
- `feedback/`: Directory for UAT feedback
- `test-files/`: Directory for UAT test files

## Starting the UAT Environment

1. Start the monitoring server:
   ```
   node uat-monitoring.js
   ```

2. Serve the UAT chatbot:
   ```
   npx http-server -p 8080
   ```

3. Access the UAT chatbot at:
   ```
   http://localhost:8080/uat/integrated-chatbot-uat.html
   ```

## Running Test Cases

To run a specific test case, add the `testCase` parameter to the URL:

```
http://localhost:8080/uat/integrated-chatbot-uat.html?testCase=BF-01
```

This will display test controls that allow testers to mark the test as passed or failed.

## Collecting Feedback

Testers can provide feedback by clicking the "Provide Feedback" button in the UAT environment.

## Monitoring

The monitoring server collects:
- Test results
- Feedback submissions
- Performance logs

This data is stored in the respective directories for later analysis.
