/**
 * Image Processor Web Worker
 * 
 * This worker handles image processing tasks off the main thread
 * to prevent UI freezing when handling large images.
 */

// Handle messages from the main thread
self.onmessage = function(e) {
    const { action, data } = e.data;
    
    switch (action) {
        case 'compress':
            compressImage(data.imageData, data.maxWidth, data.maxHeight, data.quality);
            break;
        case 'createThumbnail':
            createThumbnail(data.imageData, data.width, data.height);
            break;
        default:
            self.postMessage({
                status: 'error',
                error: `Unknown action: ${action}`
            });
    }
};

/**
 * Compress an image to reduce file size
 * 
 * @param {ArrayBuffer} imageData - The original image data
 * @param {number} maxWidth - Maximum width of the compressed image
 * @param {number} maxHeight - Maximum height of the compressed image
 * @param {number} quality - JPEG quality (0-1)
 */
function compressImage(imageData, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    try {
        // Create a blob URL from the image data
        const blob = new Blob([imageData]);
        const blobUrl = URL.createObjectURL(blob);
        
        // Create an image to load the blob
        const img = new Image();
        
        // Set up the onload handler
        img.onload = function() {
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = Math.round(height * (maxWidth / width));
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = Math.round(width * (maxHeight / height));
                height = maxHeight;
            }
            
            // Create a canvas to draw the resized image
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob
            canvas.convertToBlob({ type: 'image/jpeg', quality: quality })
                .then(compressedBlob => {
                    // Read the blob as array buffer
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        // Send the compressed image back to the main thread
                        self.postMessage({
                            status: 'success',
                            action: 'compress',
                            result: {
                                compressedData: reader.result,
                                width: width,
                                height: height,
                                originalSize: blob.size,
                                compressedSize: compressedBlob.size,
                                compressionRatio: blob.size / compressedBlob.size
                            }
                        });
                        
                        // Clean up
                        URL.revokeObjectURL(blobUrl);
                    };
                    reader.readAsArrayBuffer(compressedBlob);
                });
        };
        
        // Handle errors
        img.onerror = function() {
            self.postMessage({
                status: 'error',
                action: 'compress',
                error: 'Failed to load image'
            });
            URL.revokeObjectURL(blobUrl);
        };
        
        // Load the image
        img.src = blobUrl;
    } catch (error) {
        self.postMessage({
            status: 'error',
            action: 'compress',
            error: error.message
        });
    }
}

/**
 * Create a thumbnail from an image
 * 
 * @param {ArrayBuffer} imageData - The original image data
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 */
function createThumbnail(imageData, width = 100, height = 100) {
    try {
        // Create a blob URL from the image data
        const blob = new Blob([imageData]);
        const blobUrl = URL.createObjectURL(blob);
        
        // Create an image to load the blob
        const img = new Image();
        
        // Set up the onload handler
        img.onload = function() {
            // Create a canvas to draw the thumbnail
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            // Calculate dimensions to maintain aspect ratio and center the image
            const imgRatio = img.width / img.height;
            const canvasRatio = width / height;
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            
            if (imgRatio > canvasRatio) {
                // Image is wider than canvas ratio
                drawHeight = height;
                drawWidth = height * imgRatio;
                offsetX = (width - drawWidth) / 2;
            } else {
                // Image is taller than canvas ratio
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetY = (height - drawHeight) / 2;
            }
            
            // Draw the image on the canvas
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            // Convert to blob
            canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
                .then(thumbnailBlob => {
                    // Read the blob as array buffer
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        // Send the thumbnail back to the main thread
                        self.postMessage({
                            status: 'success',
                            action: 'createThumbnail',
                            result: {
                                thumbnailData: reader.result,
                                width: width,
                                height: height
                            }
                        });
                        
                        // Clean up
                        URL.revokeObjectURL(blobUrl);
                    };
                    reader.readAsArrayBuffer(thumbnailBlob);
                });
        };
        
        // Handle errors
        img.onerror = function() {
            self.postMessage({
                status: 'error',
                action: 'createThumbnail',
                error: 'Failed to load image'
            });
            URL.revokeObjectURL(blobUrl);
        };
        
        // Load the image
        img.src = blobUrl;
    } catch (error) {
        self.postMessage({
            status: 'error',
            action: 'createThumbnail',
            error: error.message
        });
    }
}
