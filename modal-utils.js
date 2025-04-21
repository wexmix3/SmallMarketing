/**
 * Modal Utilities for AI Customer Service Assistant Dashboard
 * Provides consistent modal functionality across the dashboard
 */

// Store currently open modal
let currentOpenModal = null;

// Store the element that had focus before the modal was opened
let previouslyFocusedElement = null;

/**
 * Initialize all modals on the page
 */
function initModals() {
  console.log('Initializing modals...');

  // Get all modals
  const modals = document.querySelectorAll('.modal');
  console.log(`Found ${modals.length} modals`);

  // Initialize each modal
  modals.forEach(modal => {
    initModal(modal);
  });

  // Add event listeners to modal triggers
  initModalTriggers();
}

/**
 * Initialize a single modal
 * @param {HTMLElement} modal - The modal element
 */
function initModal(modal) {
  const modalId = modal.id;
  console.log(`Initializing modal: ${modalId}`);

  // Set initial display to none
  modal.style.display = 'none';

  // Add close button event listeners
  const closeButtons = modal.querySelectorAll('.close-modal, [data-dismiss="modal"]');
  closeButtons.forEach(button => {
    // Remove inline onclick attribute
    if (button.hasAttribute('onclick')) {
      button.removeAttribute('onclick');
    }

    // Add event listener
    button.addEventListener('click', () => {
      hideModal(modalId);
    });
  });

  // Add click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal(modalId);
    }
  });

  // Mark as initialized
  modal.setAttribute('data-initialized', 'true');

  console.log(`Modal ${modalId} initialized`);
}

/**
 * Initialize all modal triggers
 */
function initModalTriggers() {
  // Get all elements with data-modal attribute
  const triggers = document.querySelectorAll('[data-modal]');
  console.log(`Found ${triggers.length} modal triggers`);

  // Add click event listeners
  triggers.forEach(trigger => {
    const modalId = trigger.getAttribute('data-modal');

    // Remove inline onclick if it exists
    if (trigger.hasAttribute('onclick')) {
      trigger.removeAttribute('onclick');
    }

    // Add event listener
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      showModal(modalId);
    });

    console.log(`Trigger for modal ${modalId} initialized`);
  });

  // Special case for Add FAQ button
  const addFaqButton = document.querySelector('.btn-primary[onclick*="showModal(\'add-faq-modal\')"]');
  if (addFaqButton) {
    addFaqButton.removeAttribute('onclick');
    addFaqButton.setAttribute('data-modal', 'add-faq-modal');
    addFaqButton.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('add-faq-modal');
    });
    console.log('Add FAQ button initialized');
  }

  // Special case for Get Embed Code button
  const getEmbedCodeButton = document.querySelector('.action-card[href="#"][data-tooltip*="embed"]');
  if (getEmbedCodeButton) {
    getEmbedCodeButton.setAttribute('data-modal', 'embed-code-modal');
    getEmbedCodeButton.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('embed-code-modal');
    });
    console.log('Get Embed Code button initialized');
  }

  // Special case for Configure Bot button
  const configureBotButton = document.querySelector('.action-card[href="#"][data-tooltip*="Configure"]');
  if (configureBotButton) {
    configureBotButton.setAttribute('data-modal', 'customize-modal');
    configureBotButton.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('customize-modal');
    });
    console.log('Configure Bot button initialized');
  }

  // Special case for Customize button in checklist
  const customizeButton = document.querySelector('.btn-outline[onclick*="showModal(\'customize-modal\')"]');
  if (customizeButton) {
    customizeButton.removeAttribute('onclick');
    customizeButton.setAttribute('data-modal', 'customize-modal');
    customizeButton.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('customize-modal');
    });
    console.log('Customize button initialized');
  }

  // Special case for Install button in checklist
  const installButton = document.querySelector('.btn-outline[data-tooltip*="installation code"]');
  if (installButton) {
    installButton.setAttribute('data-modal', 'embed-code-modal');
    installButton.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('embed-code-modal');
    });
    console.log('Install button initialized');
  }
}

/**
 * Show a modal
 * @param {string} modalId - The ID of the modal to show
 */
function showModal(modalId) {
  console.log(`Showing modal: ${modalId}`);

  // Hide any currently open modal
  if (currentOpenModal) {
    hideModal(currentOpenModal);
  }

  // Get the modal
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal not found: ${modalId}`);
    return;
  }

  // Store the currently focused element
  previouslyFocusedElement = document.activeElement;

  // Show the modal
  modal.style.display = 'flex';

  // Add the show class after a small delay for animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Set focus to the first focusable element
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Add keyboard event listener
  document.addEventListener('keydown', handleModalKeydown);

  // Store the current open modal
  currentOpenModal = modalId;

  // Prevent body scrolling
  document.body.style.overflow = 'hidden';

  // Dispatch modal open event
  const event = new CustomEvent('modalOpen', { detail: { modalId } });
  document.dispatchEvent(event);

  console.log(`Modal ${modalId} shown`);
}

/**
 * Hide a modal
 * @param {string} modalId - The ID of the modal to hide
 */
function hideModal(modalId) {
  console.log(`Hiding modal: ${modalId}`);

  // Get the modal
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal not found: ${modalId}`);
    return;
  }

  // Remove the show class
  modal.classList.remove('show');

  // Hide the modal after animation completes
  setTimeout(() => {
    modal.style.display = 'none';

    // Reset form if it's a form modal
    const form = modal.querySelector('form');
    if (form) {
      form.reset();

      // Remove any editing ID
      if (form.hasAttribute('data-editing-faq-id')) {
        form.removeAttribute('data-editing-faq-id');
      }

      // Reset save button text if it's the FAQ form
      if (form.id === 'add-faq-form') {
        const saveButton = document.getElementById('save-faq-btn');
        if (saveButton) {
          saveButton.textContent = 'Save FAQ';
        }
      }

      // Remove error messages
      const errorMessages = form.querySelectorAll('.form-error');
      errorMessages.forEach(error => error.remove());

      // Remove error styling
      const errorInputs = form.querySelectorAll('.input-error');
      errorInputs.forEach(input => input.classList.remove('input-error'));
    }

    // Restore focus to the previously focused element
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
      previouslyFocusedElement = null;
    }

    // Remove keyboard event listener
    document.removeEventListener('keydown', handleModalKeydown);

    // Clear current open modal
    if (currentOpenModal === modalId) {
      currentOpenModal = null;
    }

    // Restore body scrolling
    document.body.style.overflow = '';

    // Dispatch modal close event
    const event = new CustomEvent('modalClose', { detail: { modalId } });
    document.dispatchEvent(event);
  }, 300);

  console.log(`Modal ${modalId} hidden`);
}

/**
 * Handle keyboard events for modals
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleModalKeydown(e) {
  // Close modal on Escape key
  if (e.key === 'Escape' && currentOpenModal) {
    hideModal(currentOpenModal);
  }

  // Trap focus within modal
  if (e.key === 'Tab' && currentOpenModal) {
    const modal = document.getElementById(currentOpenModal);
    if (!modal) return;

    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If shift+tab and focus is on first element, move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // If tab and focus is on last element, move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}

// Expose functions globally
window.showModal = showModal;
window.hideModal = hideModal;
window.initModals = initModals;

// Initialize modals when the DOM is loaded
document.addEventListener('DOMContentLoaded', initModals);
