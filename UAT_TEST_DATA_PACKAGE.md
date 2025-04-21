# AI Customer Service Assistant - UAT Test Data Package

## Overview

This document describes the test data package provided for User Acceptance Testing (UAT) of the AI Customer Service Assistant. The package includes various file types and sample data to help you thoroughly test the chatbot's functionality.

## Test Files

### Images

| Filename | Type | Size | Description | Use Case |
|----------|------|------|-------------|----------|
| test-image-small.jpg | JPEG | 50 KB | Small product image | Basic image upload testing |
| test-image-medium.jpg | JPEG | 500 KB | Medium-sized product image | Standard image upload testing |
| test-image-large.jpg | JPEG | 5 MB | Large product image | Testing large image handling |
| test-image-very-large.jpg | JPEG | 15 MB | Very large product image | Testing file size limits |
| test-image.png | PNG | 200 KB | Transparent product image | Testing PNG handling |
| test-image.gif | GIF | 300 KB | Animated product image | Testing GIF handling |

### Documents

| Filename | Type | Size | Description | Use Case |
|----------|------|------|-------------|----------|
| test-document-small.pdf | PDF | 100 KB | Small product manual | Basic document upload testing |
| test-document-medium.pdf | PDF | 1 MB | Medium-sized product manual | Standard document upload testing |
| test-document-large.pdf | PDF | 8 MB | Large product manual | Testing large document handling |
| test-document-very-large.pdf | PDF | 20 MB | Very large product manual | Testing file size limits |
| test-document.docx | DOCX | 500 KB | Product specifications | Testing Word document handling |
| test-document.txt | TXT | 50 KB | Plain text product description | Testing text file handling |

### Other Files

| Filename | Type | Size | Description | Use Case |
|----------|------|------|-------------|----------|
| test-spreadsheet.xlsx | XLSX | 300 KB | Product inventory spreadsheet | Testing Excel file handling |
| test-presentation.pptx | PPTX | 700 KB | Product presentation | Testing PowerPoint file handling |
| test-archive.zip | ZIP | 2 MB | Compressed product files | Testing archive file handling |
| test-video.mp4 | MP4 | 3 MB | Product demo video | Testing video file handling |

## Sample Questions

The following sample questions are provided to help you test the chatbot's conversation capabilities:

### Business Hours Questions

- "What are your business hours?"
- "Are you open on weekends?"
- "What are your holiday hours?"
- "When do you close today?"
- "Are you open on Sundays?"

### Shipping Questions

- "Do you offer international shipping?"
- "How long does shipping take?"
- "What are the shipping costs?"
- "Do you ship to Canada?"
- "Is express shipping available?"

### Product Questions

- "What products do you offer?"
- "Tell me about your premium plan"
- "What's the difference between basic and premium?"
- "Do you have a free trial?"
- "What features are included in the standard plan?"

### Order Questions

- "I have a problem with my order"
- "My order hasn't arrived yet"
- "I received the wrong item"
- "How do I track my order?"
- "I want to cancel my order"

### Return Questions

- "What's your return policy?"
- "How do I return an item?"
- "Do you offer refunds?"
- "How long do I have to return an item?"
- "Do I need the original packaging to return an item?"

## File Upload Test Scenarios

The following scenarios are provided to help you test the chatbot's file handling capabilities:

### Single File Upload Scenarios

1. Upload a small image and ask about it
2. Upload a medium-sized document and ask for a summary
3. Upload a large image and observe performance
4. Upload a very large file to test size limits
5. Upload different file types to test format handling

### Multiple File Upload Scenarios

1. Upload multiple small images
2. Upload a mix of images and documents
3. Upload multiple large files to test performance
4. Upload a combination of supported and unsupported file types
5. Upload the maximum allowed number of files

## Accessing the Test Data

The test data package is available at the following location:

[Test Data Package URL]

To download the package:

1. Click the link above
2. Enter the following credentials if prompted:
   - Username: uat_tester
   - Password: [password]
3. Download the ZIP file
4. Extract the contents to your local machine

## Using the Test Data

When testing the chatbot:

1. Use the provided files for upload testing
2. Use the sample questions to test conversation capabilities
3. Follow the test scenarios in the UAT test cases document
4. Record your observations in the tracking spreadsheet

## Notes and Limitations

- Some very large files are included specifically to test the system's file size limits
- The test data is fictional and should only be used for testing purposes
- Do not share the test data outside of the UAT process
- If you encounter any issues with the test data, please contact the UAT coordinator

---

*Document version: 1.0*
*Last updated: [Current Date]*
