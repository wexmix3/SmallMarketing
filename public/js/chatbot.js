/**
 * AI Customer Service Assistant Chatbot
 * A simple, robust chatbot implementation for the demo
 */

class Chatbot {
  /**
   * Initialize the chatbot
   * @param {HTMLElement} container - The container element for the chatbot
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    // Store references
    this.container = container;
    this.options = Object.assign({
      primaryColor: '#0071e3',
      chatbotName: 'AI Customer Service Assistant',
      welcomeMessage: 'Hello! I\'m your AI Customer Service Assistant. How can I help you today?',
      suggestedActions: [
        'What services do you offer?',
        'How does this work?',
        'Pricing information'
      ]
    }, options);
    
    // Create elements
    this.createElements();
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  /**
   * Create chatbot elements
   */
  createElements() {
    // Create chat widget
    this.widget = document.createElement('div');
    this.widget.className = 'chat-widget';
    this.widget.style.setProperty('--primary-color', this.options.primaryColor);
    
    // Create chat header
    this.header = document.createElement('div');
    this.header.className = 'chat-header';
    this.header.innerHTML = `
      <div class="chat-title">${this.options.chatbotName}</div>
      <div class="chat-controls">
        <button type="button" class="minimize-button">_</button>
      </div>
    `;
    
    // Create messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'chat-messages';
    
    // Create input area
    this.inputArea = document.createElement('div');
    this.inputArea.className = 'chat-input';
    this.inputArea.innerHTML = `
      <input type="text" placeholder="Type your message...">
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    `;
    
    // Assemble chat widget
    this.widget.appendChild(this.header);
    this.widget.appendChild(this.messagesContainer);
    this.widget.appendChild(this.inputArea);
    
    // Add to container
    this.container.appendChild(this.widget);
    
    // Store references to input elements
    this.input = this.inputArea.querySelector('input');
    this.sendButton = this.inputArea.querySelector('button');
    
    // Add welcome message
    this.addMessage(this.options.welcomeMessage, 'assistant');
    
    // Add initial suggested actions
    this.addSuggestedActions(this.options.suggestedActions);
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Input field - send on Enter
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserInput();
      }
    });
    
    // Send button
    this.sendButton.addEventListener('click', () => {
      this.handleUserInput();
    });
    
    // Action buttons - use event delegation
    this.messagesContainer.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('action-button')) {
        this.handleUserInput(e.target.textContent);
      }
    });
  }
  
  /**
   * Handle user input
   * @param {string} [text] - Optional text input (used for action buttons)
   */
  handleUserInput(text) {
    // Get text from input field or parameter
    const userInput = text || this.input.value;
    
    // Validate input
    if (!userInput || !userInput.trim()) return;
    
    // Add user message
    this.addMessage(userInput, 'user');
    
    // Clear input field
    this.input.value = '';
    
    // Remove suggested actions
    this.removeSuggestedActions();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process the message and respond after a delay
    setTimeout(() => {
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Generate and add response
      const response = this.generateResponse(userInput);
      this.addMessage(response, 'assistant');
      
      // Add new suggested actions
      this.addSuggestedActions([
        'Tell me more',
        'How do I get started?',
        'Thank you'
      ]);
    }, 1500);
  }
  
  /**
   * Add a message to the chat
   * @param {string} text - Message text
   * @param {string} sender - Message sender ('user' or 'assistant')
   */
  addMessage(text, sender) {
    // Create message element
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    
    // Format current time
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Set message content
    message.innerHTML = `
      <div class="message-content">${text}</div>
      <div class="message-time">${time}${sender === 'assistant' ? ' • AI' : ''}</div>
    `;
    
    // Add to messages container
    this.messagesContainer.appendChild(message);
    
    // Scroll to bottom
    this.scrollToBottom();
  }
  
  /**
   * Add suggested actions
   * @param {string[]} actions - Array of action texts
   */
  addSuggestedActions(actions) {
    // Create suggested actions container
    const suggestedActions = document.createElement('div');
    suggestedActions.className = 'suggested-actions';
    
    // Add action buttons
    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'action-button';
      button.textContent = action;
      suggestedActions.appendChild(button);
    });
    
    // Add to messages container
    this.messagesContainer.appendChild(suggestedActions);
    
    // Scroll to bottom
    this.scrollToBottom();
  }
  
  /**
   * Remove suggested actions
   */
  removeSuggestedActions() {
    const suggestedActions = this.messagesContainer.querySelector('.suggested-actions');
    if (suggestedActions) {
      suggestedActions.remove();
    }
  }
  
  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    // Create typing indicator
    this.typingIndicator = document.createElement('div');
    this.typingIndicator.className = 'typing-indicator';
    this.typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    // Add to messages container
    this.messagesContainer.appendChild(this.typingIndicator);
    
    // Scroll to bottom
    this.scrollToBottom();
  }
  
  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    if (this.typingIndicator && this.typingIndicator.parentNode) {
      this.typingIndicator.remove();
    }
  }
  
  /**
   * Generate response based on user input
   * @param {string} userInput - User input text
   * @returns {string} - AI response
   */
  generateResponse(userInput) {
    // Convert to lowercase for easier matching
    const lowerInput = userInput.toLowerCase();
    
    // Match input to responses
    if (lowerInput.includes('service') || lowerInput.includes('offer')) {
      return 'We offer an AI-powered customer service assistant that can help answer customer questions, schedule appointments, and provide information about your business 24/7.';
    } else if (lowerInput.includes('work') || lowerInput.includes('how')) {
      return 'Our AI assistant integrates with your website and uses your business information to answer customer questions automatically. It learns from your knowledge base and gets smarter over time.';
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return 'We offer three pricing tiers: Basic ($29/month), Standard ($59/month), and Premium ($99/month). Each tier includes different features and interaction limits.';
    } else if (lowerInput.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with today?';
    } else if (lowerInput.includes('start')) {
      return 'Getting started is easy! Just click the "Get Started" button at the top of the page to create your account, then follow our simple setup wizard to configure your AI assistant.';
    } else if (lowerInput.includes('tell me more')) {
      return 'Our AI assistant uses advanced natural language processing to understand customer questions and provide accurate answers. It can handle common inquiries, schedule appointments, provide product information, and much more!';
    } else {
      return 'Thank you for your question! In a real implementation, I would be trained on your specific business information to provide accurate answers to customer questions.';
    }
  }
  
  /**
   * Scroll messages container to bottom
   */
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Export the Chatbot class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Chatbot;
}
