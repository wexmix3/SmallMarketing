/**
 * AI Customer Service Assistant - Embedding Script
 * 
 * This script loads the chatbot widget on client websites.
 * It creates an iframe that loads the widget from the chatbot service.
 */

(function(window, document) {
  // Configuration
  var defaultConfig = {
    theme: 'light',
    position: 'right',
    primaryColor: '#0070f3',
    autoOpen: false,
    collectVisitorInfo: true
  };
  
  // Queue for commands before the widget is loaded
  var queue = [];
  
  // Widget state
  var state = {
    loaded: false,
    open: false,
    businessId: null,
    config: { ...defaultConfig },
    iframe: null,
    container: null
  };
  
  // Create the global chatbot object
  window.AIChatWidget = function() {
    var args = Array.prototype.slice.call(arguments);
    var command = args[0];
    
    if (command === 'init') {
      // Initialize the widget
      var businessId = args[1];
      var config = args[2] || {};
      
      if (!businessId) {
        console.error('AIChatWidget: Business ID is required for initialization');
        return;
      }
      
      state.businessId = businessId;
      state.config = { ...defaultConfig, ...config };
      
      loadWidget();
    } else if (!state.loaded) {
      // Queue commands until widget is loaded
      queue.push(args);
    } else {
      // Execute command on loaded widget
      executeCommand(command, args.slice(1));
    }
  };
  
  // Process any commands that were called before the script loaded
  if (window.AIChatWidget.q) {
    for (var i = 0; i < window.AIChatWidget.q.length; i++) {
      window.AIChatWidget.apply(window, window.AIChatWidget.q[i]);
    }
  }
  
  /**
   * Load the chat widget
   */
  function loadWidget() {
    // Create container
    var container = document.createElement('div');
    container.id = 'ai-chat-widget-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style[state.config.position] = '20px';
    container.style.zIndex = '999999';
    document.body.appendChild(container);
    
    state.container = container;
    
    // Create toggle button
    var button = document.createElement('button');
    button.id = 'ai-chat-widget-button';
    button.innerHTML = '💬';
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = state.config.primaryColor;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.fontSize = '24px';
    button.style.transition = 'transform 0.3s ease';
    button.addEventListener('mouseover', function() {
      button.style.transform = 'scale(1.1)';
    });
    button.addEventListener('mouseout', function() {
      button.style.transform = 'scale(1)';
    });
    button.addEventListener('click', toggleWidget);
    container.appendChild(button);
    
    // Create iframe container (hidden initially)
    var iframeContainer = document.createElement('div');
    iframeContainer.id = 'ai-chat-widget-iframe-container';
    iframeContainer.style.position = 'absolute';
    iframeContainer.style.bottom = '80px';
    iframeContainer.style[state.config.position] = '0';
    iframeContainer.style.width = '350px';
    iframeContainer.style.height = '500px';
    iframeContainer.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
    iframeContainer.style.borderRadius = '10px';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.display = 'none';
    iframeContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    iframeContainer.style.opacity = '0';
    iframeContainer.style.transform = 'translateY(20px)';
    container.appendChild(iframeContainer);
    
    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.id = 'ai-chat-widget-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    
    // Build iframe URL with query parameters
    var baseUrl = 'https://api.example.com/widget'; // Replace with actual widget URL
    var queryParams = [
      'businessId=' + encodeURIComponent(state.businessId),
      'theme=' + encodeURIComponent(state.config.theme),
      'position=' + encodeURIComponent(state.config.position),
      'primaryColor=' + encodeURIComponent(state.config.primaryColor),
      'collectVisitorInfo=' + encodeURIComponent(state.config.collectVisitorInfo)
    ];
    iframe.src = baseUrl + '?' + queryParams.join('&');
    
    iframeContainer.appendChild(iframe);
    state.iframe = iframe;
    
    // Set up message listener for iframe communication
    window.addEventListener('message', handleMessage);
    
    // Mark as loaded
    state.loaded = true;
    
    // Process queued commands
    processQueue();
    
    // Auto-open if configured
    if (state.config.autoOpen) {
      setTimeout(function() {
        openWidget();
      }, 1000);
    }
  }
  
  /**
   * Toggle widget visibility
   */
  function toggleWidget() {
    if (state.open) {
      closeWidget();
    } else {
      openWidget();
    }
  }
  
  /**
   * Open the widget
   */
  function openWidget() {
    if (!state.loaded) return;
    
    var button = document.getElementById('ai-chat-widget-button');
    var iframeContainer = document.getElementById('ai-chat-widget-iframe-container');
    
    button.innerHTML = '×';
    iframeContainer.style.display = 'block';
    
    // Trigger reflow
    iframeContainer.offsetHeight;
    
    iframeContainer.style.opacity = '1';
    iframeContainer.style.transform = 'translateY(0)';
    
    state.open = true;
    
    // Notify iframe that widget is open
    sendMessageToIframe('open');
  }
  
  /**
   * Close the widget
   */
  function closeWidget() {
    if (!state.loaded) return;
    
    var button = document.getElementById('ai-chat-widget-button');
    var iframeContainer = document.getElementById('ai-chat-widget-iframe-container');
    
    button.innerHTML = '💬';
    iframeContainer.style.opacity = '0';
    iframeContainer.style.transform = 'translateY(20px)';
    
    setTimeout(function() {
      iframeContainer.style.display = 'none';
    }, 300);
    
    state.open = false;
    
    // Notify iframe that widget is closed
    sendMessageToIframe('close');
  }
  
  /**
   * Process queued commands
   */
  function processQueue() {
    while (queue.length > 0) {
      var args = queue.shift();
      var command = args[0];
      executeCommand(command, args.slice(1));
    }
  }
  
  /**
   * Execute a command
   */
  function executeCommand(command, args) {
    switch (command) {
      case 'open':
        openWidget();
        break;
        
      case 'close':
        closeWidget();
        break;
        
      case 'toggle':
        toggleWidget();
        break;
        
      case 'sendMessage':
        var message = args[0];
        if (message) {
          sendMessageToIframe('sendMessage', { message: message });
        }
        break;
        
      case 'setVisitorInfo':
        var visitorInfo = args[0];
        if (visitorInfo) {
          sendMessageToIframe('setVisitorInfo', { visitorInfo: visitorInfo });
        }
        break;
        
      case 'on':
        var eventName = args[0];
        var callback = args[1];
        if (eventName && typeof callback === 'function') {
          // Store callback for later use
          if (!window.AIChatWidget.callbacks) {
            window.AIChatWidget.callbacks = {};
          }
          if (!window.AIChatWidget.callbacks[eventName]) {
            window.AIChatWidget.callbacks[eventName] = [];
          }
          window.AIChatWidget.callbacks[eventName].push(callback);
        }
        break;
        
      case 'destroy':
        destroyWidget();
        break;
        
      default:
        console.warn('AIChatWidget: Unknown command', command);
    }
  }
  
  /**
   * Send a message to the iframe
   */
  function sendMessageToIframe(action, data) {
    if (!state.iframe || !state.iframe.contentWindow) return;
    
    var message = {
      source: 'ai-chat-widget-parent',
      action: action,
      businessId: state.businessId,
      ...data
    };
    
    state.iframe.contentWindow.postMessage(message, '*');
  }
  
  /**
   * Handle messages from the iframe
   */
  function handleMessage(event) {
    // Verify message source
    if (!state.iframe || event.source !== state.iframe.contentWindow) return;
    
    var message = event.data;
    
    // Verify message format
    if (!message || message.source !== 'ai-chat-widget-iframe') return;
    
    switch (message.action) {
      case 'ready':
        // Widget iframe is ready
        console.log('AIChatWidget: Widget ready');
        break;
        
      case 'close':
        // Close widget from iframe
        closeWidget();
        break;
        
      case 'height':
        // Adjust iframe height
        if (message.height) {
          state.iframe.style.height = message.height + 'px';
        }
        break;
        
      case 'event':
        // Trigger callback for event
        if (message.eventName && window.AIChatWidget.callbacks && window.AIChatWidget.callbacks[message.eventName]) {
          window.AIChatWidget.callbacks[message.eventName].forEach(function(callback) {
            callback(message.data);
          });
        }
        break;
        
      default:
        console.warn('AIChatWidget: Unknown message action', message.action);
    }
  }
  
  /**
   * Destroy the widget
   */
  function destroyWidget() {
    if (!state.loaded) return;
    
    // Remove event listener
    window.removeEventListener('message', handleMessage);
    
    // Remove DOM elements
    if (state.container && state.container.parentNode) {
      state.container.parentNode.removeChild(state.container);
    }
    
    // Reset state
    state.loaded = false;
    state.open = false;
    state.iframe = null;
    state.container = null;
    
    // Clear callbacks
    window.AIChatWidget.callbacks = {};
  }
})(window, document);
