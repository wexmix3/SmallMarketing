/**
 * Lighthouse Configuration for AI Customer Service Assistant
 * 
 * This configuration is used for performance testing with Lighthouse.
 */

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Maximum wait time for the page to be interactive
    maxWaitForFcp: 15000,
    maxWaitForLoad: 35000,
    
    // Throttling settings
    throttling: {
      // Simulate a slow 4G connection
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 675.2
    },
    
    // Skip audits that don't apply to the chatbot
    skipAudits: [
      'canonical',
      'robots-txt',
      'hreflang',
      'plugins',
      'password-inputs-can-be-pasted-into'
    ],
    
    // Custom categories for chatbot-specific metrics
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo'
    ],
    
    // Additional passes to measure chatbot-specific metrics
    passes: [
      {
        passName: 'defaultPass',
        recordTrace: true,
        useThrottling: true,
        pauseAfterLoadMs: 5000,
        networkQuietThresholdMs: 5000,
        cpuQuietThresholdMs: 5000
      },
      {
        passName: 'chatbotInteractionPass',
        recordTrace: true,
        useThrottling: true,
        pauseAfterLoadMs: 5000,
        networkQuietThresholdMs: 5000,
        cpuQuietThresholdMs: 5000,
        gatherers: [
          'chatbot-interaction-gatherer'
        ]
      }
    ],
    
    // Custom audits for chatbot-specific metrics
    audits: [
      'chatbot-load-time',
      'chatbot-interaction-time',
      'chatbot-memory-usage',
      'chatbot-network-requests'
    ],
    
    // Custom groups for organizing audits
    groups: {
      'chatbot-performance': {
        title: 'Chatbot Performance Metrics'
      }
    },
    
    // Custom categories for organizing groups
    categories: {
      'chatbot-performance': {
        title: 'Chatbot Performance',
        description: 'Metrics specific to the AI Customer Service Assistant',
        auditRefs: [
          { id: 'chatbot-load-time', weight: 3, group: 'chatbot-performance' },
          { id: 'chatbot-interaction-time', weight: 3, group: 'chatbot-performance' },
          { id: 'chatbot-memory-usage', weight: 2, group: 'chatbot-performance' },
          { id: 'chatbot-network-requests', weight: 2, group: 'chatbot-performance' }
        ]
      }
    }
  }
};
