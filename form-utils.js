/**
 * Form Validation and Submission Utilities
 * For AI Customer Service Assistant Dashboard
 */

/**
 * Validates a form based on HTML5 validation attributes
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
  // Check if the form is valid using HTML5 validation
  if (!form.checkValidity()) {
    // Trigger the browser's native validation UI
    form.reportValidity();
    return false;
  }
  
  // Additional custom validation
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach(input => {
    // Remove any existing error messages
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Reset input styling
    input.classList.remove('input-error');
    
    // Check for required fields
    if (input.hasAttribute('required') && !input.value.trim()) {
      showInputError(input, 'This field is required');
      isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        showInputError(input, 'Please enter a valid email address');
        isValid = false;
      }
    }
    
    // URL validation
    if (input.type === 'url' && input.value.trim()) {
      try {
        new URL(input.value.trim());
      } catch (e) {
        showInputError(input, 'Please enter a valid URL');
        isValid = false;
      }
    }
    
    // Phone validation
    if (input.type === 'tel' && input.value.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(input.value.trim().replace(/\s/g, ''))) {
        showInputError(input, 'Please enter a valid phone number');
        isValid = false;
      }
    }
    
    // Minimum length validation
    if (input.hasAttribute('minlength') && input.value.trim()) {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (input.value.trim().length < minLength) {
        showInputError(input, `Please enter at least ${minLength} characters`);
        isValid = false;
      }
    }
  });
  
  return isValid;
}

/**
 * Shows an error message for an input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
  // Add error class to input
  input.classList.add('input-error');
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  
  // Insert error message after input
  input.parentNode.insertBefore(errorElement, input.nextSibling);
  
  // Focus the input
  input.focus();
}

/**
 * Submits a form with AJAX
 * @param {HTMLFormElement} form - The form to submit
 * @param {string} endpoint - The endpoint to submit to (or 'mock' for demo)
 * @param {Function} successCallback - Function to call on success
 * @param {Function} errorCallback - Function to call on error
 */
function submitForm(form, endpoint, successCallback, errorCallback) {
  // For demo purposes, we'll use a mock submission
  if (endpoint === 'mock') {
    // Simulate network delay
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() < 0.9) {
        successCallback({
          success: true,
          message: 'Form submitted successfully',
          data: getFormData(form)
        });
      } else {
        errorCallback({
          success: false,
          message: 'An error occurred while submitting the form. Please try again.',
          errors: ['Server error']
        });
      }
    }, 1000);
    return;
  }
  
  // Real submission would use fetch API
  const formData = new FormData(form);
  
  fetch(endpoint, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    successCallback(data);
  })
  .catch(error => {
    errorCallback({
      success: false,
      message: 'An error occurred while submitting the form. Please try again.',
      errors: [error.message]
    });
  });
}

/**
 * Gets form data as an object
 * @param {HTMLFormElement} form - The form
 * @returns {Object} - Form data as an object
 */
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

/**
 * Saves form data to localStorage
 * @param {string} formId - The form ID
 * @param {Object} data - The form data
 */
function saveFormData(formId, data) {
  localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

/**
 * Loads form data from localStorage
 * @param {string} formId - The form ID
 * @returns {Object|null} - The form data or null if not found
 */
function loadFormData(formId) {
  const data = localStorage.getItem(`form_${formId}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Populates a form with data
 * @param {HTMLFormElement} form - The form to populate
 * @param {Object} data - The data to populate with
 */
function populateForm(form, data) {
  for (const key in data) {
    const input = form.querySelector(`[name="${key}"], #${key}`);
    if (input) {
      if (input.type === 'checkbox') {
        input.checked = data[key] === true || data[key] === 'true';
      } else if (input.type === 'radio') {
        const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
        if (radio) {
          radio.checked = true;
        }
      } else {
        input.value = data[key];
      }
    }
  }
}

/**
 * Shows a notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, error, info, warning)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Check if notification container exists, create if not
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Add icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  
  notification.innerHTML = `
    <div class="notification-icon"><i class="fas fa-${icon}"></i></div>
    <div class="notification-content">${message}</div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Add close button handler
  notification.querySelector('.notification-close').addEventListener('click', () => {
    hideNotification(notification);
  });
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto hide after duration
  if (duration > 0) {
    setTimeout(() => {
      hideNotification(notification);
    }, duration);
  }
  
  return notification;
}

/**
 * Hides a notification
 * @param {HTMLElement} notification - The notification to hide
 */
function hideNotification(notification) {
  notification.classList.remove('show');
  
  // Remove from DOM after animation
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

/**
 * Shows a loading indicator on a button
 * @param {HTMLElement} button - The button to show loading on
 * @param {boolean} isLoading - Whether to show or hide the loading state
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    // Store original text
    button.dataset.originalText = button.innerHTML;
    
    // Replace with loading spinner
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
  } else {
    // Restore original text
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    button.disabled = false;
  }
}

// Add CSS for form validation and notifications
document.addEventListener('DOMContentLoaded', () => {
  // Add CSS for form validation
  const style = document.createElement('style');
  style.textContent = `
    .input-error {
      border-color: var(--error-color, #ff3b30) !important;
      box-shadow: 0 0 0 2px rgba(255, 59, 48, 0.2) !important;
    }
    
    .form-error {
      color: var(--error-color, #ff3b30);
      font-size: 12px;
      margin-top: 4px;
    }
    
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    
    .notification {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: var(--border-radius, 4px);
      padding: 15px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transform: translateX(120%);
      transition: transform 0.3s ease;
      overflow: hidden;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }
    
    .notification-info::before {
      background-color: var(--primary-color, #0071e3);
    }
    
    .notification-success::before {
      background-color: var(--success-color, #34c759);
    }
    
    .notification-warning::before {
      background-color: var(--warning-color, #ff9500);
    }
    
    .notification-error::before {
      background-color: var(--error-color, #ff3b30);
    }
    
    .notification-icon {
      margin-right: 15px;
      font-size: 20px;
    }
    
    .notification-info .notification-icon {
      color: var(--primary-color, #0071e3);
    }
    
    .notification-success .notification-icon {
      color: var(--success-color, #34c759);
    }
    
    .notification-warning .notification-icon {
      color: var(--warning-color, #ff9500);
    }
    
    .notification-error .notification-icon {
      color: var(--error-color, #ff3b30);
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: var(--text-light, #8e8e93);
      cursor: pointer;
      padding: 5px;
      margin-left: 10px;
      transition: color 0.2s;
    }
    
    .notification-close:hover {
      color: var(--text-color, #000);
    }
  `;
  document.head.appendChild(style);
});
