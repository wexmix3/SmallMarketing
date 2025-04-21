/**
 * Widget Generator
 * 
 * This module generates the JavaScript code for the chatbot widget.
 */

/**
 * Generate the widget JavaScript
 */
export function generateWidgetJs(): string {
  return `
/**
 * AI Customer Service Assistant Widget
 * 
 * This script embeds the AI Customer Service Assistant widget on your website.
 * 
 * Usage:
 * <script src="https://your-deployment-url/widget.js" 
 *         data-business-id="your-business-id"
 *         data-theme="light"
 *         data-position="right"></script>
 */

(function() {
  // Get script attributes
  const script = document.currentScript;
  const businessId = script.getAttribute('data-business-id') || 'demo-business';
  const theme = script.getAttribute('data-theme') || 'light';
  const position = script.getAttribute('data-position') || 'right';
  const primaryColor = script.getAttribute('data-primary-color') || '#0070f3';
  const fontFamily = script.getAttribute('data-font-family') || 'Arial, sans-serif';
  const autoShow = script.getAttribute('data-auto-show') === 'true';
  const autoShowDelay = parseInt(script.getAttribute('data-auto-show-delay') || '5', 10);
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'ai-customer-service-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style[position] = '20px';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  // Create widget button
  const button = document.createElement('button');
  button.id = 'ai-customer-service-button';
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = primaryColor;
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.transition = 'transform 0.3s ease';
  container.appendChild(button);
  
  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'ai-customer-service-chat';
  chatWindow.style.position = 'absolute';
  chatWindow.style.bottom = '70px';
  chatWindow.style[position] = '0';
  chatWindow.style.width = '350px';
  chatWindow.style.height = '500px';
  chatWindow.style.backgroundColor = theme === 'dark' ? '#333' : 'white';
  chatWindow.style.borderRadius = '10px';
  chatWindow.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.fontFamily = fontFamily;
  chatWindow.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  chatWindow.style.transform = 'translateY(20px)';
  chatWindow.style.opacity = '0';
  container.appendChild(chatWindow);
  
  // Create chat header
  const chatHeader = document.createElement('div');
  chatHeader.style.padding = '15px';
  chatHeader.style.backgroundColor = primaryColor;
  chatHeader.style.color = 'white';
  chatHeader.style.display = 'flex';
  chatHeader.style.alignItems = 'center';
  chatHeader.style.justifyContent = 'space-between';
  chatWindow.appendChild(chatHeader);
  
  // Create header title
  const headerTitle = document.createElement('h3');
  headerTitle.textContent = 'Customer Support';
  headerTitle.style.margin = '0';
  headerTitle.style.fontSize = '16px';
  chatHeader.appendChild(headerTitle);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0';
  closeButton.style.lineHeight = '1';
  chatHeader.appendChild(closeButton);
  
  // Create chat messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.style.flex = '1';
  messagesContainer.style.padding = '15px';
  messagesContainer.style.overflowY = 'auto';
  messagesContainer.style.backgroundColor = theme === 'dark' ? '#222' : '#f9f9f9';
  chatWindow.appendChild(messagesContainer);
  
  // Create chat input container
  const inputContainer = document.createElement('div');
  inputContainer.style.padding = '15px';
  inputContainer.style.borderTop = theme === 'dark' ? '1px solid #444' : '1px solid #eee';
  inputContainer.style.display = 'flex';
  inputContainer.style.backgroundColor = theme === 'dark' ? '#333' : 'white';
  chatWindow.appendChild(inputContainer);
  
  // Create chat input
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your message...';
  input.style.flex = '1';
  input.style.padding = '10px 15px';
  input.style.border = theme === 'dark' ? '1px solid #444' : '1px solid #ddd';
  input.style.borderRadius = '20px';
  input.style.fontSize = '14px';
  input.style.backgroundColor = theme === 'dark' ? '#444' : 'white';
  input.style.color = theme === 'dark' ? 'white' : 'black';
  inputContainer.appendChild(input);
  
  // Create send button
  const sendButton = document.createElement('button');
  sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  sendButton.style.marginLeft = '10px';
  sendButton.style.backgroundColor = primaryColor;
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '50%';
  sendButton.style.width = '36px';
  sendButton.style.height = '36px';
  sendButton.style.display = 'flex';
  sendButton.style.alignItems = 'center';
  sendButton.style.justifyContent = 'center';
  sendButton.style.cursor = 'pointer';
  inputContainer.appendChild(sendButton);
  
  // Chat state
  let isOpen = false;
  let conversationId = null;
  let visitorId = 'visitor-' + Date.now();
  
  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    
    if (isOpen) {
      chatWindow.style.display = 'flex';
      setTimeout(() => {
        chatWindow.style.transform = 'translateY(0)';
        chatWindow.style.opacity = '1';
      }, 10);
      
      // Initialize chat if first open
      if (!conversationId) {
        initializeChat();
      }
    } else {
      chatWindow.style.transform = 'translateY(20px)';
      chatWindow.style.opacity = '0';
      setTimeout(() => {
        chatWindow.style.display = 'none';
      }, 300);
    }
  }
  
  // Initialize chat
  function initializeChat() {
    // Add welcome message
    addBotMessage("Hello! Welcome to our customer service chat. How can I assist you today?");
    
    // Add suggested actions
    const suggestedActions = [
      'What are your business hours?',
      'Tell me about your products',
      'Do you offer free shipping?',
      'I need help with a return'
    ];
    
    addSuggestedActions(suggestedActions);
    
    // Create conversation
    fetch('/api/chatbot/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        businessId,
        visitorId,
        visitorName: '',
        visitorEmail: '',
        source: 'website'
      })
    })
    .then(response => response.json())
    .then(data => {
      conversationId = data.id;
    })
    .catch(error => {
      console.error('Error creating conversation:', error);
    });
  }
  
  // Add bot message
  function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.display = 'flex';
    messageDiv.style.marginBottom = '15px';
    
    const contentDiv = document.createElement('div');
    contentDiv.style.backgroundColor = theme === 'dark' ? '#444' : '#e5e5ea';
    contentDiv.style.color = theme === 'dark' ? 'white' : 'black';
    contentDiv.style.padding = '10px 15px';
    contentDiv.style.borderRadius = '18px';
    contentDiv.style.borderBottomLeftRadius = '4px';
    contentDiv.style.maxWidth = '80%';
    contentDiv.style.wordWrap = 'break-word';
    
    // Handle newlines
    text.split('\\n').forEach((line, index, array) => {
      contentDiv.appendChild(document.createTextNode(line));
      if (index < array.length - 1) {
        contentDiv.appendChild(document.createElement('br'));
      }
    });
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add message to conversation if conversationId exists
    if (conversationId) {
      fetch(\`/api/chatbot/conversations/\${conversationId}/messages\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: text,
          sender: 'assistant'
        })
      }).catch(error => {
        console.error('Error adding bot message:', error);
      });
    }
  }
  
  // Add user message
  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = 'flex-end';
    messageDiv.style.marginBottom = '15px';
    
    const contentDiv = document.createElement('div');
    contentDiv.textContent = text;
    contentDiv.style.backgroundColor = primaryColor;
    contentDiv.style.color = 'white';
    contentDiv.style.padding = '10px 15px';
    contentDiv.style.borderRadius = '18px';
    contentDiv.style.borderBottomRightRadius = '4px';
    contentDiv.style.maxWidth = '80%';
    contentDiv.style.wordWrap = 'break-word';
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add message to conversation if conversationId exists
    if (conversationId) {
      fetch(\`/api/chatbot/conversations/\${conversationId}/messages\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: text,
          sender: 'user'
        })
      }).catch(error => {
        console.error('Error adding user message:', error);
      });
    }
  }
  
  // Add suggested actions
  function addSuggestedActions(actions) {
    const actionsDiv = document.createElement('div');
    actionsDiv.style.display = 'flex';
    actionsDiv.style.flexWrap = 'wrap';
    actionsDiv.style.gap = '8px';
    actionsDiv.style.marginBottom = '15px';
    
    actions.forEach(action => {
      const actionButton = document.createElement('button');
      actionButton.textContent = action;
      actionButton.style.backgroundColor = theme === 'dark' ? '#444' : '#f0f0f0';
      actionButton.style.color = theme === 'dark' ? 'white' : 'black';
      actionButton.style.border = theme === 'dark' ? '1px solid #555' : '1px solid #ddd';
      actionButton.style.borderRadius = '16px';
      actionButton.style.padding = '6px 12px';
      actionButton.style.fontSize = '14px';
      actionButton.style.cursor = 'pointer';
      
      actionButton.addEventListener('click', () => {
        sendMessage(action);
      });
      
      actionsDiv.appendChild(actionButton);
    });
    
    messagesContainer.appendChild(actionsDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.display = 'flex';
    typingDiv.style.marginBottom = '15px';
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.style.backgroundColor = theme === 'dark' ? '#444' : '#e5e5ea';
    indicatorDiv.style.padding = '10px 15px';
    indicatorDiv.style.borderRadius = '18px';
    indicatorDiv.style.borderBottomLeftRadius = '4px';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = theme === 'dark' ? '#aaa' : '#999';
      dot.style.marginRight = i < 2 ? '5px' : '0';
      dot.style.animation = \`typing 1s infinite \${i * 0.2}s\`;
      indicatorDiv.appendChild(dot);
    }
    
    // Add keyframes for typing animation
    if (!document.getElementById('typing-animation')) {
      const style = document.createElement('style');
      style.id = 'typing-animation';
      style.textContent = \`
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      \`;
      document.head.appendChild(style);
    }
    
    typingDiv.appendChild(indicatorDiv);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Process message
  function processMessage(message) {
    // Show typing indicator
    showTypingIndicator();
    
    // Process message with API
    fetch(\`/api/chatbot/messages?businessId=\${businessId}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        conversationId
      })
    })
    .then(response => response.json())
    .then(data => {
      // Hide typing indicator
      hideTypingIndicator();
      
      // Add bot response
      addBotMessage(data.text);
      
      // Add suggested actions if available
      if (data.suggestedActions && data.suggestedActions.length > 0) {
        addSuggestedActions(data.suggestedActions);
      }
      
      // Handle human intervention
      if (data.requiresHumanIntervention) {
        setTimeout(() => {
          addBotMessage("A customer service representative will be with you shortly. In the meantime, is there anything specific you'd like them to know?");
        }, 1000);
      }
    })
    .catch(error => {
      console.error('Error processing message:', error);
      hideTypingIndicator();
      addBotMessage("I'm sorry, I'm having trouble connecting to the server. Please try again later.");
    });
  }
  
  // Send message
  function sendMessage(text) {
    if (!text) {
      text = input.value.trim();
    }
    
    if (!text) return;
    
    // Add user message
    addUserMessage(text);
    
    // Clear input
    input.value = '';
    
    // Process message
    processMessage(text);
  }
  
  // Event listeners
  button.addEventListener('click', toggleChat);
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat();
  });
  
  sendButton.addEventListener('click', () => {
    sendMessage();
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Auto-show chat after delay if enabled
  if (autoShow) {
    setTimeout(() => {
      if (!isOpen) {
        toggleChat();
      }
    }, autoShowDelay * 1000);
  }
})();
  `;
}
