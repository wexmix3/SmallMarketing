/**
 * AI Customer Service Assistant API
 * Simple API endpoint for the chatbot to fetch business data
 */

// In a real implementation, this would be a Node.js server with Express
// For demo purposes, we're using a simple JavaScript file that simulates API endpoints

class ChatbotAPI {
  constructor() {
    this.dataPath = 'api/chatbot-data.json';
    this.data = null;
  }

  /**
   * Load data from JSON file
   * @returns {Promise<Object>} The loaded data
   */
  async loadData() {
    try {
      const response = await fetch(this.dataPath);
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading chatbot data:', error);
      throw error;
    }
  }

  /**
   * Get business information
   * @returns {Promise<Object>} Business information
   */
  async getBusinessInfo() {
    if (!this.data) {
      await this.loadData();
    }
    return this.data.businessInfo;
  }

  /**
   * Get FAQs
   * @returns {Promise<Array>} List of FAQs
   */
  async getFAQs() {
    if (!this.data) {
      await this.loadData();
    }
    return this.data.faqs;
  }

  /**
   * Get products
   * @returns {Promise<Array>} List of products
   */
  async getProducts() {
    if (!this.data) {
      await this.loadData();
    }
    return this.data.products;
  }

  /**
   * Get testimonials
   * @returns {Promise<Array>} List of testimonials
   */
  async getTestimonials() {
    if (!this.data) {
      await this.loadData();
    }
    return this.data.testimonials;
  }

  /**
   * Process a user message and generate a response
   * @param {string} message - The user's message
   * @returns {Promise<Object>} The response object
   */
  async processMessage(message) {
    if (!this.data) {
      await this.loadData();
    }

    const lowerMessage = message.toLowerCase();
    let response = {
      text: '',
      type: 'text',
      suggestedActions: []
    };

    // Check for FAQ matches
    const faqMatch = this.data.faqs.find(faq => 
      lowerMessage.includes(faq.question.toLowerCase())
    );

    if (faqMatch) {
      response.text = faqMatch.answer;
      response.suggestedActions = ['Tell me more about your services', 'How can I contact you?', 'Thank you'];
      return response;
    }

    // Check for business hours
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      const hours = this.data.businessInfo.hours;
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
      
      response.text = `Our hours of operation are:\n`;
      for (const day in hours) {
        response.text += `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}\n`;
      }
      
      response.text += `\nToday (${daysOfWeek[today].charAt(0).toUpperCase() + daysOfWeek[today].slice(1)}), we're ${hours[daysOfWeek[today]] === 'Closed' ? 'closed' : 'open ' + hours[daysOfWeek[today]]}.`;
      response.suggestedActions = ['What services do you offer?', 'How can I contact you?', 'Thank you'];
      return response;
    }

    // Check for contact information
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      response.text = `You can contact us by:\n`;
      response.text += `Phone: ${this.data.businessInfo.phone}\n`;
      response.text += `Email: ${this.data.businessInfo.email}\n`;
      response.text += `Address: ${this.data.businessInfo.address}`;
      response.suggestedActions = ['What are your hours?', 'What services do you offer?', 'Thank you'];
      return response;
    }

    // Check for services/products
    if (lowerMessage.includes('service') || lowerMessage.includes('product') || lowerMessage.includes('offer') || lowerMessage.includes('sell')) {
      response.text = `We offer the following products and services:\n`;
      this.data.products.forEach(product => {
        response.text += `\n${product.name}: ${product.description}\n`;
        response.text += `Price: $${product.price}\n`;
      });
      response.suggestedActions = ['Tell me more about pricing', 'Do you offer refunds?', 'How can I contact you?'];
      return response;
    }

    // Check for pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      response.text = `Here's our pricing information:\n`;
      this.data.products.forEach(product => {
        response.text += `\n${product.name}: $${product.price}\n`;
      });
      response.suggestedActions = ['Tell me more about your services', 'Do you offer refunds?', 'How can I contact you?'];
      return response;
    }

    // Default response
    response.text = `Thank you for your message! I'm an AI assistant for ${this.data.businessInfo.name}. How can I help you today?`;
    response.suggestedActions = ['What services do you offer?', 'What are your hours?', 'How can I contact you?'];
    return response;
  }
}

// Export the API
window.ChatbotAPI = new ChatbotAPI();
