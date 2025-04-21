/**
 * Setup Wizard JavaScript
 * AI Customer Service Assistant
 */

// Store wizard data
const wizardData = {
  businessInfo: {},
  chatbotConfig: {},
  knowledgeBase: {
    faqs: []
  },
  integration: {
    method: 'embed'
  }
};

// Initialize the wizard
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing setup wizard...');
  
  // Initialize step navigation
  initStepNavigation();
  
  // Initialize form handlers
  initFormHandlers();
  
  // Initialize review section
  initReviewSection();
  
  // Initialize launch button
  initLaunchButton();
  
  console.log('Setup wizard initialized');
});

/**
 * Initialize step navigation
 */
function initStepNavigation() {
  const steps = document.querySelectorAll('.wizard-steps .step');
  const stepContents = document.querySelectorAll('.wizard-step-content');
  const nextButton = document.getElementById('next-step');
  const prevButton = document.getElementById('prev-step');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  // Current step
  let currentStep = 1;
  const totalSteps = steps.length;
  
  // Update progress
  function updateProgress() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
  }
  
  // Go to step
  function goToStep(stepNumber) {
    // Validate step number
    if (stepNumber < 1 || stepNumber > totalSteps) return;
    
    // Update current step
    currentStep = stepNumber;
    
    // Update step classes
    steps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active');
      
      if (stepNum < currentStep) {
        step.classList.add('completed');
      } else if (stepNum === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('completed');
      }
    });
    
    // Update step content visibility
    stepContents.forEach(content => {
      content.classList.remove('active');
      if (parseInt(content.getAttribute('data-step')) === currentStep) {
        content.classList.add('active');
      }
    });
    
    // Update buttons
    prevButton.disabled = currentStep === 1;
    nextButton.textContent = currentStep === totalSteps ? 'Complete Setup' : 'Next Step';
    
    // Update progress
    updateProgress();
  }
  
  // Add click event to steps
  steps.forEach(step => {
    step.addEventListener('click', function() {
      const stepNum = parseInt(this.getAttribute('data-step'));
      
      // Only allow going to completed steps or the next step
      if (stepNum <= currentStep || stepNum === currentStep + 1) {
        goToStep(stepNum);
      }
    });
  });
  
  // Add click event to next button
  nextButton.addEventListener('click', function() {
    // Validate current step form
    if (validateStep(currentStep)) {
      // Save current step data
      saveStepData(currentStep);
      
      // Go to next step
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      } else {
        // Complete setup
        completeSetup();
      }
    }
  });
  
  // Add click event to previous button
  prevButton.addEventListener('click', function() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });
  
  // Add click event to edit buttons in review section
  document.querySelectorAll('.edit-section').forEach(button => {
    button.addEventListener('click', function() {
      const stepNum = parseInt(this.getAttribute('data-step'));
      goToStep(stepNum);
    });
  });
  
  // Initialize with step 1
  goToStep(1);
}

/**
 * Validate step form
 * @param {number} stepNumber - The step number to validate
 * @returns {boolean} - Whether the step is valid
 */
function validateStep(stepNumber) {
  let isValid = true;
  
  switch (stepNumber) {
    case 1:
      // Business Information
      const businessForm = document.getElementById('business-info-form');
      isValid = validateForm(businessForm);
      break;
      
    case 2:
      // Chatbot Configuration
      const chatbotForm = document.getElementById('chatbot-config-form');
      isValid = validateForm(chatbotForm);
      break;
      
    case 3:
      // Knowledge Base
      const knowledgeForm = document.getElementById('knowledge-base-form');
      isValid = validateForm(knowledgeForm);
      break;
      
    case 4:
      // Integration
      // No validation needed
      break;
      
    case 5:
      // Review & Launch
      // No validation needed
      break;
  }
  
  return isValid;
}

/**
 * Validate a form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  // Remove existing error messages
  form.querySelectorAll('.form-error').forEach(error => error.remove());
  
  // Check each required field
  requiredFields.forEach(field => {
    field.classList.remove('input-error');
    
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('input-error');
      
      // Add error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'form-error';
      errorMessage.textContent = 'This field is required';
      field.parentNode.appendChild(errorMessage);
    }
  });
  
  return isValid;
}

/**
 * Save step data
 * @param {number} stepNumber - The step number to save
 */
function saveStepData(stepNumber) {
  switch (stepNumber) {
    case 1:
      // Business Information
      const businessForm = document.getElementById('business-info-form');
      wizardData.businessInfo = {
        name: businessForm.businessName.value,
        industry: businessForm.businessIndustry.value,
        size: businessForm.businessSize.value,
        website: businessForm.businessWebsite.value,
        email: businessForm.businessEmail.value,
        phone: businessForm.businessPhone.value
      };
      
      // Update review section
      document.getElementById('review-business-name').textContent = wizardData.businessInfo.name;
      document.getElementById('review-business-industry').textContent = getIndustryName(wizardData.businessInfo.industry);
      document.getElementById('review-business-size').textContent = getBusinessSizeName(wizardData.businessInfo.size);
      document.getElementById('review-business-website').textContent = wizardData.businessInfo.website || 'Not provided';
      break;
      
    case 2:
      // Chatbot Configuration
      const chatbotForm = document.getElementById('chatbot-config-form');
      wizardData.chatbotConfig = {
        name: chatbotForm.chatbotName.value,
        primaryColor: document.querySelector('.color-option.active').getAttribute('data-color'),
        position: document.querySelector('.position-option.active').getAttribute('data-position'),
        welcomeMessage: chatbotForm.welcomeMessage.value,
        autoOpen: chatbotForm.autoOpen.checked,
        showAvatar: chatbotForm.showAvatar.checked
      };
      
      // Update review section
      document.getElementById('review-chatbot-name').textContent = wizardData.chatbotConfig.name;
      document.getElementById('review-primary-color').style.backgroundColor = wizardData.chatbotConfig.primaryColor;
      document.getElementById('review-position').textContent = getPositionName(wizardData.chatbotConfig.position);
      document.getElementById('review-welcome-message').textContent = wizardData.chatbotConfig.welcomeMessage;
      
      // Update embed code
      updateEmbedCode();
      break;
      
    case 3:
      // Knowledge Base
      const faqItems = document.querySelectorAll('.faq-item');
      wizardData.knowledgeBase.faqs = [];
      
      faqItems.forEach((item, index) => {
        const questionInput = item.querySelector(`input[name="faqQuestion${index + 1}"]`);
        const answerInput = item.querySelector(`textarea[name="faqAnswer${index + 1}"]`);
        const categorySelect = item.querySelector(`select[name="faqCategory${index + 1}"]`);
        
        if (questionInput && answerInput && categorySelect) {
          wizardData.knowledgeBase.faqs.push({
            question: questionInput.value,
            answer: answerInput.value,
            category: categorySelect.value
          });
        }
      });
      
      // Update review section
      document.getElementById('review-faq-count').textContent = wizardData.knowledgeBase.faqs.length;
      
      // Get unique categories
      const categories = [...new Set(wizardData.knowledgeBase.faqs.map(faq => faq.category))];
      document.getElementById('review-faq-categories').textContent = categories.map(cat => getCategoryName(cat)).join(', ') || 'None';
      break;
      
    case 4:
      // Integration
      wizardData.integration.method = document.querySelector('.integration-method.active').getAttribute('data-method');
      
      // Update review section
      document.getElementById('review-integration-method').textContent = getIntegrationMethodName(wizardData.integration.method);
      break;
  }
  
  // Save to localStorage
  localStorage.setItem('wizardData', JSON.stringify(wizardData));
  console.log('Saved step data:', stepNumber, wizardData);
}

/**
 * Initialize form handlers
 */
function initFormHandlers() {
  // Color picker
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      // Update chatbot button color in preview
      const color = this.getAttribute('data-color');
      document.querySelector('.chatbot-button').style.backgroundColor = color;
    });
  });
  
  // Position selector
  const positionOptions = document.querySelectorAll('.position-option');
  positionOptions.forEach(option => {
    option.addEventListener('click', function() {
      positionOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      // Update chatbot position in preview
      const position = this.getAttribute('data-position');
      const chatbotPreview = document.querySelector('.chatbot-preview');
      
      // Reset position
      chatbotPreview.style.top = '';
      chatbotPreview.style.bottom = '';
      chatbotPreview.style.left = '';
      chatbotPreview.style.right = '';
      
      // Set new position
      if (position.includes('top')) {
        chatbotPreview.style.top = '20px';
      } else {
        chatbotPreview.style.bottom = '20px';
      }
      
      if (position.includes('left')) {
        chatbotPreview.style.left = '20px';
      } else {
        chatbotPreview.style.right = '20px';
      }
    });
  });
  
  // Add FAQ button
  const addFaqBtn = document.getElementById('add-faq-btn');
  if (addFaqBtn) {
    addFaqBtn.addEventListener('click', function() {
      const faqList = document.querySelector('.faq-list');
      const faqCount = faqList.querySelectorAll('.faq-item').length + 1;
      
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.innerHTML = `
        <div class="faq-header">
          <h4>FAQ #${faqCount}</h4>
          <button type="button" class="btn-icon remove-faq"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-row">
          <label class="form-label" for="faq-question-${faqCount}">Question</label>
          <input type="text" id="faq-question-${faqCount}" name="faqQuestion${faqCount}" class="form-input" placeholder="e.g., What are your business hours?" required>
        </div>
        <div class="form-row">
          <label class="form-label" for="faq-answer-${faqCount}">Answer</label>
          <textarea id="faq-answer-${faqCount}" name="faqAnswer${faqCount}" class="form-textarea" placeholder="Provide a detailed answer to the question..." required></textarea>
        </div>
        <div class="form-row">
          <label class="form-label" for="faq-category-${faqCount}">Category</label>
          <select id="faq-category-${faqCount}" name="faqCategory${faqCount}" class="form-select">
            <option value="general">General</option>
            <option value="products">Products</option>
            <option value="services">Services</option>
            <option value="pricing">Pricing</option>
            <option value="support">Support</option>
          </select>
        </div>
      `;
      
      faqList.appendChild(faqItem);
      
      // Add remove button event listener
      const removeBtn = faqItem.querySelector('.remove-faq');
      removeBtn.addEventListener('click', function() {
        faqList.removeChild(faqItem);
        updateFaqNumbers();
      });
    });
  }
  
  // Remove FAQ buttons
  document.querySelectorAll('.remove-faq').forEach(button => {
    button.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const faqList = faqItem.parentNode;
      faqList.removeChild(faqItem);
      updateFaqNumbers();
    });
  });
  
  // Integration method selector
  const integrationMethods = document.querySelectorAll('.integration-method');
  integrationMethods.forEach(method => {
    method.addEventListener('click', function() {
      integrationMethods.forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      
      const methodType = this.getAttribute('data-method');
      
      // Hide all details
      document.querySelectorAll('.integration-details').forEach(details => {
        details.style.display = 'none';
      });
      
      // Show selected method details
      document.getElementById(`${methodType}-details`).style.display = 'block';
    });
  });
  
  // Copy embed code button
  const copyButton = document.querySelector('.copy-button');
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      const codeBlock = document.querySelector('.code-block code');
      const textArea = document.createElement('textarea');
      textArea.value = codeBlock.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Show success message
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
      }, 2000);
    });
  }
}

/**
 * Update FAQ numbers
 */
function updateFaqNumbers() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    const number = index + 1;
    item.querySelector('h4').textContent = `FAQ #${number}`;
    
    // Update input IDs and names
    const questionInput = item.querySelector('input[id^="faq-question-"]');
    const answerInput = item.querySelector('textarea[id^="faq-answer-"]');
    const categorySelect = item.querySelector('select[id^="faq-category-"]');
    
    if (questionInput) {
      questionInput.id = `faq-question-${number}`;
      questionInput.name = `faqQuestion${number}`;
    }
    
    if (answerInput) {
      answerInput.id = `faq-answer-${number}`;
      answerInput.name = `faqAnswer${number}`;
    }
    
    if (categorySelect) {
      categorySelect.id = `faq-category-${number}`;
      categorySelect.name = `faqCategory${number}`;
    }
  });
}

/**
 * Update embed code based on configuration
 */
function updateEmbedCode() {
  const codeBlock = document.querySelector('.code-block code');
  if (!codeBlock) return;
  
  const assistantId = 'your-assistant-id';
  const position = wizardData.chatbotConfig?.position || 'bottom-right';
  const primaryColor = wizardData.chatbotConfig?.primaryColor || '#0071e3';
  
  codeBlock.textContent = `<script src="https://cdn.aiassistant.com/embed.js" data-assistant-id="${assistantId}" data-position="${position}" data-primary-color="${primaryColor}"></script>`;
}

/**
 * Initialize review section
 */
function initReviewSection() {
  // Load data from localStorage if available
  const savedData = localStorage.getItem('wizardData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      Object.assign(wizardData, parsedData);
      
      // Update review section with saved data
      if (wizardData.businessInfo.name) {
        document.getElementById('review-business-name').textContent = wizardData.businessInfo.name;
        document.getElementById('review-business-industry').textContent = getIndustryName(wizardData.businessInfo.industry);
        document.getElementById('review-business-size').textContent = getBusinessSizeName(wizardData.businessInfo.size);
        document.getElementById('review-business-website').textContent = wizardData.businessInfo.website || 'Not provided';
      }
      
      if (wizardData.chatbotConfig.name) {
        document.getElementById('review-chatbot-name').textContent = wizardData.chatbotConfig.name;
        document.getElementById('review-primary-color').style.backgroundColor = wizardData.chatbotConfig.primaryColor;
        document.getElementById('review-position').textContent = getPositionName(wizardData.chatbotConfig.position);
        document.getElementById('review-welcome-message').textContent = wizardData.chatbotConfig.welcomeMessage;
      }
      
      if (wizardData.knowledgeBase.faqs.length) {
        document.getElementById('review-faq-count').textContent = wizardData.knowledgeBase.faqs.length;
        const categories = [...new Set(wizardData.knowledgeBase.faqs.map(faq => faq.category))];
        document.getElementById('review-faq-categories').textContent = categories.map(cat => getCategoryName(cat)).join(', ') || 'None';
      }
      
      if (wizardData.integration.method) {
        document.getElementById('review-integration-method').textContent = getIntegrationMethodName(wizardData.integration.method);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }
}

/**
 * Initialize launch button
 */
function initLaunchButton() {
  const launchButton = document.getElementById('launch-button');
  if (launchButton) {
    launchButton.addEventListener('click', function() {
      // Show loading state
      this.disabled = true;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
      
      // Simulate API call
      setTimeout(() => {
        // Redirect to dashboard
        window.location.href = 'dashboard.html?setup=complete';
      }, 2000);
    });
  }
}

/**
 * Complete setup
 */
function completeSetup() {
  console.log('Setup completed!', wizardData);
  
  // Show success message
  alert('Setup completed successfully! You will be redirected to the dashboard.');
  
  // Redirect to dashboard
  window.location.href = 'dashboard.html?setup=complete';
}

/**
 * Get industry name from value
 * @param {string} value - The industry value
 * @returns {string} - The industry name
 */
function getIndustryName(value) {
  const industries = {
    'retail': 'Retail',
    'restaurant': 'Restaurant',
    'healthcare': 'Healthcare',
    'technology': 'Technology',
    'finance': 'Finance',
    'education': 'Education',
    'professional-services': 'Professional Services',
    'other': 'Other'
  };
  
  return industries[value] || value;
}

/**
 * Get business size name from value
 * @param {string} value - The business size value
 * @returns {string} - The business size name
 */
function getBusinessSizeName(value) {
  const sizes = {
    'solo': 'Solo Entrepreneur',
    'small': 'Small (2-10 employees)',
    'medium': 'Medium (11-50 employees)',
    'large': 'Large (51+ employees)'
  };
  
  return sizes[value] || value;
}

/**
 * Get position name from value
 * @param {string} value - The position value
 * @returns {string} - The position name
 */
function getPositionName(value) {
  const positions = {
    'bottom-right': 'Bottom Right',
    'bottom-left': 'Bottom Left',
    'top-right': 'Top Right',
    'top-left': 'Top Left'
  };
  
  return positions[value] || value;
}

/**
 * Get category name from value
 * @param {string} value - The category value
 * @returns {string} - The category name
 */
function getCategoryName(value) {
  const categories = {
    'general': 'General',
    'products': 'Products',
    'services': 'Services',
    'pricing': 'Pricing',
    'support': 'Support'
  };
  
  return categories[value] || value;
}

/**
 * Get integration method name from value
 * @param {string} value - The integration method value
 * @returns {string} - The integration method name
 */
function getIntegrationMethodName(value) {
  const methods = {
    'embed': 'Embed Code',
    'wordpress': 'WordPress Plugin',
    'shopify': 'Shopify App'
  };
  
  return methods[value] || value;
}
