/**
 * Test Report Generator for AI Customer Service Assistant
 * 
 * This script generates a test report based on the test results.
 */

// Function to generate a test report
function generateTestReport(testResults) {
    // Get current date
    const date = new Date().toISOString().split('T')[0];
    
    // Get browser information
    const browser = getBrowserInfo();
    
    // Calculate pass rate
    const passRate = Math.round((testResults.summary.passed / testResults.summary.total) * 100);
    
    // Read template
    let template = '';
    try {
        const fs = require('fs');
        template = fs.readFileSync('TEST_REPORT_TEMPLATE.md', 'utf8');
    } catch (error) {
        console.error('Error reading template:', error);
        template = '# AI Customer Service Assistant - Integration Test Report\n\n## Test Summary\n\n**Date:** [DATE]\n\n**Test Results:**\n- Total Tests: [TOTAL]\n- Passed: [PASSED]\n- Failed: [FAILED]\n- Pending: [PENDING]\n- Pass Rate: [PASS_RATE]%\n\n## Detailed Test Results\n\n[DETAILED_RESULTS]\n\n## Issues Found\n\n[ISSUES]\n\n## Recommendations\n\n[RECOMMENDATIONS]\n\n## Conclusion\n\n[CONCLUSION]';
    }
    
    // Replace placeholders in template
    template = template.replace('[DATE]', date);
    template = template.replace('[BROWSER]', browser.name);
    template = template.replace('[VERSION]', browser.version);
    template = template.replace('[OS]', browser.os);
    template = template.replace('[RESOLUTION]', `${window.screen.width}x${window.screen.height}`);
    template = template.replace('[TOTAL]', testResults.summary.total);
    template = template.replace('[PASSED]', testResults.summary.passed);
    template = template.replace('[FAILED]', testResults.summary.failed);
    template = template.replace('[PENDING]', testResults.summary.pending);
    template = template.replace('[PASS_RATE]', passRate);
    
    // Replace test results in template
    template = replaceTestResults(template, testResults.tests);
    
    // Generate issues section
    const issues = generateIssuesSection(testResults.tests);
    template = template.replace('[LIST OF CRITICAL ISSUES]', issues.critical || 'None');
    template = template.replace('[LIST OF MAJOR ISSUES]', issues.major || 'None');
    template = template.replace('[LIST OF MINOR ISSUES]', issues.minor || 'None');
    
    // Generate performance metrics
    const performanceMetrics = window.performanceMetrics || {};
    if (performanceMetrics.messageProcessingTimes && performanceMetrics.messageProcessingTimes.length > 0) {
        const processingTimes = performanceMetrics.messageProcessingTimes;
        const avgProcessing = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
        const minProcessing = Math.min(...processingTimes);
        const maxProcessing = Math.max(...processingTimes);
        
        template = template.replace('[AVG_PROCESSING_TIME]', avgProcessing.toFixed(2));
        template = template.replace('[MIN_PROCESSING_TIME]', minProcessing.toFixed(2));
        template = template.replace('[MAX_PROCESSING_TIME]', maxProcessing.toFixed(2));
    } else {
        template = template.replace('[AVG_PROCESSING_TIME]', 'N/A');
        template = template.replace('[MIN_PROCESSING_TIME]', 'N/A');
        template = template.replace('[MAX_PROCESSING_TIME]', 'N/A');
    }
    
    if (performanceMetrics.renderTimes && performanceMetrics.renderTimes.length > 0) {
        const renderTimes = performanceMetrics.renderTimes;
        const avgRender = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
        const minRender = Math.min(...renderTimes);
        const maxRender = Math.max(...renderTimes);
        
        template = template.replace('[AVG_RENDER_TIME]', avgRender.toFixed(2));
        template = template.replace('[MIN_RENDER_TIME]', minRender.toFixed(2));
        template = template.replace('[MAX_RENDER_TIME]', maxRender.toFixed(2));
    } else {
        template = template.replace('[AVG_RENDER_TIME]', 'N/A');
        template = template.replace('[MIN_RENDER_TIME]', 'N/A');
        template = template.replace('[MAX_RENDER_TIME]', 'N/A');
    }
    
    const cacheHits = performanceMetrics.cacheHits || 0;
    const cacheMisses = performanceMetrics.cacheMisses || 0;
    const cacheHitRate = (cacheHits + cacheMisses > 0) ? 
        ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(2) : 'N/A';
    
    template = template.replace('[CACHE_HIT_RATE]', cacheHitRate);
    template = template.replace('[CACHE_HITS]', cacheHits);
    template = template.replace('[CACHE_MISSES]', cacheMisses);
    
    // Memory usage (if available)
    const memoryInfo = getMemoryInfo();
    template = template.replace('[INITIAL_MEMORY]', memoryInfo.initial);
    template = template.replace('[PEAK_MEMORY]', memoryInfo.peak);
    template = template.replace('[LARGE_CONV_MEMORY]', memoryInfo.largeConversation);
    
    // Generate recommendations
    const recommendations = generateRecommendations(testResults);
    for (let i = 0; i < recommendations.length; i++) {
        template = template.replace(`[RECOMMENDATION_${i+1}]`, recommendations[i]);
    }
    
    // Generate conclusion
    const conclusion = generateConclusion(testResults);
    template = template.replace('[CONCLUSION]', conclusion);
    
    // Generate next steps
    const nextSteps = generateNextSteps(testResults);
    for (let i = 0; i < nextSteps.length; i++) {
        template = template.replace(`[NEXT_STEP_${i+1}]`, nextSteps[i]);
    }
    
    // Replace tester name
    template = template.replace('[TESTER]', 'Automated Test Runner');
    
    return template;
}

// Function to replace test results in template
function replaceTestResults(template, tests) {
    // Group tests by category
    const testsByCategory = {};
    tests.forEach(test => {
        if (!testsByCategory[test.category]) {
            testsByCategory[test.category] = [];
        }
        testsByCategory[test.category].push(test);
    });
    
    // Replace test results in template
    Object.keys(testsByCategory).forEach(category => {
        const categoryTests = testsByCategory[category];
        categoryTests.forEach(test => {
            const statusText = getStatusText(test.status);
            const regex = new RegExp(`\\| ${test.id} \\| .* \\| .* \\| \\[STATUS\\] \\| \\[NOTES\\] \\|`, 'g');
            const replacement = `| ${test.id} | ${test.description} | ${test.priority} | ${statusText} | ${test.error || ''} |`;
            template = template.replace(regex, replacement);
        });
    });
    
    return template;
}

// Function to get status text with emoji
function getStatusText(status) {
    switch (status) {
        case 'passed':
            return '✅ Passed';
        case 'failed':
            return '❌ Failed';
        case 'pending':
            return '⏳ Pending';
        case 'running':
            return '🔄 Running';
        default:
            return status;
    }
}

// Function to generate issues section
function generateIssuesSection(tests) {
    const issues = {
        critical: '',
        major: '',
        minor: ''
    };
    
    // Find failed tests
    const failedTests = tests.filter(test => test.status === 'failed');
    
    // Categorize issues by priority
    failedTests.forEach(test => {
        const issue = `- **${test.id}**: ${test.description} - ${test.error}`;
        
        if (test.priority === 'High') {
            issues.critical += issue + '\n';
        } else if (test.priority === 'Medium') {
            issues.major += issue + '\n';
        } else {
            issues.minor += issue + '\n';
        }
    });
    
    return issues;
}

// Function to generate recommendations
function generateRecommendations(testResults) {
    const recommendations = [];
    
    // Add recommendations based on test results
    if (testResults.summary.failed > 0) {
        recommendations.push('Fix all failed tests, prioritizing high-priority issues.');
    }
    
    // Add recommendations based on performance
    const performanceMetrics = window.performanceMetrics || {};
    if (performanceMetrics.messageProcessingTimes && performanceMetrics.messageProcessingTimes.length > 0) {
        const avgProcessing = performanceMetrics.messageProcessingTimes.reduce((a, b) => a + b, 0) / 
                             performanceMetrics.messageProcessingTimes.length;
        
        if (avgProcessing > 100) {
            recommendations.push('Optimize message processing time, currently averaging ' + 
                               avgProcessing.toFixed(2) + 'ms per message.');
        }
    }
    
    // Add recommendations based on cache performance
    const cacheHits = performanceMetrics.cacheHits || 0;
    const cacheMisses = performanceMetrics.cacheMisses || 0;
    const cacheHitRate = (cacheHits + cacheMisses > 0) ? 
        ((cacheHits / (cacheHits + cacheMisses)) * 100) : 0;
    
    if (cacheHitRate < 50 && (cacheHits + cacheMisses > 10)) {
        recommendations.push('Improve response caching strategy to increase cache hit rate, currently at ' + 
                           cacheHitRate.toFixed(2) + '%.');
    }
    
    // Add general recommendations
    recommendations.push('Conduct user acceptance testing to validate the integration of all features.');
    recommendations.push('Implement automated integration tests as part of the CI/CD pipeline.');
    recommendations.push('Consider adding more comprehensive error handling for edge cases.');
    
    return recommendations;
}

// Function to generate conclusion
function generateConclusion(testResults) {
    const passRate = Math.round((testResults.summary.passed / testResults.summary.total) * 100);
    
    if (passRate === 100) {
        return 'The integration testing of the AI Customer Service Assistant was successful, with all tests passing. The chatbot demonstrates good integration between all features and meets the performance requirements. The system is ready for user acceptance testing and deployment.';
    } else if (passRate >= 80) {
        return `The integration testing of the AI Customer Service Assistant was mostly successful, with a ${passRate}% pass rate. The majority of features work well together, but there are some issues that need to be addressed before deployment. Once these issues are fixed, the system should be ready for user acceptance testing.`;
    } else {
        return `The integration testing of the AI Customer Service Assistant revealed significant issues, with only a ${passRate}% pass rate. These issues need to be addressed before the system can be considered ready for deployment. A follow-up integration test should be conducted after the issues are fixed.`;
    }
}

// Function to generate next steps
function generateNextSteps(testResults) {
    const nextSteps = [];
    
    if (testResults.summary.failed > 0) {
        nextSteps.push('Fix all failed tests, starting with critical issues.');
        nextSteps.push('Conduct a follow-up integration test to verify fixes.');
    }
    
    nextSteps.push('Proceed with user acceptance testing.');
    nextSteps.push('Prepare for Phase 3: Personalization and Integration implementation.');
    nextSteps.push('Update documentation to reflect the current state of the system.');
    
    return nextSteps;
}

// Function to get browser information
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let os = 'Unknown';
    
    // Detect browser
    if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf('Edg') > -1) {
        browserName = 'Edge';
        browserVersion = userAgent.match(/Edg\/([0-9.]+)/)[1];
    }
    
    // Detect OS
    if (userAgent.indexOf('Windows') > -1) {
        os = 'Windows';
    } else if (userAgent.indexOf('Mac') > -1) {
        os = 'macOS';
    } else if (userAgent.indexOf('Linux') > -1) {
        os = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        os = 'iOS';
    }
    
    return {
        name: browserName,
        version: browserVersion,
        os: os
    };
}

// Function to get memory information
function getMemoryInfo() {
    // Try to get memory info if available
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const initialMemory = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        const totalMemory = Math.round(memory.totalJSHeapSize / (1024 * 1024));
        
        return {
            initial: initialMemory,
            peak: totalMemory,
            largeConversation: 'Not measured'
        };
    }
    
    return {
        initial: 'Not available',
        peak: 'Not available',
        largeConversation: 'Not available'
    };
}

// Function to save the report
function saveTestReport(report) {
    // In a browser environment, create a download link
    const element = document.createElement('a');
    const file = new Blob([report], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `integration-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateTestReport, saveTestReport };
} else {
    window.generateTestReport = generateTestReport;
    window.saveTestReport = saveTestReport;
}
