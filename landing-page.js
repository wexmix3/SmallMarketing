/**
 * AI Customer Service Assistant
 * Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initPricingToggle();
  initTestimonialSlider();
  initFaqAccordion();
  initMobileMenu();
});

/**
 * Initialize header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Initialize pricing toggle
 */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  
  toggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('annual-pricing');
    } else {
      document.body.classList.remove('annual-pricing');
    }
  });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');
  
  let currentIndex = 0;
  
  // Hide all cards except the first one
  cards.forEach((card, index) => {
    if (index !== 0) {
      card.style.display = 'none';
    }
  });
  
  // Function to show a specific card
  function showCard(index) {
    cards.forEach((card, i) => {
      card.style.display = i === index ? 'block' : 'none';
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentIndex = index;
  }
  
  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showCard(index);
    });
  });
  
  // Event listeners for prev/next buttons
  prevButton.addEventListener('click', () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = cards.length - 1;
    }
    showCard(newIndex);
  });
  
  nextButton.addEventListener('click', () => {
    let newIndex = currentIndex + 1;
    if (newIndex >= cards.length) {
      newIndex = 0;
    }
    showCard(newIndex);
  });
  
  // Auto-rotate every 5 seconds
  setInterval(() => {
    let newIndex = currentIndex + 1;
    if (newIndex >= cards.length) {
      newIndex = 0;
    }
    showCard(newIndex);
  }, 5000);
}

/**
 * Initialize FAQ accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // Open the first FAQ item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
    });
  });
}

/**
 * Smooth scroll to anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Animation on scroll
 */
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      element.classList.add('animated');
    }
  });
}

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');
  const steps = document.querySelectorAll('.step');
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  featureCards.forEach(card => {
    card.classList.add('animate-on-scroll');
  });
  
  steps.forEach(step => {
    step.classList.add('animate-on-scroll');
  });
  
  pricingCards.forEach(card => {
    card.classList.add('animate-on-scroll');
  });
  
  // Initial check for elements in viewport
  animateOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', animateOnScroll);
});
