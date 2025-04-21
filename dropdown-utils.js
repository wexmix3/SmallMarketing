/**
 * Dropdown Utilities for AI Customer Service Assistant Dashboard
 * Provides consistent dropdown functionality across the dashboard
 */

/**
 * Initialize all dropdowns on the page
 */
function initDropdowns() {
  console.log('Initializing dropdowns...');
  
  // Initialize date selector dropdowns
  initDateSelectors();
  
  // Initialize card action dropdowns
  initCardActionDropdowns();
  
  // Add global click handler to close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      // Check if click is outside the dropdown and its toggle
      const toggle = dropdown.previousElementSibling;
      if (!dropdown.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
        dropdown.classList.remove('show');
      }
    });
  });
  
  console.log('Dropdowns initialized');
}

/**
 * Initialize date selector dropdowns
 */
function initDateSelectors() {
  const dateSelectors = document.querySelectorAll('.date-selector');
  console.log(`Found ${dateSelectors.length} date selectors`);
  
  dateSelectors.forEach(selector => {
    const toggle = selector.querySelector('button');
    const dropdown = selector.querySelector('.dropdown-menu');
    
    if (!toggle || !dropdown) return;
    
    // Add click handler to toggle
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    
    // Add click handlers to dropdown items
    const items = dropdown.querySelectorAll('a');
    items.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Update toggle text
        const range = this.textContent.trim();
        const icon = toggle.querySelector('i.fa-calendar-alt');
        const chevron = toggle.querySelector('i.fa-chevron-down');
        
        // Preserve icons when updating text
        toggle.innerHTML = '';
        if (icon) toggle.appendChild(icon.cloneNode(true));
        toggle.appendChild(document.createTextNode(' ' + range + ' '));
        if (chevron) toggle.appendChild(chevron.cloneNode(true));
        
        // Hide dropdown
        dropdown.classList.remove('show');
        
        // Update charts with new date range
        const rangeValue = this.getAttribute('data-range');
        updateChartsForDateRange(rangeValue);
      });
    });
  });
}

/**
 * Initialize card action dropdowns
 */
function initCardActionDropdowns() {
  const cardActions = document.querySelectorAll('.card-actions');
  console.log(`Found ${cardActions.length} card action dropdowns`);
  
  cardActions.forEach(actions => {
    const toggle = actions.querySelector('.btn-icon');
    const dropdown = actions.querySelector('.dropdown-menu');
    
    if (!toggle || !dropdown) return;
    
    // Add click handler to toggle
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    
    // Add click handlers to dropdown items
    const items = dropdown.querySelectorAll('a');
    items.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get action from text or data attribute
        const action = this.getAttribute('data-action') || this.textContent.trim();
        
        // Handle different actions
        if (action.includes('Export')) {
          handleExportAction(this);
        } else if (action.includes('Refresh')) {
          handleRefreshAction(this);
        } else if (action.includes('Settings')) {
          handleSettingsAction(this);
        }
        
        // Hide dropdown
        dropdown.classList.remove('show');
      });
    });
  });
}

/**
 * Update charts for a new date range
 * @param {string} range - The date range (today, yesterday, 7days, 30days, 90days, custom)
 */
function updateChartsForDateRange(range) {
  console.log(`Updating charts for date range: ${range}`);
  
  // Show loading state on charts
  const chartContainers = document.querySelectorAll('.card-content');
  chartContainers.forEach(container => {
    container.classList.add('loading');
  });
  
  // Simulate API call delay
  setTimeout(() => {
    // Update conversation chart
    updateConversationChart(range);
    
    // Update other charts
    updateSatisfactionChart(range);
    updateVolumeChart(range);
    
    // Remove loading state
    chartContainers.forEach(container => {
      container.classList.remove('loading');
    });
    
    // Show notification
    showNotification(`Charts updated for ${getReadableDateRange(range)}`, 'success');
  }, 1000);
}

/**
 * Get readable date range text
 * @param {string} range - The date range code
 * @returns {string} - Human readable date range
 */
function getReadableDateRange(range) {
  switch (range) {
    case 'today': return 'Today';
    case 'yesterday': return 'Yesterday';
    case '7days': return 'Last 7 Days';
    case '30days': return 'Last 30 Days';
    case '90days': return 'Last 90 Days';
    case 'custom': return 'Custom Range';
    default: return 'Last 30 Days';
  }
}

/**
 * Handle export action
 * @param {HTMLElement} element - The clicked element
 */
function handleExportAction(element) {
  // Get the card title to determine what to export
  const card = element.closest('.dashboard-card');
  const title = card ? card.querySelector('.card-header h3').textContent : 'Data';
  
  console.log(`Exporting ${title}...`);
  
  // Show notification
  showNotification(`Exporting ${title}...`, 'info');
  
  // Simulate export delay
  setTimeout(() => {
    showNotification(`${title} exported successfully!`, 'success');
  }, 1500);
}

/**
 * Handle refresh action
 * @param {HTMLElement} element - The clicked element
 */
function handleRefreshAction(element) {
  // Get the card to refresh
  const card = element.closest('.dashboard-card');
  const content = card ? card.querySelector('.card-content') : null;
  
  if (!content) return;
  
  // Show loading state
  content.classList.add('loading');
  
  // Simulate refresh delay
  setTimeout(() => {
    // Remove loading state
    content.classList.remove('loading');
    
    // Show notification
    showNotification('Data refreshed successfully!', 'success');
  }, 1500);
}

/**
 * Handle settings action
 * @param {HTMLElement} element - The clicked element
 */
function handleSettingsAction(element) {
  // Get the card title to determine what settings to show
  const card = element.closest('.dashboard-card');
  const title = card ? card.querySelector('.card-header h3').textContent : 'Chart';
  
  console.log(`Opening settings for ${title}...`);
  
  // Show notification
  showNotification(`${title} settings will be available in a future update.`, 'info');
}

/**
 * Update conversation chart for a date range
 * @param {string} range - The date range
 */
function updateConversationChart(range) {
  const chart = Chart.getChart('conversation-chart');
  if (!chart) return;
  
  // Generate data based on range
  const { labels, data } = generateChartData(range);
  
  // Update chart data
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

/**
 * Update satisfaction chart for a date range
 * @param {string} range - The date range
 */
function updateSatisfactionChart(range) {
  const chart = Chart.getChart('satisfaction-chart');
  if (!chart) return;
  
  // Generate data based on range
  let data;
  switch (range) {
    case 'today':
      data = [80, 15, 5];
      break;
    case 'yesterday':
      data = [70, 20, 10];
      break;
    case '7days':
      data = [75, 15, 10];
      break;
    case '30days':
      data = [78, 12, 10];
      break;
    case '90days':
      data = [82, 10, 8];
      break;
    default:
      data = [75, 15, 10];
  }
  
  // Update chart data
  chart.data.datasets[0].data = data;
  chart.update();
}

/**
 * Update volume chart for a date range
 * @param {string} range - The date range
 */
function updateVolumeChart(range) {
  const chart = Chart.getChart('volume-chart');
  if (!chart) return;
  
  // Generate data based on range
  const { labels, data } = generateChartData(range);
  
  // Update chart data
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

/**
 * Generate chart data for a date range
 * @param {string} range - The date range
 * @returns {Object} - Labels and data for the chart
 */
function generateChartData(range) {
  let labels = [];
  let data = [];
  
  const today = new Date();
  
  switch (range) {
    case 'today':
      // Hourly data for today
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        data.push(Math.floor(Math.random() * 10) + 1);
      }
      break;
      
    case 'yesterday':
      // Hourly data for yesterday
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        data.push(Math.floor(Math.random() * 8) + 1);
      }
      break;
      
    case '7days':
      // Daily data for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        data.push(Math.floor(Math.random() * 50) + 10);
      }
      break;
      
    case '30days':
      // Weekly data for last 30 days
      for (let i = 0; i < 4; i++) {
        labels.push(`Week ${i + 1}`);
        data.push(Math.floor(Math.random() * 200) + 50);
      }
      break;
      
    case '90days':
      // Monthly data for last 90 days
      for (let i = 2; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        data.push(Math.floor(Math.random() * 500) + 100);
      }
      break;
      
    default:
      // Default to 30 days
      for (let i = 0; i < 4; i++) {
        labels.push(`Week ${i + 1}`);
        data.push(Math.floor(Math.random() * 200) + 50);
      }
  }
  
  return { labels, data };
}

// Initialize dropdowns when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDropdowns);
