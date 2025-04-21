/**
 * Sample script to demonstrate the test data generator
 */

const path = require('path');
const dataGenerator = require('./test-data-generator');

// Directory to save sample data
const sampleDataDir = path.join(__dirname, '../data');

// Generate and save sample user data
const users = dataGenerator.generateUsers(10);
dataGenerator.saveTestData(users, path.join(sampleDataDir, 'sample-users.json'));

// Generate and save sample conversations
const conversations = dataGenerator.generateConversations(5);
dataGenerator.saveTestData(conversations, path.join(sampleDataDir, 'sample-conversations.json'));

// Generate and save sample knowledge base
const knowledgeBase = dataGenerator.generateKnowledgeBase(15);
dataGenerator.saveTestData(knowledgeBase, path.join(sampleDataDir, 'sample-knowledge-base.json'));

// Generate and save industry-specific data
const retailData = dataGenerator.generateIndustryData('Retail');
dataGenerator.saveTestData(retailData, path.join(sampleDataDir, 'sample-retail-data.json'));

const restaurantData = dataGenerator.generateIndustryData('Restaurant');
dataGenerator.saveTestData(restaurantData, path.join(sampleDataDir, 'sample-restaurant-data.json'));

// Generate and save widget configuration
const widgetConfig = dataGenerator.generateWidgetConfig();
dataGenerator.saveTestData(widgetConfig, path.join(sampleDataDir, 'sample-widget-config.json'));

// Generate and save performance metrics
const performanceMetrics = dataGenerator.generatePerformanceMetrics();
dataGenerator.saveTestData(performanceMetrics, path.join(sampleDataDir, 'sample-performance-metrics.json'));

// Generate and save AI quality metrics
const aiQualityMetrics = dataGenerator.generateAIQualityMetrics();
dataGenerator.saveTestData(aiQualityMetrics, path.join(sampleDataDir, 'sample-ai-quality-metrics.json'));

// Generate and save complete test data set
const completeTestData = dataGenerator.generateCompleteTestData();
dataGenerator.saveTestData(completeTestData, path.join(sampleDataDir, 'sample-complete-data.json'));

console.log('Sample data generation complete!');
console.log(`Data files saved to: ${sampleDataDir}`);
