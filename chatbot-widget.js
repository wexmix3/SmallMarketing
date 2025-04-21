/**
 * AI Customer Service Assistant
 * Chatbot Widget Implementation
 */

// Widget configuration
const widgetConfig = {
  position: 'bottom-right',
  primaryColor: '#0071e3',
  chatbotName: 'AI Customer Service Assistant',
  welcomeMessage: 'Hello! Welcome to our website. How can I assist you today?',
  autoOpen: false,
  autoOpenDelay: 5000,
  showAvatar: true,
  theme: 'light',
  font: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  businessId: 'demo-business'
};

// Widget state
let widgetState = {
  isOpen: false,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  position: { x: null, y: null },
  conversationStarted: false,
  unreadMessages: 0
};

// DOM Elements
let widgetContainer;
let toggleButton;
let chatMessages;
let messageInput;
let sendButton;

/**
 * Initialize the chatbot widget
 * @param {Object} config - Widget configuration
 */
function initChatbotWidget(config = {}) {
  console.log('Initializing chatbot widget...');
  
  // Merge default config with provided config
  Object.assign(widgetConfig, config);
  
  // Create widget elements
  createWidgetElements();
  
  // Initialize event listeners
  initWidgetEventListeners();
  
  // Apply theme
  applyTheme(widgetConfig.theme);
  
  // Apply primary color
  document.documentElement.style.setProperty('--primary-color', widgetConfig.primaryColor);
  
  // Apply font
  document.documentElement.style.setProperty('--font-family', widgetConfig.font);
  
  // Auto open if configured
  if (widgetConfig.autoOpen) {
    setTimeout(() => {
      openWidget();
    }, widgetConfig.autoOpenDelay);
  }
  
  console.log('Chatbot widget initialized');
}

/**
 * Create widget elements
 */
function createWidgetElements() {
  // Create toggle button
  toggleButton = document.createElement('div');
  toggleButton.className = 'chatbot-toggle';
  toggleButton.innerHTML = '<i class="fas fa-comment"></i>';
  document.body.appendChild(toggleButton);
  
  // Create widget container
  widgetContainer = document.createElement('div');
  widgetContainer.className = 'chatbot-widget';
  widgetContainer.innerHTML = `
    <div class="chat-header">
      <div class="chat-title">
        <div class="status"></div>
        <h2>${widgetConfig.chatbotName}</h2>
      </div>
      <div class="chat-actions">
        <button class="chat-action" id="minimize-widget"><i class="fas fa-minus"></i></button>
        <button class="chat-action" id="close-widget"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="chat-messages" id="chatMessages">
      <!-- Messages will be added here -->
    </div>
    <div class="chat-input">
      <textarea id="messageInput" placeholder="Type your message..."></textarea>
      <button id="sendButton" class="send-button">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;
  document.body.appendChild(widgetContainer);
  
  // Get DOM elements
  chatMessages = document.getElementById('chatMessages');
  messageInput = document.getElementById('messageInput');
  sendButton = document.getElementById('sendButton');
  
  // Add scroll to bottom button
  const scrollButton = document.createElement('div');
  scrollButton.className = 'scroll-to-bottom';
  scrollButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
  chatMessages.appendChild(scrollButton);
  
  // Position widget based on config
  positionWidget(widgetConfig.position);
}

/**
 * Initialize widget event listeners
 */
function initWidgetEventListeners() {
  // Toggle button click
  toggleButton.addEventListener('click', toggleWidget);
  
  // Close button click
  document.getElementById('close-widget').addEventListener('click', closeWidget);
  
  // Minimize button click
  document.getElementById('minimize-widget').addEventListener('click', closeWidget);
  
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Scroll to bottom button click
  const scrollButton = document.querySelector('.scroll-to-bottom');
  if (scrollButton) {
    scrollButton.addEventListener('click', scrollToBottom);
  }
  
  // Handle scroll indicator
  chatMessages.addEventListener('scroll', updateScrollIndicator);
  
  // Update when messages change
  const observer = new MutationObserver(updateScrollIndicator);
  observer.observe(chatMessages, { childList: true, subtree: true });
  
  // Make widget draggable
  initDraggable();
}

/**
 * Make widget draggable
 */
function initDraggable() {
  const header = widgetContainer.querySelector('.chat-header');
  
  header.addEventListener('mousedown', function(e) {
    // Only allow dragging from header
    if (e.target.closest('.chat-action')) return;
    
    widgetState.isDragging = true;
    
    // Get initial position
    const rect = widgetContainer.getBoundingClientRect();
    
    // Calculate offset
    widgetState.dragOffset.x = e.clientX - rect.left;
    widgetState.dragOffset.y = e.clientY - rect.top;
    
    // Add dragging class
    widgetContainer.classList.add('dragging');
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!widgetState.isDragging) return;
    
    // Calculate new position
    const x = e.clientX - widgetState.dragOffset.x;
    const y = e.clientY - widgetState.dragOffset.y;
    
    // Apply new position
    widgetContainer.style.left = `${x}px`;
    widgetContainer.style.top = `${y}px`;
    widgetContainer.style.right = 'auto';
    widgetContainer.style.bottom = 'auto';
    
    // Update position state
    widgetState.position.x = x;
    widgetState.position.y = y;
  });
  
  document.addEventListener('mouseup', function() {
    if (!widgetState.isDragging) return;
    
    widgetState.isDragging = false;
    
    // Remove dragging class
    widgetContainer.classList.remove('dragging');
  });
}

/**
 * Position widget based on position string
 * @param {string} position - Position string (bottom-right, bottom-left, top-right, top-left)
 */
function positionWidget(position) {
  // Reset position
  widgetContainer.style.top = 'auto';
  widgetContainer.style.right = 'auto';
  widgetContainer.style.bottom = 'auto';
  widgetContainer.style.left = 'auto';
  
  // Apply position
  switch (position) {
    case 'bottom-right':
      widgetContainer.style.bottom = '20px';
      widgetContainer.style.right = '20px';
      break;
    case 'bottom-left':
      widgetContainer.style.bottom = '20px';
      widgetContainer.style.left = '20px';
      break;
    case 'top-right':
      widgetContainer.style.top = '20px';
      widgetContainer.style.right = '20px';
      break;
    case 'top-left':
      widgetContainer.style.top = '20px';
      widgetContainer.style.left = '20px';
      break;
    default:
      widgetContainer.style.bottom = '20px';
      widgetContainer.style.right = '20px';
  }
  
  // If custom position is set, use that instead
  if (widgetState.position.x !== null && widgetState.position.y !== null) {
    widgetContainer.style.left = `${widgetState.position.x}px`;
    widgetContainer.style.top = `${widgetState.position.y}px`;
    widgetContainer.style.right = 'auto';
    widgetContainer.style.bottom = 'auto';
  }
}

/**
 * Toggle widget open/closed
 */
function toggleWidget() {
  if (widgetState.isOpen) {
    closeWidget();
  } else {
    openWidget();
  }
}

/**
 * Open widget
 */
function openWidget() {
  widgetContainer.classList.add('open');
  toggleButton.classList.add('open');
  widgetState.isOpen = true;
  
  // Reset unread count
  widgetState.unreadMessages = 0;
  updateUnreadBadge();
  
  // Show welcome message if conversation not started
  if (!widgetState.conversationStarted) {
    showWelcomeMessage();
    widgetState.conversationStarted = true;
  }
  
  // Focus input
  setTimeout(() => {
    messageInput.focus();
  }, 300);
}

/**
 * Close widget
 */
function closeWidget() {
  widgetContainer.classList.remove('open');
  toggleButton.classList.remove('open');
  widgetState.isOpen = false;
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
  const welcomeMessage = {
    text: widgetConfig.welcomeMessage,
    confidence: 1.0,
    intent: 'welcome',
    suggestedActions: [
      'What services do you offer?',
      'How can I contact you?',
      'What are your business hours?'
    ]
  };
  
  addBotMessage(welcomeMessage);
}

/**
 * Send a message
 */
function sendMessage() {
  const message = messageInput.value.trim();
  
  if (message) {
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message (mock implementation)
    setTimeout(() => {
      // Call the main chatbot's processMessage function
      if (typeof window.processMessage === 'function') {
        window.processMessage(message);
      } else {
        // Fallback if main chatbot not loaded
        const response = {
          text: "I'm here to help! What would you like to know?",
          confidence: 0.7,
          intent: 'general_inquiry',
          suggestedActions: [
            'Tell me about your products',
            'What are your business hours?',
            'How can I contact you?'
          ]
        };
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add bot message
        addBotMessage(response);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }
}

/**
 * Add a user message to the chat
 * @param {string} message - The user's message
 */
function addUserMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';
  messageElement.innerHTML = `
    <div class="message-content">
      <p>${formatMessage(message)}</p>
    </div>
    <div class="message-time">${formatTime(new Date())}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

/**
 * Add a bot message to the chat
 * @param {Object} response - The bot's response
 */
function addBotMessage(response) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message bot-message';
  
  let avatarHTML = '';
  if (widgetConfig.showAvatar) {
    avatarHTML = `
      <div class="message-avatar">
        <div class="avatar-icon">
          <i class="fas fa-robot"></i>
        </div>
      </div>
    `;
  }
  
  let suggestedActionsHTML = '';
  if (response.suggestedActions && response.suggestedActions.length > 0) {
    suggestedActionsHTML = `
      <div class="suggested-actions">
        ${response.suggestedActions.map(action => `
          <button class="suggested-action" onclick="handleSuggestedAction(this)">${action}</button>
        `).join('')}
      </div>
    `;
  }
  
  messageElement.innerHTML = `
    ${avatarHTML}
    <div class="message-content">
      <p>${formatMessage(response.text)}</p>
      ${suggestedActionsHTML}
    </div>
    <div class="message-time">${formatTime(new Date())}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
  
  // Increment unread count if widget is closed
  if (!widgetState.isOpen) {
    widgetState.unreadMessages++;
    updateUnreadBadge();
  }
}

/**
 * Handle a suggested action click
 * @param {HTMLElement} button - The clicked button
 */
function handleSuggestedAction(button) {
  const action = button.textContent;
  messageInput.value = action;
  sendMessage();
}

/**
 * Show the typing indicator
 */
function showTypingIndicator() {
  // Remove existing indicator if any
  hideTypingIndicator();
  
  const indicatorElement = document.createElement('div');
  indicatorElement.className = 'message bot-message typing-indicator';
  
  let avatarHTML = '';
  if (widgetConfig.showAvatar) {
    avatarHTML = `
      <div class="message-avatar">
        <div class="avatar-icon">
          <i class="fas fa-robot"></i>
        </div>
      </div>
    `;
  }
  
  indicatorElement.innerHTML = `
    ${avatarHTML}
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(indicatorElement);
  scrollToBottom();
}

/**
 * Hide the typing indicator
 */
function hideTypingIndicator() {
  const indicator = document.querySelector('.typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Format a message with line breaks and links
 * @param {string} text - The message text
 * @returns {string} - The formatted message
 */
function formatMessage(text) {
  // Convert line breaks to <br>
  let formatted = text.replace(/\n/g, '<br>');
  
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  formatted = formatted.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  
  return formatted;
}

/**
 * Format a time
 * @param {Date} date - The date to format
 * @returns {string} - The formatted time
 */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Scroll to the bottom of the chat
 */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
  updateScrollIndicator();
}

/**
 * Update scroll indicator
 */
function updateScrollIndicator() {
  if (chatMessages.scrollHeight > chatMessages.clientHeight) {
    const isScrolledToBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 10;
    
    if (!isScrolledToBottom) {
      chatMessages.classList.add('can-scroll');
    } else {
      chatMessages.classList.remove('can-scroll');
    }
  } else {
    chatMessages.classList.remove('can-scroll');
  }
}

/**
 * Update unread badge
 */
function updateUnreadBadge() {
  // Remove existing badge
  const existingBadge = toggleButton.querySelector('.unread-badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Add badge if there are unread messages
  if (widgetState.unreadMessages > 0) {
    const badge = document.createElement('div');
    badge.className = 'unread-badge';
    badge.textContent = widgetState.unreadMessages > 9 ? '9+' : widgetState.unreadMessages;
    toggleButton.appendChild(badge);
  }
}

/**
 * Apply theme
 * @param {string} theme - Theme name (light or dark)
 */
function applyTheme(theme) {
  document.body.className = theme;
}

/**
 * Update widget configuration
 * @param {Object} config - New configuration
 */
function updateWidgetConfig(config) {
  // Update config
  Object.assign(widgetConfig, config);
  
  // Update widget title
  const titleElement = widgetContainer.querySelector('.chat-title h2');
  if (titleElement) {
    titleElement.textContent = widgetConfig.chatbotName;
  }
  
  // Update primary color
  document.documentElement.style.setProperty('--primary-color', widgetConfig.primaryColor);
  
  // Update font
  document.documentElement.style.setProperty('--font-family', widgetConfig.font);
  
  // Update avatar visibility
  if (widgetConfig.showAvatar) {
    document.querySelectorAll('.message-avatar').forEach(avatar => {
      avatar.style.display = 'flex';
    });
  } else {
    document.querySelectorAll('.message-avatar').forEach(avatar => {
      avatar.style.display = 'none';
    });
  }
  
  // Update position
  positionWidget(widgetConfig.position);
  
  // Update theme
  applyTheme(widgetConfig.theme);
}

// Expose functions to global scope
window.initChatbotWidget = initChatbotWidget;
window.updateWidgetConfig = updateWidgetConfig;
window.openWidget = openWidget;
window.closeWidget = closeWidget;
window.addBotMessage = addBotMessage;
window.handleSuggestedAction = handleSuggestedAction;
