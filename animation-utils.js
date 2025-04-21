/**
 * Animation Utilities
 * AI Customer Service Assistant Dashboard
 */

/**
 * Initialize animations
 */
function initAnimations() {
  console.log('Initializing animations...');
  
  // Initialize entrance animations
  initEntranceAnimations();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize hover animations
  initHoverAnimations();
  
  // Initialize click animations
  initClickAnimations();
  
  console.log('Animations initialized');
}

/**
 * Initialize entrance animations
 */
function initEntranceAnimations() {
  // Get all elements with animate class
  const animatedElements = document.querySelectorAll('.animate');
  
  // Add visible class to trigger animations
  animatedElements.forEach(element => {
    // If element has a delay, respect it
    const delay = element.style.animationDelay || '0s';
    const delayMs = parseFloat(delay) * 1000;
    
    setTimeout(() => {
      element.classList.add('visible');
    }, delayMs);
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  // Get all elements with animate-on-scroll class
  const scrollAnimatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  // Observe each element
  scrollAnimatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize hover animations
 */
function initHoverAnimations() {
  // Get all elements with animate-on-hover class
  const hoverAnimatedElements = document.querySelectorAll('.animate-on-hover');
  
  // Add event listeners
  hoverAnimatedElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const animation = this.getAttribute('data-hover-animation') || 'pulse';
      this.classList.add(animation);
    });
    
    element.addEventListener('mouseleave', function() {
      const animation = this.getAttribute('data-hover-animation') || 'pulse';
      this.classList.remove(animation);
    });
  });
}

/**
 * Initialize click animations
 */
function initClickAnimations() {
  // Get all elements with animate-on-click class
  const clickAnimatedElements = document.querySelectorAll('.animate-on-click');
  
  // Add event listeners
  clickAnimatedElements.forEach(element => {
    element.addEventListener('click', function() {
      const animation = this.getAttribute('data-click-animation') || 'pulse';
      
      // Remove animation class if it exists
      this.classList.remove(animation);
      
      // Force reflow
      void this.offsetWidth;
      
      // Add animation class
      this.classList.add(animation);
      
      // Remove animation class after animation completes
      const animationDuration = parseFloat(getComputedStyle(this).animationDuration) * 1000;
      setTimeout(() => {
        this.classList.remove(animation);
      }, animationDuration);
    });
  });
}

/**
 * Add staggered animation to elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animation - Animation class to add
 * @param {number} staggerDelay - Delay between each element in milliseconds
 * @param {number} initialDelay - Initial delay before starting animations in milliseconds
 */
function addStaggeredAnimation(selector, animation, staggerDelay = 100, initialDelay = 0) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animation);
    }, initialDelay + (index * staggerDelay));
  });
}

/**
 * Remove animation classes from elements
 * @param {string} selector - CSS selector for elements to reset
 * @param {string} animation - Animation class to remove
 */
function resetAnimations(selector, animation) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.classList.remove(animation);
  });
}

/**
 * Add typing animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds
 * @param {Function} callback - Callback function to call when typing is complete
 */
function typeText(element, text, speed = 50, callback) {
  let i = 0;
  element.textContent = '';
  element.classList.add('typing-text');
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('typing-text');
      if (callback) callback();
    }
  }
  
  type();
}

/**
 * Add counter animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} prefix - Prefix to add to the number
 * @param {string} suffix - Suffix to add to the number
 */
function animateCounter(element, start, end, duration = 1000, prefix = '', suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${end}${suffix}`;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Initialize counter animations
 */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.animate-counter');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const start = parseInt(element.getAttribute('data-start') || '0');
        const end = parseInt(element.getAttribute('data-end') || element.textContent);
        const duration = parseInt(element.getAttribute('data-duration') || '1000');
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        
        animateCounter(element, start, end, duration, prefix, suffix);
        observer.unobserve(element);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  // Observe each element
  counterElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize animations when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initAnimations();
  
  // Initialize counter animations
  initCounterAnimations();
  
  // Add animate-counter class to stat values
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(element => {
    // Extract the number from the text
    const text = element.textContent;
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    
    // Add attributes for counter animation
    element.classList.add('animate-counter');
    element.setAttribute('data-start', '0');
    element.setAttribute('data-end', number);
    element.setAttribute('data-duration', '1500');
    
    // Add prefix and suffix if needed
    if (text.includes('%')) {
      element.setAttribute('data-suffix', '%');
    }
    if (text.includes('s')) {
      element.setAttribute('data-suffix', 's');
    }
    if (text.includes(',')) {
      // Format with commas
      element.setAttribute('data-end', number);
      element.textContent = number;
    }
  });
});
