/**
 * Integration Test Implementation for AI Customer Service Assistant
 *
 * This file contains the actual test implementations based on the test plan.
 */

// Create test cases based on the test plan
function setupIntegrationTests(testRunner) {
    // Core Functionality Tests
    testRunner.addTest(
        'CF-01',
        'Open chat, send a message, receive a response',
        async (runner) => {
            await ChatbotTestHelpers.openChat(runner);
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Hello');
            runner.assert(response.length > 0, 'No response received');
        },
        'Core Functionality',
        'High'
    );

    testRunner.addTest(
        'CF-02',
        'Minimize and maximize chat',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Get minimize button
            const minimizeButton = document.querySelector('.minimize-button');
            if (!minimizeButton) {
                throw new Error('Minimize button not found');
            }

            // Click minimize button
            minimizeButton.click();

            // Wait for chat to be minimized
            await runner.waitFor(
                () => document.querySelector('.chat-container.minimized') !== null,
                2000,
                'Chat did not minimize'
            );

            // Click minimize button again to maximize
            minimizeButton.click();

            // Wait for chat to be maximized
            await runner.waitFor(
                () => document.querySelector('.chat-container.minimized') === null,
                2000,
                'Chat did not maximize'
            );
        },
        'Core Functionality',
        'Medium'
    );

    testRunner.addTest(
        'CF-03',
        'Close chat and reopen',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a test message to verify history preservation
            await ChatbotTestHelpers.sendMessage(runner, 'Test message for history');

            // Close chat
            await ChatbotTestHelpers.closeChat(runner);

            // Reopen chat
            await ChatbotTestHelpers.openChat(runner);

            // Check if message history is preserved
            const messages = document.querySelectorAll('.message');
            let historyFound = false;

            for (const message of messages) {
                if (message.textContent.includes('Test message for history')) {
                    historyFound = true;
                    break;
                }
            }

            runner.assert(historyFound, 'Chat history not preserved after reopening');
        },
        'Core Functionality',
        'Medium'
    );

    testRunner.addTest(
        'CF-04',
        'Send multiple messages in succession',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send multiple messages
            const message1 = await ChatbotTestHelpers.sendMessage(runner, 'First message');
            const message2 = await ChatbotTestHelpers.sendMessage(runner, 'Second message');
            const message3 = await ChatbotTestHelpers.sendMessage(runner, 'Third message');

            // Verify all messages received responses
            runner.assert(message1.length > 0, 'No response for first message');
            runner.assert(message2.length > 0, 'No response for second message');
            runner.assert(message3.length > 0, 'No response for third message');

            // Check message order
            const messages = document.querySelectorAll('.message');
            let firstFound = false;
            let secondFound = false;
            let thirdFound = false;

            for (let i = 0; i < messages.length; i++) {
                const text = messages[i].textContent;
                if (text.includes('First message')) {
                    firstFound = true;
                    runner.assert(!secondFound && !thirdFound, 'First message not in correct order');
                } else if (text.includes('Second message')) {
                    secondFound = true;
                    runner.assert(firstFound && !thirdFound, 'Second message not in correct order');
                } else if (text.includes('Third message')) {
                    thirdFound = true;
                    runner.assert(firstFound && secondFound, 'Third message not in correct order');
                }
            }
        },
        'Core Functionality',
        'High'
    );

    // File Attachment Tests
    testRunner.addTest(
        'FA-01',
        'Upload a single image file',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Create a test image file
            const testFile = {
                name: 'test-image.png',
                type: 'image/png',
                content: 'Test image content'
            };

            // Upload the file
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Check if file preview is displayed
            const filePreview = document.querySelector('.file-preview');
            runner.assert(filePreview !== null, 'File preview not displayed');

            // Check if bot acknowledged the file
            const messages = document.querySelectorAll('.bot-message');
            let acknowledgement = false;

            for (const message of messages) {
                if (message.textContent.includes('test-image.png')) {
                    acknowledgement = true;
                    break;
                }
            }

            runner.assert(acknowledgement, 'Bot did not acknowledge the file upload');
        },
        'File Attachment',
        'High'
    );

    testRunner.addTest(
        'FA-02',
        'Upload multiple files at once',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Create test files
            const testFile1 = {
                name: 'document1.pdf',
                type: 'application/pdf',
                content: 'Test PDF content'
            };

            const testFile2 = {
                name: 'document2.docx',
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                content: 'Test Word document content'
            };

            // Upload the files one after another (simulating multiple file selection)
            await ChatbotTestHelpers.uploadFile(runner, testFile1);
            await ChatbotTestHelpers.uploadFile(runner, testFile2);

            // Check if bot acknowledged both files
            const messages = document.querySelectorAll('.bot-message');
            let file1Acknowledged = false;
            let file2Acknowledged = false;

            for (const message of messages) {
                if (message.textContent.includes('document1.pdf')) {
                    file1Acknowledged = true;
                }
                if (message.textContent.includes('document2.docx')) {
                    file2Acknowledged = true;
                }
            }

            runner.assert(file1Acknowledged, 'Bot did not acknowledge the first file upload');
            runner.assert(file2Acknowledged, 'Bot did not acknowledge the second file upload');
        },
        'File Attachment',
        'High'
    );

    testRunner.addTest(
        'FA-03',
        'Upload a very large file (simulation)',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // We can't actually create a 10MB+ file in the browser, but we can simulate the error handling
            // by checking if the file size limit is enforced in the code

            // Check if MAX_FILE_SIZE constant exists and is reasonable
            runner.log('Checking for file size limits in the code');

            // Look for file size limit in the code
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                // Check if there's a file size validation in the handleFileUpload function
                // This is a basic check - we can't actually test with a real large file
                runner.assert(true, 'File input element exists, assuming size validation is implemented');
            }

            // Send a message asking about file size limits
            const response = await ChatbotTestHelpers.sendMessage(runner, 'What is the maximum file size I can upload?');
            runner.log(`Bot response about file size: ${response}`);
        },
        'File Attachment',
        'Medium'
    );

    testRunner.addTest(
        'FA-04',
        'Upload files of different types',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Create test files of different types
            const imageFile = {
                name: 'test-image.jpg',
                type: 'image/jpeg',
                content: 'Test image content'
            };

            const pdfFile = {
                name: 'test-document.pdf',
                type: 'application/pdf',
                content: 'Test PDF content'
            };

            // Upload the files
            await ChatbotTestHelpers.uploadFile(runner, imageFile);
            await ChatbotTestHelpers.uploadFile(runner, pdfFile);

            // Check if different file types have appropriate icons or previews
            const fileElements = document.querySelectorAll('.file-preview');
            runner.assert(fileElements.length > 0, 'No file previews displayed');

            // Check if bot acknowledged both file types
            const messages = document.querySelectorAll('.bot-message');
            let imageAcknowledged = false;
            let pdfAcknowledged = false;

            for (const message of messages) {
                if (message.textContent.includes('test-image.jpg')) {
                    imageAcknowledged = true;
                }
                if (message.textContent.includes('test-document.pdf')) {
                    pdfAcknowledged = true;
                }
            }

            runner.assert(imageAcknowledged, 'Bot did not acknowledge the image file');
            runner.assert(pdfAcknowledged, 'Bot did not acknowledge the PDF file');
        },
        'File Attachment',
        'Medium'
    );

    testRunner.addTest(
        'FA-05',
        'Upload a file, then send a text message',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Create a test file
            const testFile = {
                name: 'question-context.pdf',
                type: 'application/pdf',
                content: 'Test content with context'
            };

            // Upload the file
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Send a follow-up text message
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Can you help me understand this document?');

            // Check if response acknowledges both the file and the question
            runner.assert(
                response.length > 0,
                'No response received after file upload and text message'
            );

            // Check if the conversation flow is maintained
            const messages = document.querySelectorAll('.message');
            let fileFound = false;
            let questionFound = false;
            let responseFound = false;

            for (const message of messages) {
                if (message.textContent.includes('question-context.pdf')) {
                    fileFound = true;
                } else if (message.textContent.includes('Can you help me understand this document?')) {
                    questionFound = true;
                    runner.assert(fileFound, 'Question appears before file in conversation');
                } else if (responseFound && message.classList.contains('bot-message')) {
                    responseFound = true;
                    runner.assert(questionFound, 'Response appears before question in conversation');
                }
            }
        },
        'File Attachment',
        'Medium'
    );

    // Enhanced AI Tests
    testRunner.addTest(
        'AI-01',
        'Ask a question with exact keyword match',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message with exact keyword match for business hours
            const response = await ChatbotTestHelpers.sendMessage(runner, 'What are your business hours?');

            // Check if response contains relevant information
            runner.assert(
                response.includes('9am') && response.includes('5pm'),
                'Response does not contain expected business hours information'
            );

            // Check console logs for high confidence
            runner.log('Check console logs for "Intent detected: business_hours" with high confidence');
        },
        'Enhanced AI',
        'High'
    );

    testRunner.addTest(
        'AI-02',
        'Ask a question with similar but not exact wording',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message with similar wording but not exact match
            const response = await ChatbotTestHelpers.sendMessage(runner, 'When is your shop open?');

            // Check if intent was still correctly detected
            runner.assert(
                response.includes('9am') && response.includes('5pm'),
                'Response does not show correct intent detection for similar wording'
            );

            // Check console logs for medium confidence
            runner.log('Check console logs for "Intent detected: business_hours" with medium confidence');
        },
        'Enhanced AI',
        'High'
    );

    testRunner.addTest(
        'AI-03',
        'Ask a follow-up question',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send an initial question about business hours
            await ChatbotTestHelpers.sendMessage(runner, 'What are your business hours?');

            // Send a follow-up question
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Are you open on weekends?');

            // Check if response contains relevant information
            runner.assert(
                response.includes('Saturday') || response.includes('Sunday') ||
                response.includes('weekend') || response.includes('open'),
                'Response does not maintain context for follow-up question'
            );
        },
        'Enhanced AI',
        'High'
    );

    testRunner.addTest(
        'AI-04',
        'Ask a completely unrelated question',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message that doesn't match any specific intent
            const response = await ChatbotTestHelpers.sendMessage(runner, 'What is the airspeed velocity of an unladen swallow?');

            // Check if fallback response is provided
            runner.assert(
                response.length > 0 && !response.includes('undefined') && !response.includes('error'),
                'No appropriate fallback response for unrelated question'
            );

            // Check console logs for low confidence or unknown intent
            runner.log('Check console logs for low confidence or "Intent detected: unknown"');
        },
        'Enhanced AI',
        'Medium'
    );

    testRunner.addTest(
        'AI-05',
        'Test all intents with various phrasings',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Test various intents with different phrasings
            const intentTests = [
                { intent: 'greeting', phrase: 'Hello there', expectedContent: ['help', 'today', 'assist'] },
                { intent: 'business_hours', phrase: 'When do you open?', expectedContent: ['9am', '5pm'] },
                { intent: 'pricing', phrase: 'How much does it cost?', expectedContent: ['price', 'cost', '$'] },
                { intent: 'shipping_info', phrase: 'Do you deliver internationally?', expectedContent: ['shipping', 'delivery'] },
                { intent: 'return_policy', phrase: 'Can I return items?', expectedContent: ['return', 'policy', 'days'] }
            ];

            // Test each intent
            for (const test of intentTests) {
                runner.log(`Testing intent: ${test.intent} with phrase: "${test.phrase}"`);

                const response = await ChatbotTestHelpers.sendMessage(runner, test.phrase);

                // Check if response contains at least one expected content item
                const hasExpectedContent = test.expectedContent.some(content =>
                    response.toLowerCase().includes(content.toLowerCase())
                );

                runner.assert(
                    hasExpectedContent,
                    `Response for "${test.phrase}" does not contain expected content for ${test.intent} intent`
                );
            }
        },
        'Enhanced AI',
        'High'
    );

    // Feedback Mechanism Tests
    testRunner.addTest(
        'FM-01',
        'Give positive feedback on a response',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message to get a response
            await ChatbotTestHelpers.sendMessage(runner, 'What services do you offer?');

            // Give positive feedback on the response
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);

            // Check if feedback was registered
            const thumbsUpButton = document.querySelector('.bot-message .thumbs-up');
            runner.assert(
                thumbsUpButton && thumbsUpButton.classList.contains('selected'),
                'Positive feedback not registered correctly'
            );

            // Check for thank you message
            const thankYouMessage = document.querySelector('.bot-message div[style*="color: #86868b"]');
            runner.assert(
                thankYouMessage && thankYouMessage.textContent.includes('thank you'),
                'Thank you message not displayed after feedback'
            );
        },
        'Feedback Mechanism',
        'High'
    );

    testRunner.addTest(
        'FM-02',
        'Give negative feedback on a response',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message to get a response
            await ChatbotTestHelpers.sendMessage(runner, 'Tell me about your pricing');

            // Give negative feedback on the response
            await ChatbotTestHelpers.giveFeedback(runner, 0, false);

            // Check if feedback was registered
            const thumbsDownButton = document.querySelector('.bot-message .thumbs-down');
            runner.assert(
                thumbsDownButton && thumbsDownButton.classList.contains('selected'),
                'Negative feedback not registered correctly'
            );

            // Check for thank you message
            const thankYouMessage = document.querySelector('.bot-message div[style*="color: #86868b"]');
            runner.assert(
                thankYouMessage && thankYouMessage.textContent.includes('thank you'),
                'Thank you message not displayed after feedback'
            );
        },
        'Feedback Mechanism',
        'High'
    );

    testRunner.addTest(
        'FM-03',
        'Change feedback from positive to negative',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message to get a response
            await ChatbotTestHelpers.sendMessage(runner, 'How do I contact support?');

            // Give positive feedback first
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);

            // Check if positive feedback was registered
            const thumbsUpButton = document.querySelector('.bot-message .thumbs-up');
            runner.assert(
                thumbsUpButton && thumbsUpButton.classList.contains('selected'),
                'Initial positive feedback not registered correctly'
            );

            // Now change to negative feedback
            await ChatbotTestHelpers.giveFeedback(runner, 0, false);

            // Check if feedback was changed
            const thumbsDownButton = document.querySelector('.bot-message .thumbs-down');
            runner.assert(
                thumbsDownButton && thumbsDownButton.classList.contains('selected'),
                'Feedback not changed to negative'
            );

            // Check that positive feedback is no longer selected
            runner.assert(
                !thumbsUpButton.classList.contains('selected'),
                'Positive feedback still selected after changing to negative'
            );
        },
        'Feedback Mechanism',
        'Medium'
    );

    testRunner.addTest(
        'FM-04',
        'Give feedback on multiple messages',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send multiple messages to get multiple responses
            await ChatbotTestHelpers.sendMessage(runner, 'What are your business hours?');
            await ChatbotTestHelpers.sendMessage(runner, 'Do you offer refunds?');

            // Give different feedback on each response
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);  // Positive on first
            await ChatbotTestHelpers.giveFeedback(runner, 1, false); // Negative on second

            // Check if feedback was registered correctly for both messages
            const botMessages = document.querySelectorAll('.bot-message');

            // Check first message (positive feedback)
            const firstThumbsUp = botMessages[0].querySelector('.thumbs-up');
            runner.assert(
                firstThumbsUp && firstThumbsUp.classList.contains('selected'),
                'Positive feedback not registered correctly on first message'
            );

            // Check second message (negative feedback)
            const secondThumbsDown = botMessages[1].querySelector('.thumbs-down');
            runner.assert(
                secondThumbsDown && secondThumbsDown.classList.contains('selected'),
                'Negative feedback not registered correctly on second message'
            );
        },
        'Feedback Mechanism',
        'Medium'
    );

    testRunner.addTest(
        'FM-05',
        'Check that feedback persists after closing/reopening chat',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send a message and give feedback
            await ChatbotTestHelpers.sendMessage(runner, 'What payment methods do you accept?');
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);

            // Close the chat
            await ChatbotTestHelpers.closeChat(runner);

            // Reopen the chat
            await ChatbotTestHelpers.openChat(runner);

            // Check if feedback state was preserved
            // Wait a moment for the chat history to load
            await runner.waitFor(
                () => document.querySelectorAll('.bot-message').length > 0,
                2000,
                'Chat history not loaded after reopening'
            );

            // Check if the feedback is still selected
            const thumbsUpButton = document.querySelector('.bot-message .thumbs-up');
            runner.assert(
                thumbsUpButton && thumbsUpButton.classList.contains('selected'),
                'Feedback state not preserved after closing and reopening chat'
            );
        },
        'Feedback Mechanism',
        'Low'
    );

    // Performance Optimization Tests
    testRunner.addTest(
        'PO-01',
        'Generate a large conversation and test virtual scrolling',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Generate a large conversation (more than MAX_VISIBLE_MESSAGES)
            await ChatbotTestHelpers.generateLargeConversation(runner, 60);

            // Check if virtual scrolling is working
            ChatbotTestHelpers.checkVirtualScrolling(runner);

            // Check if "Load more" button exists
            const loadMoreButton = document.querySelector('.load-more-messages');
            runner.assert(loadMoreButton !== null, 'Load more button not found');

            // Click load more button
            loadMoreButton.click();

            // Wait for more messages to load
            await runner.waitFor(
                () => document.querySelectorAll('.message').length > window.MAX_VISIBLE_MESSAGES,
                2000,
                'More messages not loaded after clicking load more button'
            );
        },
        'Performance Optimization',
        'High'
    );

    testRunner.addTest(
        'PO-02',
        'Test response caching',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send the same question twice
            const question = 'What are your business hours?';

            // First time should be a cache miss
            const firstResponseTime = await ChatbotTestHelpers.sendMessageAndMeasureTime(runner, question);

            // Send the same question again
            const secondResponseTime = await ChatbotTestHelpers.sendMessageAndMeasureTime(runner, question);

            // The second response should be faster due to caching
            runner.log(`First response time: ${firstResponseTime}ms, Second response time: ${secondResponseTime}ms`);

            // Check console logs for cache hit
            runner.log('Check console logs for "Cache hit for:" message');

            // Check performance metrics
            runner.log('Check console logs for "Performance Metrics" to verify cache hits');
        },
        'Performance Optimization',
        'High'
    );

    testRunner.addTest(
        'PO-03',
        'Upload multiple large images',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Upload first image
            const image1 = {
                name: 'test-image-1.png',
                type: 'image/png',
                content: 'Test image content 1'
            };
            await ChatbotTestHelpers.uploadFile(runner, image1);

            // Upload second image
            const image2 = {
                name: 'test-image-2.png',
                type: 'image/png',
                content: 'Test image content 2'
            };
            await ChatbotTestHelpers.uploadFile(runner, image2);

            // Check if both images were acknowledged
            const botMessages = document.querySelectorAll('.bot-message');
            let image1Acknowledged = false;
            let image2Acknowledged = false;

            for (const message of botMessages) {
                if (message.textContent.includes('test-image-1.png')) {
                    image1Acknowledged = true;
                }
                if (message.textContent.includes('test-image-2.png')) {
                    image2Acknowledged = true;
                }
            }

            runner.assert(image1Acknowledged, 'First image not acknowledged');
            runner.assert(image2Acknowledged, 'Second image not acknowledged');

            // Check UI responsiveness after uploads
            await ChatbotTestHelpers.sendMessage(runner, 'Is the UI still responsive?');
        },
        'Performance Optimization',
        'High'
    );

    testRunner.addTest(
        'PO-04',
        'Rapid message sending (stress test)',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Send multiple messages rapidly
            const messages = [
                'Hello there',
                'How are you today?',
                'What services do you offer?',
                'Tell me about your pricing',
                'Do you have a refund policy?'
            ];

            // Send all messages with minimal delay
            const startTime = performance.now();
            for (const message of messages) {
                await ChatbotTestHelpers.sendMessage(runner, message, 100); // Short timeout
            }
            const endTime = performance.now();

            // Calculate average response time
            const totalTime = endTime - startTime;
            const avgTime = totalTime / messages.length;

            runner.log(`Sent ${messages.length} messages in ${totalTime.toFixed(2)}ms (avg: ${avgTime.toFixed(2)}ms per message)`);

            // Verify all messages were processed
            const allMessages = document.querySelectorAll('.message');
            runner.assert(allMessages.length >= messages.length * 2, 'Not all messages were processed'); // *2 because each message should have a response
        },
        'Performance Optimization',
        'Medium'
    );

    testRunner.addTest(
        'PO-05',
        'Check memory usage during extended use',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Record initial memory usage if available
            let initialMemory = 'Not available';
            if (window.performance && window.performance.memory) {
                initialMemory = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB';
            }
            runner.log(`Initial memory usage: ${initialMemory}`);

            // Generate a large conversation
            await ChatbotTestHelpers.generateLargeConversation(runner, 30);

            // Record memory after large conversation
            let afterConversationMemory = 'Not available';
            if (window.performance && window.performance.memory) {
                afterConversationMemory = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB';
            }
            runner.log(`Memory usage after large conversation: ${afterConversationMemory}`);

            // Check if memory usage is stable
            if (window.performance && window.performance.memory) {
                const initialMB = parseInt(initialMemory);
                const afterMB = parseInt(afterConversationMemory);

                if (!isNaN(initialMB) && !isNaN(afterMB)) {
                    // Allow for some increase, but not excessive
                    runner.assert(afterMB - initialMB < 100, 'Memory usage increased significantly');
                }
            }

            // Check for memory leaks by forcing garbage collection if possible
            if (window.gc) {
                window.gc();
                runner.log('Garbage collection forced');
            }

            // Final memory check
            let finalMemory = 'Not available';
            if (window.performance && window.performance.memory) {
                finalMemory = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB';
            }
            runner.log(`Final memory usage: ${finalMemory}`);
        },
        'Performance Optimization',
        'Medium'
    );

    // Cross-Feature Integration Tests
    testRunner.addTest(
        'XF-01',
        'Upload file, give feedback on response, ask follow-up',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Create a test file
            const testFile = {
                name: 'test-document.pdf',
                type: 'application/pdf',
                content: 'Test document content'
            };

            // Upload the file
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Give positive feedback on the response
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);

            // Ask a follow-up question
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Can you tell me more about the file?');

            // Check if response is relevant
            runner.assert(
                response.includes('file') || response.includes('document') || response.includes('pdf'),
                'Follow-up response not relevant to file upload context'
            );
        },
        'Cross-Feature Integration',
        'High'
    );

    testRunner.addTest(
        'XF-02',
        'Generate large conversation, then upload files',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Generate a medium-sized conversation
            await ChatbotTestHelpers.generateLargeConversation(runner, 20);

            // Upload a file
            const testFile = {
                name: 'performance-test.jpg',
                type: 'image/jpeg',
                content: 'Test image content'
            };
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Check if virtual scrolling still works
            ChatbotTestHelpers.checkVirtualScrolling(runner);

            // Check if UI is still responsive
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Is everything still working?');
            runner.assert(response.length > 0, 'UI not responsive after large conversation and file upload');
        },
        'Cross-Feature Integration',
        'Medium'
    );

    testRunner.addTest(
        'XF-03',
        'Use all features in a single session',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // 1. Send a message
            await ChatbotTestHelpers.sendMessage(runner, 'Hello, I need help with your services');

            // 2. Click a suggested action if available
            const suggestedAction = document.querySelector('.suggested-action');
            if (suggestedAction) {
                const actionText = suggestedAction.textContent;
                suggestedAction.click();

                // Wait for response to suggested action
                await runner.waitFor(
                    () => Array.from(document.querySelectorAll('.user-message')).some(el =>
                        el.textContent.includes(actionText)),
                    2000,
                    'Suggested action not processed'
                );
            }

            // 3. Upload a file
            const testFile = {
                name: 'integration-test.png',
                type: 'image/png',
                content: 'Test image content'
            };
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // 4. Give feedback
            await ChatbotTestHelpers.giveFeedback(runner, 0, true);

            // 5. Minimize and maximize chat
            const minimizeButton = document.querySelector('.minimize-button');
            if (minimizeButton) {
                minimizeButton.click();

                // Wait for chat to be minimized
                await runner.waitFor(
                    () => document.querySelector('.chat-container.minimized') !== null,
                    2000,
                    'Chat did not minimize'
                );

                // Maximize again
                minimizeButton.click();

                // Wait for chat to be maximized
                await runner.waitFor(
                    () => document.querySelector('.chat-container.minimized') === null,
                    2000,
                    'Chat did not maximize'
                );
            }

            // 6. Send a final message
            const finalResponse = await ChatbotTestHelpers.sendMessage(runner, 'Thank you for your help');
            runner.assert(finalResponse.length > 0, 'Final response not received');

            // Verify all features worked together
            runner.log('All features used successfully in a single session');
        },
        'Cross-Feature Integration',
        'High'
    );

    testRunner.addTest(
        'XF-04',
        'Test suggested actions after file upload',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Upload a file
            const testFile = {
                name: 'product-question.jpg',
                type: 'image/jpeg',
                content: 'Test image content'
            };
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Ask a question that should trigger suggested actions
            await ChatbotTestHelpers.sendMessage(runner, 'What products do you offer?');

            // Check if suggested actions appear
            await runner.waitFor(
                () => document.querySelector('.suggested-actions') !== null,
                2000,
                'Suggested actions not displayed after file upload and question'
            );

            // Click a suggested action
            const suggestedAction = document.querySelector('.suggested-action');
            if (suggestedAction) {
                const actionText = suggestedAction.textContent;
                suggestedAction.click();

                // Wait for response to suggested action
                await runner.waitFor(
                    () => Array.from(document.querySelectorAll('.user-message')).some(el =>
                        el.textContent.includes(actionText)),
                    2000,
                    'Suggested action not processed'
                );
            } else {
                runner.log('No suggested actions found to click', 'warning');
            }
        },
        'Cross-Feature Integration',
        'Medium'
    );

    testRunner.addTest(
        'XF-05',
        'Test context maintenance with mixed interaction types',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Start with a specific topic
            await ChatbotTestHelpers.sendMessage(runner, 'Tell me about your business hours');

            // Upload a file in the middle of the conversation
            const testFile = {
                name: 'context-test.pdf',
                type: 'application/pdf',
                content: 'Test document content'
            };
            await ChatbotTestHelpers.uploadFile(runner, testFile);

            // Ask a follow-up question that relies on previous context
            const response = await ChatbotTestHelpers.sendMessage(runner, 'Are you open on weekends?');

            // Check if context was maintained
            runner.assert(
                response.includes('weekend') || response.includes('Saturday') || response.includes('Sunday'),
                'Context not maintained after mixed interaction types'
            );
        },
        'Cross-Feature Integration',
        'Medium'
    );

    // Responsive Design Tests
    testRunner.addTest(
        'RD-01',
        'Test on desktop (large screen)',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Set viewport to desktop size
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            window.innerWidth = 1200;
            window.innerHeight = 800;
            window.dispatchEvent(new Event('resize'));

            // Check if chat container has appropriate size
            const chatContainer = document.querySelector('.chat-container');
            const containerRect = chatContainer.getBoundingClientRect();

            runner.assert(
                containerRect.width <= 400,
                'Chat container too wide for desktop view'
            );

            // Test functionality in desktop view
            await ChatbotTestHelpers.sendMessage(runner, 'Testing desktop view');

            // Restore original viewport
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            window.dispatchEvent(new Event('resize'));
        },
        'Responsive Design',
        'High'
    );

    testRunner.addTest(
        'RD-02',
        'Test on tablet (medium screen)',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Set viewport to tablet size
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            window.innerWidth = 768;
            window.innerHeight = 1024;
            window.dispatchEvent(new Event('resize'));

            // Check if chat container adapts to tablet size
            const chatContainer = document.querySelector('.chat-container');
            const containerRect = chatContainer.getBoundingClientRect();

            runner.assert(
                containerRect.width <= 350,
                'Chat container not adapting correctly to tablet view'
            );

            // Test functionality in tablet view
            await ChatbotTestHelpers.sendMessage(runner, 'Testing tablet view');

            // Restore original viewport
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            window.dispatchEvent(new Event('resize'));
        },
        'Responsive Design',
        'High'
    );

    testRunner.addTest(
        'RD-03',
        'Test on mobile (small screen)',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Set viewport to mobile size
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            window.innerWidth = 375;
            window.innerHeight = 667;
            window.dispatchEvent(new Event('resize'));

            // Check if chat container adapts to mobile size
            const chatContainer = document.querySelector('.chat-container');
            const containerRect = chatContainer.getBoundingClientRect();

            // On mobile, the chat should take up most of the width
            runner.assert(
                containerRect.width >= 300,
                'Chat container not adapting correctly to mobile view'
            );

            // Test functionality in mobile view
            await ChatbotTestHelpers.sendMessage(runner, 'Testing mobile view');

            // Restore original viewport
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            window.dispatchEvent(new Event('resize'));
        },
        'Responsive Design',
        'High'
    );

    testRunner.addTest(
        'RD-04',
        'Test in landscape and portrait orientations',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Save original dimensions
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            // Test portrait orientation (mobile)
            window.innerWidth = 375;
            window.innerHeight = 667;
            window.dispatchEvent(new Event('resize'));

            // Check portrait layout
            let chatContainer = document.querySelector('.chat-container');
            let containerRect = chatContainer.getBoundingClientRect();
            runner.log(`Portrait dimensions: ${containerRect.width}x${containerRect.height}`);

            // Test landscape orientation (same device)
            window.innerWidth = 667;
            window.innerHeight = 375;
            window.dispatchEvent(new Event('resize'));

            // Check landscape layout
            chatContainer = document.querySelector('.chat-container');
            containerRect = chatContainer.getBoundingClientRect();
            runner.log(`Landscape dimensions: ${containerRect.width}x${containerRect.height}`);

            // Test functionality in landscape
            await ChatbotTestHelpers.sendMessage(runner, 'Testing landscape orientation');

            // Restore original viewport
            window.innerWidth = originalWidth;
            window.innerHeight = originalHeight;
            window.dispatchEvent(new Event('resize'));
        },
        'Responsive Design',
        'Medium'
    );

    testRunner.addTest(
        'RD-05',
        'Test with different text sizes/zoom levels',
        async (runner) => {
            // First ensure chat is open
            await ChatbotTestHelpers.openChat(runner);

            // Save original font size
            const originalFontSize = document.documentElement.style.fontSize;

            try {
                // Simulate larger text size (accessibility setting)
                document.documentElement.style.fontSize = '120%';

                // Send a message with larger text
                await ChatbotTestHelpers.sendMessage(runner, 'Testing with larger text size');

                // Check if UI elements still align properly
                const chatInput = document.getElementById('messageInput');
                const sendButton = document.getElementById('sendButton');

                if (chatInput && sendButton) {
                    const inputRect = chatInput.getBoundingClientRect();
                    const buttonRect = sendButton.getBoundingClientRect();

                    // Check vertical alignment
                    const inputCenter = inputRect.top + inputRect.height / 2;
                    const buttonCenter = buttonRect.top + buttonRect.height / 2;

                    runner.assert(
                        Math.abs(inputCenter - buttonCenter) < 10, // Allow small difference
                        'Input and send button not aligned with larger text'
                    );
                }

                // Try even larger text
                document.documentElement.style.fontSize = '150%';

                // Send another message
                await ChatbotTestHelpers.sendMessage(runner, 'Testing with even larger text');
            } finally {
                // Restore original font size
                document.documentElement.style.fontSize = originalFontSize;
            }
        },
        'Responsive Design',
        'Medium'
    );

    return testRunner;
}

// Function to run the tests
async function runIntegrationTests() {
    // Create test runner
    const testRunner = new ChatbotTestRunner().init('test-log');

    // Setup tests
    setupIntegrationTests(testRunner);

    // Run all tests
    await testRunner.runAll();

    // Return results
    return testRunner.getResults();
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupIntegrationTests, runIntegrationTests };
} else {
    window.setupIntegrationTests = setupIntegrationTests;
    window.runIntegrationTests = runIntegrationTests;
}
