/**
 * Table Action Utilities for AI Customer Service Assistant Dashboard
 * Provides functionality for table action buttons
 */

/**
 * Initialize all table actions
 */
function initTableActions() {
  console.log('Initializing table actions...');
  
  // Initialize conversation view buttons
  initConversationViewButtons();
  
  // Initialize FAQ action buttons
  initFAQActionButtons();
  
  // Initialize view all buttons
  initViewAllButtons();
  
  console.log('Table actions initialized');
}

/**
 * Initialize conversation view buttons
 */
function initConversationViewButtons() {
  const viewButtons = document.querySelectorAll('.recent-conversations .btn-icon[data-tooltip*="View conversation"]');
  console.log(`Found ${viewButtons.length} conversation view buttons`);
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get conversation details from the row
      const row = this.closest('tr');
      const userName = row.querySelector('.user-name').textContent;
      const userEmail = row.querySelector('.user-email').textContent;
      const time = row.querySelector('td:nth-child(2)').textContent;
      const duration = row.querySelector('td:nth-child(3)').textContent;
      const questions = row.querySelector('td:nth-child(4)').textContent;
      const status = row.querySelector('.status').textContent;
      
      // Create conversation details modal content
      const modalContent = `
        <div class="modal-header">
          <h3>Conversation with ${userName}</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="conversation-details">
            <div class="user-info-large">
              <div class="user-avatar">${userName.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h4>${userName}</h4>
                <p>${userEmail}</p>
              </div>
            </div>
            
            <div class="conversation-meta">
              <div class="meta-item">
                <div class="meta-label">Time</div>
                <div class="meta-value">${time}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Duration</div>
                <div class="meta-value">${duration}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Questions</div>
                <div class="meta-value">${questions}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Status</div>
                <div class="meta-value"><span class="status ${status.toLowerCase()}">${status}</span></div>
              </div>
            </div>
            
            <h4>Conversation History</h4>
            <div class="conversation-history">
              <div class="chat-message user">
                <div class="message-content">
                  <p>Hello, I'm having trouble finding your return policy. Can you help?</p>
                </div>
                <div class="message-time">2 minutes ago</div>
              </div>
              <div class="chat-message bot">
                <div class="message-content">
                  <p>Hi there! I'd be happy to help you with our return policy. You can return any unused item within 30 days of purchase for a full refund. Would you like me to provide more details about the return process?</p>
                </div>
                <div class="message-time">1 minute ago</div>
              </div>
              <div class="chat-message user">
                <div class="message-content">
                  <p>Yes, please. Do I need the original packaging?</p>
                </div>
                <div class="message-time">1 minute ago</div>
              </div>
              <div class="chat-message bot">
                <div class="message-content">
                  <p>While we prefer items to be returned in their original packaging, it's not strictly required. However, the item should be in its original condition. You'll need your order number or receipt for the return process. Would you like to know how to initiate a return?</p>
                </div>
                <div class="message-time">Just now</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" data-dismiss="modal">Close</button>
          <button class="btn-primary">Download Transcript</button>
        </div>
      `;
      
      // Create modal element
      const modal = document.createElement('div');
      modal.id = 'conversation-details-modal';
      modal.className = 'modal';
      modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;
      
      // Add modal to the document
      document.body.appendChild(modal);
      
      // Show the modal
      showModal('conversation-details-modal');
      
      // Add event listener for download transcript button
      const downloadButton = modal.querySelector('.btn-primary');
      downloadButton.addEventListener('click', function() {
        showNotification('Downloading conversation transcript...', 'info');
        setTimeout(() => {
          showNotification('Transcript downloaded successfully!', 'success');
        }, 1500);
      });
      
      // Add event listener to remove modal when closed
      modal.addEventListener('modalClose', function() {
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      });
    });
  });
}

/**
 * Initialize FAQ action buttons
 */
function initFAQActionButtons() {
  // Edit buttons are handled by the form-handlers.js
  // Delete buttons are handled by the form-handlers.js
  
  // Initialize import/export buttons
  const importButton = document.querySelector('#knowledge-base .btn-outline:nth-child(1)');
  const exportButton = document.querySelector('#knowledge-base .btn-outline:nth-child(2)');
  
  if (importButton) {
    importButton.addEventListener('click', function() {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json,.csv';
      fileInput.style.display = 'none';
      
      // Add to document and trigger click
      document.body.appendChild(fileInput);
      fileInput.click();
      
      // Handle file selection
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          showNotification(`Importing FAQs from ${file.name}...`, 'info');
          
          // Simulate import process
          setTimeout(() => {
            showNotification('FAQs imported successfully!', 'success');
            
            // Add some dummy FAQs to the list
            const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');
            
            // Add new FAQs
            faqs.push({
              id: Date.now(),
              question: 'Do you offer international shipping?',
              answer: 'Yes, we offer international shipping to most countries. Shipping rates vary by location.',
              category: 'Shipping',
              createdAt: new Date().toISOString()
            });
            
            faqs.push({
              id: Date.now() + 1,
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
              category: 'Payments',
              createdAt: new Date().toISOString()
            });
            
            // Save to localStorage
            localStorage.setItem('faqs', JSON.stringify(faqs));
            
            // Refresh the FAQ list
            if (typeof refreshFAQList === 'function') {
              refreshFAQList();
            }
          }, 2000);
        }
        
        // Remove the file input
        document.body.removeChild(fileInput);
      });
    });
  }
  
  if (exportButton) {
    exportButton.addEventListener('click', function() {
      showNotification('Exporting FAQs...', 'info');
      
      // Get FAQs from localStorage
      const faqs = JSON.parse(localStorage.getItem('faqs') || '[]');
      
      // Simulate export process
      setTimeout(() => {
        showNotification('FAQs exported successfully!', 'success');
        
        // In a real application, this would trigger a file download
        console.log('Exported FAQs:', faqs);
      }, 1500);
    });
  }
}

/**
 * Initialize view all buttons
 */
function initViewAllButtons() {
  const viewAllButtons = document.querySelectorAll('.btn-outline[data-tooltip*="View all"]');
  console.log(`Found ${viewAllButtons.length} view all buttons`);
  
  viewAllButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Determine which section to navigate to based on the button's context
      const card = this.closest('.dashboard-card');
      const cardTitle = card ? card.querySelector('.card-header h3').textContent : '';
      
      if (cardTitle.includes('Conversation')) {
        // Navigate to conversations section
        const conversationsLink = document.querySelector('.sidebar-nav a[data-target="conversations"]');
        if (conversationsLink) {
          conversationsLink.click();
        }
      } else if (cardTitle.includes('Question')) {
        // Navigate to knowledge base section
        const knowledgeBaseLink = document.querySelector('.sidebar-nav a[data-target="knowledge-base"]');
        if (knowledgeBaseLink) {
          knowledgeBaseLink.click();
        }
      } else if (cardTitle.includes('Analytics')) {
        // Navigate to analytics section
        const analyticsLink = document.querySelector('.sidebar-nav a[data-target="analytics"]');
        if (analyticsLink) {
          analyticsLink.click();
        }
      }
    });
  });
}

/**
 * Add CSS for conversation details modal
 */
function addConversationDetailsStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .conversation-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .user-info-large {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info-large .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 500;
    }
    
    .user-info-large h4 {
      margin: 0 0 5px 0;
    }
    
    .user-info-large p {
      margin: 0;
      color: var(--text-light);
    }
    
    .conversation-meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 15px;
      background-color: var(--background-light);
      padding: 15px;
      border-radius: var(--border-radius);
    }
    
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .meta-label {
      font-size: 12px;
      color: var(--text-light);
    }
    
    .meta-value {
      font-weight: 500;
    }
    
    .conversation-history {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;
      background-color: var(--background-light);
      border-radius: var(--border-radius);
    }
    
    .chat-message {
      display: flex;
      flex-direction: column;
      max-width: 80%;
    }
    
    .chat-message.user {
      align-self: flex-end;
    }
    
    .chat-message.bot {
      align-self: flex-start;
    }
    
    .message-content {
      padding: 10px 15px;
      border-radius: 18px;
      background-color: var(--primary-color);
      color: white;
    }
    
    .chat-message.user .message-content {
      background-color: var(--primary-color);
    }
    
    .chat-message.bot .message-content {
      background-color: #f1f1f1;
      color: var(--text-color);
    }
    
    .message-content p {
      margin: 0;
    }
    
    .message-time {
      font-size: 12px;
      color: var(--text-light);
      margin-top: 5px;
      align-self: flex-end;
    }
    
    .chat-message.bot .message-time {
      align-self: flex-start;
    }
  `;
  
  document.head.appendChild(style);
}

// Add conversation details styles when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addConversationDetailsStyles();
  initTableActions();
});
