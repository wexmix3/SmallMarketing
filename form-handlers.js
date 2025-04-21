/**
 * Form Handlers for AI Customer Service Assistant Dashboard
 * Handles form validation and submission for all dashboard forms
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all form handlers
  initAddFAQForm();
  initAccountSettingsForm();
  initNotificationSettingsForm();
  initSupportForm();
  initCustomizationForm();

  // Load saved form data from localStorage
  loadSavedFormData();
});

/**
 * Initialize the Add FAQ form
 */
function initAddFAQForm() {
  const form = document.getElementById('add-faq-form');
  const saveButton = document.getElementById('save-faq-btn');

  if (!form || !saveButton) return;

  saveButton.addEventListener('click', function() {
    if (validateForm(form)) {
      // Show loading state
      setButtonLoading(saveButton, true);

      // Submit the form
      submitForm(form, 'mock', function(response) {
        // Success callback
        setButtonLoading(saveButton, false);
        showNotification('FAQ added successfully!', 'success');

        // Save to localStorage
        const formData = getFormData(form);
        const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');
        faqs.push({
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('faqs', JSON.stringify(faqs));

        // Reset form
        form.reset();

        // Hide modal
        hideModal('add-faq-modal');

        // Refresh FAQ list if on the knowledge base page
        if (document.querySelector('#knowledge-base.active')) {
          refreshFAQList();
        }
      }, function(error) {
        // Error callback
        setButtonLoading(saveButton, false);
        showNotification(error.message, 'error');
      });
    }
  });
}

/**
 * Initialize the Account Settings form
 */
function initAccountSettingsForm() {
  const form = document.getElementById('account-settings-form');
  const saveButton = document.getElementById('save-account-settings');

  if (!form || !saveButton) return;

  saveButton.addEventListener('click', function() {
    if (validateForm(form)) {
      // Show loading state
      setButtonLoading(saveButton, true);

      // Submit the form
      submitForm(form, 'mock', function(response) {
        // Success callback
        setButtonLoading(saveButton, false);
        showNotification('Account settings saved successfully!', 'success');

        // Save to localStorage
        const formData = getFormData(form);
        saveFormData('account-settings', formData);
      }, function(error) {
        // Error callback
        setButtonLoading(saveButton, false);
        showNotification(error.message, 'error');
      });
    }
  });
}

/**
 * Initialize the Notification Settings form
 */
function initNotificationSettingsForm() {
  const form = document.getElementById('notification-settings-form');
  const saveButton = document.getElementById('save-notification-settings');

  if (!form || !saveButton) return;

  saveButton.addEventListener('click', function() {
    if (validateForm(form)) {
      // Show loading state
      setButtonLoading(saveButton, true);

      // Submit the form
      submitForm(form, 'mock', function(response) {
        // Success callback
        setButtonLoading(saveButton, false);
        showNotification('Notification settings saved successfully!', 'success');

        // Save to localStorage
        const formData = getFormData(form);
        saveFormData('notification-settings', formData);
      }, function(error) {
        // Error callback
        setButtonLoading(saveButton, false);
        showNotification(error.message, 'error');
      });
    }
  });
}

/**
 * Initialize the Support form
 */
function initSupportForm() {
  const form = document.getElementById('support-form');
  const submitButton = document.getElementById('submit-support-ticket');

  if (!form || !submitButton) return;

  submitButton.addEventListener('click', function() {
    if (validateForm(form)) {
      // Show loading state
      setButtonLoading(submitButton, true);

      // Submit the form
      submitForm(form, 'mock', function(response) {
        // Success callback
        setButtonLoading(submitButton, false);
        showNotification('Support ticket submitted successfully! We\'ll get back to you soon.', 'success');

        // Reset form
        form.reset();
      }, function(error) {
        // Error callback
        setButtonLoading(submitButton, false);
        showNotification(error.message, 'error');
      });
    }
  });
}

/**
 * Initialize the Customization form
 */
function initCustomizationForm() {
  const saveButton = document.getElementById('save-customization-btn');

  if (!saveButton) return;

  saveButton.addEventListener('click', function() {
    // Get all tab contents
    const tabContents = document.querySelectorAll('#customize-modal .tab-content');
    let isValid = true;

    // Validate each tab content
    tabContents.forEach(tabContent => {
      const inputs = tabContent.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          // Show the tab containing the invalid input
          const tabId = tabContent.getAttribute('data-tab');
          const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
          if (tab) {
            // Activate the tab
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            tabContent.classList.add('active');
          }

          // Show error
          showInputError(input, 'This field is required');
          isValid = false;
          input.focus();
        }
      });
    });

    if (isValid) {
      // Show loading state
      setButtonLoading(saveButton, true);

      // Collect data from all tabs
      const formData = {};

      // Appearance tab
      formData.botName = document.getElementById('bot-name').value;
      formData.botLogo = document.getElementById('bot-logo').value;
      formData.primaryColor = document.querySelector('.color-option.active').getAttribute('data-color');
      formData.position = document.querySelector('.tab[data-position].active').getAttribute('data-position');

      // Behavior tab
      formData.greetingDelay = document.getElementById('greeting-delay').value;
      formData.autoOpen = document.getElementById('auto-open').checked;
      formData.showAvatar = document.getElementById('show-avatar').checked;
      formData.saveHistory = document.getElementById('save-history').checked;
      formData.afterHours = document.getElementById('after-hours').value;

      // Messages tab
      formData.welcomeMessage = document.getElementById('welcome-message').value;
      formData.offlineMessage = document.getElementById('offline-message').value;
      formData.fallbackMessage = document.getElementById('fallback-message').value;

      // Save to localStorage
      localStorage.setItem('chatbot-settings', JSON.stringify(formData));

      // Show success message
      setTimeout(() => {
        setButtonLoading(saveButton, false);
        showNotification('Chatbot settings saved successfully!', 'success');
        hideModal('customize-modal');
      }, 1000);
    }
  });

  // Handle color picker
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle position tabs
  const positionTabs = document.querySelectorAll('.tab[data-position]');
  positionTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      positionTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle content tabs
  const contentTabs = document.querySelectorAll('.tab[data-tab]');
  contentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');

      // Update active tab
      contentTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update active content
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('data-tab') === tabId) {
          content.classList.add('active');
        }
      });
    });
  });
}

/**
 * Load saved form data from localStorage
 */
function loadSavedFormData() {
  // Load account settings
  const accountSettings = loadFormData('account-settings');
  if (accountSettings) {
    const form = document.getElementById('account-settings-form');
    if (form) {
      populateForm(form, accountSettings);
    }
  }

  // Load notification settings
  const notificationSettings = loadFormData('notification-settings');
  if (notificationSettings) {
    const form = document.getElementById('notification-settings-form');
    if (form) {
      populateForm(form, notificationSettings);
    }
  }

  // Load chatbot settings
  const chatbotSettings = localStorage.getItem('chatbot-settings');
  if (chatbotSettings) {
    try {
      const settings = JSON.parse(chatbotSettings);

      // Appearance tab
      if (document.getElementById('bot-name')) {
        document.getElementById('bot-name').value = settings.botName || '';
      }
      if (document.getElementById('bot-logo')) {
        document.getElementById('bot-logo').value = settings.botLogo || '';
      }

      // Set active color
      if (settings.primaryColor) {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
          option.classList.remove('active');
          if (option.getAttribute('data-color') === settings.primaryColor) {
            option.classList.add('active');
          }
        });
      }

      // Set active position
      if (settings.position) {
        const positionTabs = document.querySelectorAll('.tab[data-position]');
        positionTabs.forEach(tab => {
          tab.classList.remove('active');
          if (tab.getAttribute('data-position') === settings.position) {
            tab.classList.add('active');
          }
        });
      }

      // Behavior tab
      if (document.getElementById('greeting-delay')) {
        document.getElementById('greeting-delay').value = settings.greetingDelay || '5';
      }
      if (document.getElementById('auto-open')) {
        document.getElementById('auto-open').checked = settings.autoOpen !== false;
      }
      if (document.getElementById('show-avatar')) {
        document.getElementById('show-avatar').checked = settings.showAvatar !== false;
      }
      if (document.getElementById('save-history')) {
        document.getElementById('save-history').checked = settings.saveHistory !== false;
      }
      if (document.getElementById('after-hours')) {
        document.getElementById('after-hours').value = settings.afterHours || 'online';
      }

      // Messages tab
      if (document.getElementById('welcome-message')) {
        document.getElementById('welcome-message').value = settings.welcomeMessage || '';
      }
      if (document.getElementById('offline-message')) {
        document.getElementById('offline-message').value = settings.offlineMessage || '';
      }
      if (document.getElementById('fallback-message')) {
        document.getElementById('fallback-message').value = settings.fallbackMessage || '';
      }
    } catch (e) {
      console.error('Error loading chatbot settings:', e);
    }
  }
}

/**
 * Refresh the FAQ list in the knowledge base section
 */
function refreshFAQList() {
  const faqTable = document.querySelector('#knowledge-base .data-table tbody');
  if (!faqTable) return;

  // Get FAQs from localStorage
  const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');

  // Clear existing rows
  faqTable.innerHTML = '';

  // Add FAQs to table
  faqs.forEach(faq => {
    const row = document.createElement('tr');

    // Format date
    const date = new Date(faq.createdAt);
    const timeAgo = getTimeAgo(date);

    row.innerHTML = `
      <td>${faq.question}</td>
      <td>${faq.category}</td>
      <td>${timeAgo}</td>
      <td>
        <button class="btn-icon" data-tooltip="Edit FAQ" data-faq-id="${faq.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-icon" data-tooltip="Delete FAQ" data-faq-id="${faq.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;

    faqTable.appendChild(row);
  });

  // Add event listeners to edit and delete buttons
  const editButtons = faqTable.querySelectorAll('.btn-icon[data-tooltip="Edit FAQ"]');
  const deleteButtons = faqTable.querySelectorAll('.btn-icon[data-tooltip="Delete FAQ"]');

  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const faqId = this.getAttribute('data-faq-id');
      editFAQ(faqId);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const faqId = this.getAttribute('data-faq-id');
      deleteFAQ(faqId);
    });
  });
}

/**
 * Edit an FAQ
 * @param {string} faqId - The ID of the FAQ to edit
 */
function editFAQ(faqId) {
  // Get FAQs from localStorage
  const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');
  const faq = faqs.find(f => f.id.toString() === faqId);

  if (!faq) return;

  // Populate form
  const form = document.getElementById('add-faq-form');
  if (form) {
    form.querySelector('#faq-question').value = faq.question;
    form.querySelector('#faq-answer').value = faq.answer;
    form.querySelector('#faq-category').value = faq.category;

    // Store the FAQ ID for updating
    form.setAttribute('data-editing-faq-id', faqId);

    // Change button text
    const saveButton = document.getElementById('save-faq-btn');
    if (saveButton) {
      saveButton.textContent = 'Update FAQ';
    }

    // Show modal
    showModal('add-faq-modal');
  }
}

/**
 * Delete an FAQ
 * @param {string} faqId - The ID of the FAQ to delete
 */
function deleteFAQ(faqId) {
  // Confirm deletion
  if (confirm('Are you sure you want to delete this FAQ?')) {
    // Get FAQs from localStorage
    const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');
    const updatedFaqs = faqs.filter(f => f.id.toString() !== faqId);

    // Save updated FAQs
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs));

    // Refresh FAQ list
    refreshFAQList();

    // Show notification
    showNotification('FAQ deleted successfully!', 'success');
  }
}

/**
 * Show a modal - using the modal-utils.js implementation
 * @param {string} modalId - The ID of the modal to show
 */
function showModal(modalId) {
  // This function is now provided by modal-utils.js
  // We're keeping this function as a wrapper for backward compatibility
  if (typeof window.showModal === 'function') {
    window.showModal(modalId);
  } else {
    console.error('Modal utilities not loaded. Please include modal-utils.js');
  }
}

/**
 * Hide a modal - using the modal-utils.js implementation
 * @param {string} modalId - The ID of the modal to hide
 */
function hideModal(modalId) {
  // This function is now provided by modal-utils.js
  // We're keeping this function as a wrapper for backward compatibility
  if (typeof window.hideModal === 'function') {
    window.hideModal(modalId);
  } else {
    console.error('Modal utilities not loaded. Please include modal-utils.js');
  }
}

/**
 * Get time ago string from date
 * @param {Date} date - The date
 * @returns {string} - Time ago string
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return `${Math.floor(diffDay / 30)} months ago`;
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}
