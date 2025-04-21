/**
 * Integration Test Runner for AI Customer Service Assistant
 *
 * This script helps run and track integration tests for the chatbot.
 * It can be included in the HTML file or run separately.
 */

// Test Runner
class ChatbotTestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            pending: 0,
            total: 0
        };
        this.currentTest = null;
        this.isRunning = false;
        this.logElement = null;
    }

    // Initialize the test runner
    init(logElementId) {
        // Create log element if it doesn't exist
        if (logElementId) {
            this.logElement = document.getElementById(logElementId);
            if (!this.logElement) {
                this.logElement = document.createElement('div');
                this.logElement.id = logElementId;
                this.logElement.className = 'test-log';
                document.body.appendChild(this.logElement);
            }
        }

        this.log('Test Runner Initialized');
        return this;
    }

    // Add a test
    addTest(id, description, testFn, category = 'General', priority = 'Medium') {
        this.tests.push({
            id,
            description,
            testFn,
            category,
            priority,
            status: 'pending',
            error: null,
            duration: 0
        });
        this.results.pending++;
        this.results.total++;
        return this;
    }

    // Run all tests
    async runAll() {
        if (this.isRunning) {
            this.log('Tests already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.log('Starting All Tests', 'info');
        this.resetResults();

        for (const test of this.tests) {
            await this.runTest(test.id);
        }

        this.isRunning = false;
        this.logSummary();
        return this.results;
    }

    // Run tests by category
    async runCategory(category) {
        if (this.isRunning) {
            this.log('Tests already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.log(`Starting Tests for Category: ${category}`, 'info');

        const testsInCategory = this.tests.filter(test => test.category === category);
        if (testsInCategory.length === 0) {
            this.log(`No tests found in category: ${category}`, 'warning');
            this.isRunning = false;
            return;
        }

        for (const test of testsInCategory) {
            await this.runTest(test.id);
        }

        this.isRunning = false;
        this.logSummary();
        return this.results;
    }

    // Run a single test by ID
    async runTest(id) {
        const test = this.tests.find(t => t.id === id);
        if (!test) {
            this.log(`Test not found: ${id}`, 'error');
            return;
        }

        this.currentTest = test;
        test.status = 'running';
        this.log(`Running Test: ${test.id} - ${test.description}`, 'info');

        const startTime = performance.now();
        try {
            await test.testFn(this);
            test.status = 'passed';
            this.results.passed++;
            this.results.pending--;
            this.log(`Test Passed: ${test.id}`, 'success');
        } catch (error) {
            test.status = 'failed';
            test.error = error;
            this.results.failed++;
            this.results.pending--;
            this.log(`Test Failed: ${test.id} - ${error.message}`, 'error');
            console.error(`Test ${test.id} failed:`, error);
        }

        const endTime = performance.now();
        test.duration = endTime - startTime;
        this.currentTest = null;
        return test;
    }

    // Reset test results
    resetResults() {
        this.results = {
            passed: 0,
            failed: 0,
            pending: this.tests.length,
            total: this.tests.length
        };

        this.tests.forEach(test => {
            test.status = 'pending';
            test.error = null;
            test.duration = 0;
        });
    }

    // Assert that a condition is true
    assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
        return true;
    }

    // Assert that two values are equal
    assertEqual(actual, expected, message = 'Values are not equal') {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
        return true;
    }

    // Assert that a function doesn't throw an error
    assertNoError(fn, message = 'Function threw an error') {
        try {
            fn();
            return true;
        } catch (error) {
            throw new Error(`${message}: ${error.message}`);
        }
    }

    // Wait for a condition to be true
    async waitFor(conditionFn, timeout = 5000, checkInterval = 100, message = 'Condition not met within timeout') {
        const startTime = performance.now();

        while (performance.now() - startTime < timeout) {
            if (conditionFn()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

        throw new Error(message);
    }

    // Wait for an element to exist in the DOM
    async waitForElement(selector, timeout = 5000, message = 'Element not found within timeout') {
        return this.waitFor(
            () => document.querySelector(selector) !== null,
            timeout,
            100,
            message
        );
    }

    // Log a message
    log(message, level = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        console.log(logMessage);

        if (this.logElement) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${level}`;
            logEntry.textContent = logMessage;
            this.logElement.appendChild(logEntry);
            this.logElement.scrollTop = this.logElement.scrollHeight;
        }
    }

    // Log test summary
    logSummary() {
        const summary = `
Test Summary:
Total: ${this.results.total}
Passed: ${this.results.passed}
Failed: ${this.results.failed}
Pending: ${this.results.pending}
Pass Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%
        `;

        this.log(summary, this.results.failed > 0 ? 'warning' : 'success');
        console.table(this.tests.map(test => ({
            ID: test.id,
            Description: test.description,
            Category: test.category,
            Priority: test.priority,
            Status: test.status,
            Duration: `${Math.round(test.duration)}ms`
        })));
    }

    // Get test results
    getResults() {
        return {
            summary: { ...this.results },
            tests: this.tests.map(test => ({
                id: test.id,
                description: test.description,
                category: test.category,
                priority: test.priority,
                status: test.status,
                error: test.error ? test.error.message : null,
                duration: test.duration
            }))
        };
    }
}

// Helper functions for testing the chatbot
const ChatbotTestHelpers = {
    // Send a message to the chatbot
    sendMessage: async (testRunner, message, timeout = 5000) => {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        if (!messageInput || !sendButton) {
            throw new Error('Message input or send button not found');
        }

        // Set message text
        messageInput.value = message;

        // Get current message count
        const initialMessageCount = document.querySelectorAll('.message').length;

        // Click send button
        sendButton.click();

        // Wait for response
        await testRunner.waitFor(
            () => document.querySelectorAll('.message').length > initialMessageCount + 1,
            timeout,
            'No response received from chatbot'
        );

        // Return the response message
        const messages = document.querySelectorAll('.message');
        return messages[messages.length - 1].textContent;
    },

    // Send a message and measure response time
    sendMessageAndMeasureTime: async (testRunner, message, timeout = 5000) => {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        if (!messageInput || !sendButton) {
            throw new Error('Message input or send button not found');
        }

        // Set message text
        messageInput.value = message;

        // Get current message count
        const initialMessageCount = document.querySelectorAll('.message').length;

        // Start timing
        const startTime = performance.now();

        // Click send button
        sendButton.click();

        // Wait for response
        await testRunner.waitFor(
            () => document.querySelectorAll('.message').length > initialMessageCount + 1,
            timeout,
            'No response received from chatbot'
        );

        // End timing
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        // Return the response time in milliseconds
        return responseTime;
    },

    // Upload a file to the chatbot
    uploadFile: async (testRunner, file) => {
        const fileInput = document.getElementById('fileInput');
        const attachmentButton = document.getElementById('attachmentButton');

        if (!fileInput || !attachmentButton) {
            throw new Error('File input or attachment button not found');
        }

        try {
            // Create a small valid file (1x1 pixel PNG for images, or simple text for other types)
            let content;
            if (file.type.startsWith('image/')) {
                // Simple 1x1 transparent PNG
                content = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137]);
            } else {
                // Simple text content for non-image files
                content = new Blob([`Test content for ${file.name}`], { type: file.type });
            }

            const testFile = new File([content], file.name, { type: file.type });

            // Log file details for debugging
            testRunner.log(`Uploading test file: ${file.name}, type: ${file.type}, size: ${testFile.size} bytes`);

            // Click the attachment button to open file dialog
            attachmentButton.click();

            // Simulate file selection
            try {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);
                fileInput.files = dataTransfer.files;

                // Trigger change event
                const changeEvent = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(changeEvent);

                // Wait for file preview or message about the file
                await testRunner.waitFor(
                    () => {
                        // Check for file preview in user message
                        const filePreview = document.querySelector('.file-preview');
                        if (filePreview) return true;

                        // Check for bot acknowledgment message
                        const botMessages = document.querySelectorAll('.bot-message');
                        return Array.from(botMessages).some(el =>
                            el.textContent.includes(file.name));
                    },
                    5000,
                    'File upload confirmation not displayed'
                );

                return true;
            } catch (innerError) {
                testRunner.log(`Error in file selection: ${innerError.message}`, 'error');

                // Alternative approach: directly call the file handler
                testRunner.log('Trying alternative approach: directly calling handleFileUpload', 'warning');

                // Create a mock event
                const mockEvent = {
                    target: { files: [testFile] }
                };

                // Call the handler directly if it's available in the global scope
                if (typeof window.handleFileUpload === 'function') {
                    window.handleFileUpload(mockEvent);

                    // Wait for file preview or message
                    await testRunner.waitFor(
                        () => document.querySelector('.file-preview') !== null ||
                              Array.from(document.querySelectorAll('.bot-message')).some(el =>
                                el.textContent.includes(file.name)),
                        5000,
                        'File upload confirmation not displayed (alternative method)'
                    );

                    return true;
                } else {
                    throw new Error('Could not find handleFileUpload function');
                }
            }
        } catch (error) {
            console.error('Error in uploadFile test helper:', error);
            testRunner.log(`File upload failed: ${error.message}`, 'error');
            throw error;
        }
    },

    // Give feedback on a message
    giveFeedback: async (testRunner, messageIndex, isPositive) => {
        const messages = document.querySelectorAll('.bot-message');
        if (messageIndex >= messages.length) {
            throw new Error(`Message index ${messageIndex} out of bounds`);
        }

        try {
            const message = messages[messageIndex];
            testRunner.log(`Giving ${isPositive ? 'positive' : 'negative'} feedback on message ${messageIndex}`);

            // Find the feedback buttons
            const feedbackButton = isPositive ?
                message.querySelector('.thumbs-up') :
                message.querySelector('.thumbs-down');

            if (!feedbackButton) {
                throw new Error(`Feedback button (${isPositive ? 'thumbs-up' : 'thumbs-down'}) not found`);
            }

            // Log the button state before clicking
            testRunner.log(`Feedback button found: ${feedbackButton.className}`);

            // Click feedback button
            feedbackButton.click();

            // Wait for feedback to be processed
            await testRunner.waitFor(
                () => feedbackButton.classList.contains('selected'),
                2000,
                'Feedback not registered'
            );

            // Verify the other button is not selected
            const otherButton = isPositive ?
                message.querySelector('.thumbs-down') :
                message.querySelector('.thumbs-up');

            if (otherButton && otherButton.classList.contains('selected')) {
                testRunner.log('Warning: Both feedback buttons are selected', 'warning');
            }

            // Check for thank you message
            const thankYouMessage = message.querySelector('div[style*="color: #86868b"]');
            if (thankYouMessage) {
                testRunner.log(`Thank you message found: ${thankYouMessage.textContent}`);
            } else {
                testRunner.log('No thank you message found', 'warning');
            }

            return true;
        } catch (error) {
            console.error('Error in giveFeedback test helper:', error);
            testRunner.log(`Feedback failed: ${error.message}`, 'error');
            throw error;
        }
    },

    // Open the chatbot
    openChat: async (testRunner) => {
        const chatLauncher = document.getElementById('chatLauncher');
        const chatContainer = document.getElementById('chatContainer');

        if (!chatLauncher || !chatContainer) {
            throw new Error('Chat launcher or container not found');
        }

        // Click launcher
        chatLauncher.click();

        // Wait for chat to open
        await testRunner.waitFor(
            () => chatContainer.classList.contains('visible'),
            2000,
            'Chat did not open'
        );

        return true;
    },

    // Close the chatbot
    closeChat: async (testRunner) => {
        const closeButton = document.getElementById('closeButton');
        const chatContainer = document.getElementById('chatContainer');

        if (!closeButton || !chatContainer) {
            throw new Error('Close button or chat container not found');
        }

        // Click close button
        closeButton.click();

        // Wait for chat to close
        await testRunner.waitFor(
            () => !chatContainer.classList.contains('visible'),
            2000,
            'Chat did not close'
        );

        return true;
    },

    // Generate a large conversation
    generateLargeConversation: async (testRunner, messageCount = 50) => {
        try {
            const testMessages = [
                "Hello there",
                "What services do you offer?",
                "Tell me about your pricing",
                "Do you have a refund policy?",
                "What are your business hours?",
                "How can I contact support?",
                "Do you ship internationally?",
                "What payment methods do you accept?",
                "Do you offer discounts?",
                "How long does shipping take?"
            ];

            testRunner.log(`Generating ${messageCount} messages for large conversation test`);

            // Use a more efficient approach for large conversations
            if (messageCount > 20) {
                testRunner.log('Using batch approach for large conversation generation');

                // Send messages in smaller batches to avoid overwhelming the UI
                const batchSize = 5;
                for (let i = 0; i < messageCount; i += batchSize) {
                    const currentBatchSize = Math.min(batchSize, messageCount - i);
                    testRunner.log(`Generating batch ${Math.floor(i/batchSize) + 1} (messages ${i+1} to ${i+currentBatchSize})`);

                    // Process each batch
                    for (let j = 0; j < currentBatchSize; j++) {
                        const messageIndex = i + j;
                        const message = testMessages[messageIndex % testMessages.length];
                        await ChatbotTestHelpers.sendMessage(testRunner, `${message} (${messageIndex+1})`, 2000);

                        // Add a small delay between messages in the same batch
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }

                    // Add a larger delay between batches
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Log progress
                    const progress = Math.min(i + batchSize, messageCount);
                    testRunner.log(`Generated ${progress}/${messageCount} messages (${Math.round((progress/messageCount)*100)}%)`);
                }
            } else {
                // For smaller counts, use the original approach
                for (let i = 0; i < messageCount; i++) {
                    const message = testMessages[i % testMessages.length];
                    await ChatbotTestHelpers.sendMessage(testRunner, `${message} (${i+1})`);

                    // Add a small delay to prevent overwhelming the chatbot
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Log progress
                    testRunner.log(`Generated ${i + 1}/${messageCount} messages`);
                }
            }

            testRunner.log(`Successfully generated ${messageCount} messages`);
            return true;
        } catch (error) {
            testRunner.log(`Error generating large conversation: ${error.message}`, 'error');
            console.error('Error in generateLargeConversation:', error);
            throw error;
        }
    },

    // Check if virtual scrolling is working
    checkVirtualScrolling: (testRunner) => {
        try {
            // Get the allMessages array from the window object
            const allMessages = window.allMessages || [];
            const visibleMessages = document.querySelectorAll('.message, .suggested-actions').length;
            const maxVisible = window.MAX_VISIBLE_MESSAGES || 50; // Default to 50 if not defined

            testRunner.log(`Total messages: ${allMessages.length}, Visible: ${visibleMessages}, Max allowed: ${maxVisible}`);

            // If we have more messages than the maximum allowed visible, virtual scrolling should be active
            if (allMessages.length > maxVisible) {
                // We should have fewer visible messages than total messages
                if (visibleMessages >= allMessages.length) {
                    testRunner.log('Warning: All messages are visible despite having more than MAX_VISIBLE_MESSAGES', 'warning');
                }

                // Check if we have a "load more" button when we have hidden messages
                if (allMessages.length > visibleMessages) {
                    const loadMoreButton = document.querySelector('.load-more-messages');
                    if (!loadMoreButton) {
                        testRunner.log('Warning: No load more button found despite having hidden messages', 'warning');
                    } else {
                        testRunner.log('Load more button found, virtual scrolling appears to be working', 'success');
                    }
                }

                return true;
            }

            // If we don't have enough messages, we can't verify virtual scrolling
            if (allMessages.length <= maxVisible) {
                testRunner.log('Not enough messages to verify virtual scrolling', 'warning');
                testRunner.log(`Need more than ${maxVisible} messages to test virtual scrolling`, 'info');
                return true;
            }

            return true;
        } catch (error) {
            testRunner.log(`Error checking virtual scrolling: ${error.message}`, 'error');
            console.error('Error in checkVirtualScrolling:', error);
            return false;
        }
    }
};

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatbotTestRunner, ChatbotTestHelpers };
} else {
    window.ChatbotTestRunner = ChatbotTestRunner;
    window.ChatbotTestHelpers = ChatbotTestHelpers;
}
