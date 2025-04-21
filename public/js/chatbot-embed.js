/**
 * AI Customer Service Assistant Embed Script
 * This script loads and initializes the chatbot on the customer's website
 */

(function() {
  // Configuration defaults
  const defaultConfig = {
    position: 'bottom-right',
    primaryColor: '#0071e3',
    chatbotName: 'Assistant',
    welcomeMessage: 'Hello! How can I help you today?'
  };
  
  // Get user configuration
  const userConfig = window.aiAssistantConfig || {};
  
  // Merge configurations
  const config = {
    ...defaultConfig,
    ...userConfig
  };
  
  // Validate required configuration
  if (!config.id) {
    console.error('AI Assistant: Missing required configuration. Please provide an assistant ID.');
    return;
  }
  
  // Create container element
  const createContainer = () => {
    const container = document.createElement('div');
    container.id = 'ai-assistant-container';
    container.className = `ai-assistant-position-${config.position}`;
    document.body.appendChild(container);
    return container;
  };
  
  // Load CSS
  const loadStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://cdn.aiassistant.com/styles.css?v=${new Date().getTime()}`;
    document.head.appendChild(link);
  };
  
  // Load chatbot HTML
  const loadChatbot = (container) => {
    // In a real implementation, this would fetch the chatbot HTML from the server
    // For demo purposes, we'll create it directly
    
    container.innerHTML = `
      <div class="ai-assistant-widget" style="--primary-color: ${config.primaryColor}">
        <div class="ai-assistant-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
        </div>
        
        <div class="ai-assistant-chat">
          <div class="ai-assistant-header">
            <div class="ai-assistant-title">${config.chatbotName}</div>
            <div class="ai-assistant-controls">
              <button class="ai-assistant-minimize">_</button>
              <button class="ai-assistant-close">×</button>
            </div>
          </div>
          
          <div class="ai-assistant-messages">
            <div class="ai-assistant-message assistant">
              <div class="ai-assistant-message-content">${config.welcomeMessage}</div>
              <div class="ai-assistant-message-time">Just now</div>
            </div>
          </div>
          
          <div class="ai-assistant-input">
            <input type="text" placeholder="Type your message...">
            <button class="ai-assistant-send">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const widget = container.querySelector('.ai-assistant-widget');
    const button = container.querySelector('.ai-assistant-button');
    const chat = container.querySelector('.ai-assistant-chat');
    const minimize = container.querySelector('.ai-assistant-minimize');
    const close = container.querySelector('.ai-assistant-close');
    const input = container.querySelector('.ai-assistant-input input');
    const send = container.querySelector('.ai-assistant-send');
    
    // Toggle chat on button click
    button.addEventListener('click', () => {
      widget.classList.toggle('open');
    });
    
    // Minimize chat
    minimize.addEventListener('click', () => {
      widget.classList.remove('open');
    });
    
    // Close chat
    close.addEventListener('click', () => {
      widget.classList.remove('open');
    });
    
    // Send message on enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Send message on button click
    send.addEventListener('click', sendMessage);
    
    // Send message function
    function sendMessage() {
      const messageText = input.value.trim();
      
      if (!messageText) return;
      
      // Add user message
      addMessage('user', messageText);
      
      // Clear input
      input.value = '';
      
      // Send message to server
      fetch(`https://api.aiassistant.com/chat/${config.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText
        })
      })
      .then(response => response.json())
      .then(data => {
        // Add assistant message
        addMessage('assistant', data.response);
      })
      .catch(error => {
        console.error('AI Assistant: Error sending message', error);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again later.');
      });
    }
    
    // Add message function
    function addMessage(type, content) {
      const messages = container.querySelector('.ai-assistant-messages');
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const messageElement = document.createElement('div');
      messageElement.className = `ai-assistant-message ${type}`;
      messageElement.innerHTML = `
        <div class="ai-assistant-message-content">${content}</div>
        <div class="ai-assistant-message-time">${time}${type === 'assistant' ? ' • AI' : ''}</div>
      `;
      
      messages.appendChild(messageElement);
      messages.scrollTop = messages.scrollHeight;
    }
  };
  
  // Initialize chatbot
  const init = () => {
    loadStyles();
    const container = createContainer();
    loadChatbot(container);
    
    console.log('AI Assistant: Initialized successfully');
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
