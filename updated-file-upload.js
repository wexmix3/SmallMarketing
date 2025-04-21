async function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        try {
            // Show a processing indicator
            const processingMessage = document.createElement('div');
            processingMessage.classList.add('processing-indicator');
            processingMessage.innerHTML = `
                <div class="processing-spinner"></div>
                <div class="processing-text">Processing ${files.length} file(s)...</div>
            `;
            chatMessages.appendChild(processingMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Check file size limits
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB
            let totalSize = 0;
            let oversizedFiles = [];

            Array.from(files).forEach(file => {
                totalSize += file.size;
                if (file.size > MAX_FILE_SIZE) {
                    oversizedFiles.push(file.name);
                }
            });

            // Check for oversized files
            if (oversizedFiles.length > 0) {
                processingMessage.remove();
                const errorMessage = `The following file(s) exceed the 10MB limit: ${oversizedFiles.join(', ')}. Please upload smaller files.`;
                addBotMessage(errorMessage);
                fileInput.value = '';
                return;
            }

            // Check total size
            if (totalSize > MAX_TOTAL_SIZE) {
                processingMessage.remove();
                const errorMessage = `The total size of all files (${formatFileSize(totalSize)}) exceeds the 20MB limit. Please upload smaller files.`;
                addBotMessage(errorMessage);
                fileInput.value = '';
                return;
            }

            // Create a message with the file(s)
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user-message');

            let messageContent = '';
            let validFiles = true;
            let processedFiles = [];
            
            // Process files in batches to avoid UI freezing
            const batchSize = 3; // Process 3 files at a time
            const fileBatches = [];
            
            // Split files into batches
            for (let i = 0; i < files.length; i += batchSize) {
                fileBatches.push(Array.from(files).slice(i, i + batchSize));
            }
            
            // Process each batch
            for (let i = 0; i < fileBatches.length; i++) {
                const batch = fileBatches[i];
                const batchPromises = [];
                
                // Update processing indicator
                processingMessage.querySelector('.processing-text').textContent = 
                    `Processing batch ${i+1}/${fileBatches.length}...`;
                
                // Process each file in the batch
                for (const file of batch) {
                    // If it's an image, compress it first
                    if (file.type.startsWith('image/')) {
                        batchPromises.push(
                            compressImage(file)
                                .then(compressedFile => {
                                    processedFiles.push({
                                        original: file,
                                        processed: compressedFile,
                                        compressed: compressedFile !== file
                                    });
                                    return processFile(compressedFile, messageElement);
                                })
                                .catch(error => {
                                    console.error('Error compressing image:', error);
                                    processedFiles.push({
                                        original: file,
                                        processed: file,
                                        compressed: false,
                                        error: error.message
                                    });
                                    return processFile(file, messageElement);
                                })
                        );
                    } else {
                        // For non-image files, just process them directly
                        processedFiles.push({
                            original: file,
                            processed: file,
                            compressed: false
                        });
                        batchPromises.push(processFile(file, messageElement));
                    }
                }
                
                // Wait for all files in this batch to be processed
                try {
                    const batchResults = await Promise.all(batchPromises);
                    batchResults.forEach(result => {
                        if (result.valid) {
                            messageContent += result.content;
                        } else {
                            validFiles = false;
                        }
                    });
                } catch (batchError) {
                    console.error('Error processing batch:', batchError);
                    validFiles = false;
                }
                
                // Small delay between batches to keep UI responsive
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Remove processing indicator
            processingMessage.remove();

            if (!validFiles) {
                addBotMessage("There was an error processing one or more files. Please try again.");
                fileInput.value = '';
                return;
            }

            // Add timestamp to message
            messageContent += `<div class="message-time">${new Date().toLocaleTimeString()} ✓</div>`;
            
            // Set message content
            messageElement.innerHTML = messageContent;

            // Add message to chat
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Create message object for history
            const messageObj = {
                type: 'user',
                content: `Uploaded ${files.length} file(s)`,
                files: processedFiles.map(f => ({ 
                    name: f.original.name, 
                    type: f.original.type, 
                    size: f.original.size,
                    processedSize: f.processed.size,
                    compressed: f.compressed
                })),
                time: new Date(),
                element: messageElement
            };
            allMessages.push(messageObj);

            // Manage visible messages
            manageVisibleMessages();

            // Add bot response
            let responseMessage = '';
            if (files.length === 1) {
                responseMessage = `I've received your file: ${files[0].name}. How can I help you with this?`;
            } else {
                responseMessage = `I've received your ${files.length} files. How can I help you with these?`;
            }

            // Show typing indicator
            showTypingIndicator();

            // Add response with delay
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage(responseMessage);

                // Add suggested actions based on file type
                const fileTypes = Array.from(files).map(f => f.type);
                if (fileTypes.some(type => type.startsWith('image/'))) {
                    addSuggestedActions([
                        "Can you analyze this image?",
                        "What does this image show?",
                        "Can you extract text from this image?"
                    ]);
                } else if (fileTypes.some(type => type.includes('pdf') || type.includes('word') || type.includes('text'))) {
                    addSuggestedActions([
                        "Can you summarize this document?",
                        "What is this document about?",
                        "Can you extract key points from this?"
                    ]);
                }
            }, 1000);

            // Clear the file input
            fileInput.value = '';
        } catch (error) {
            console.error('Error handling file upload:', error);
            addBotMessage("There was an error processing your files. Please try again.");
            fileInput.value = '';
        }
    }
}
