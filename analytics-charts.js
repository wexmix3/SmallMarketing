/**
 * Advanced Analytics Charts
 * AI Customer Service Assistant Dashboard
 */

// Store chart instances for later reference
const chartInstances = {};

// Store chart data
const chartData = {
  conversations: {
    daily: [],
    weekly: [],
    monthly: []
  },
  satisfaction: {
    daily: [],
    weekly: [],
    monthly: []
  },
  topics: {
    daily: [],
    weekly: [],
    monthly: []
  },
  responseTime: {
    daily: [],
    weekly: [],
    monthly: []
  }
};

/**
 * Initialize analytics charts
 */
function initAnalyticsCharts() {
  console.log('Initializing advanced analytics charts...');

  // Load Chart.js if not already loaded
  if (typeof Chart === 'undefined') {
    loadChartJS(() => {
      createAnalyticsCharts();
      setupChartControls();
    });
  } else {
    createAnalyticsCharts();
    setupChartControls();
  }
}

/**
 * Load Chart.js dynamically
 * @param {Function} callback - Function to call when Chart.js is loaded
 */
function loadChartJS(callback) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = callback;
  document.head.appendChild(script);
}

/**
 * Create all analytics charts
 */
function createAnalyticsCharts() {
  // Generate sample data
  generateSampleData();

  // Create conversation volume chart
  createConversationVolumeChart();

  // Create user satisfaction chart
  createUserSatisfactionChart();

  // Create popular topics chart
  createPopularTopicsChart();

  // Create response time chart
  createResponseTimeChart();

  console.log('Analytics charts created');
}

/**
 * Generate sample data for charts
 */
function generateSampleData() {
  // Conversation volume data
  chartData.conversations.daily = generateDailyData(30, 20, 100);
  chartData.conversations.weekly = aggregateToWeekly(chartData.conversations.daily);
  chartData.conversations.monthly = aggregateToMonthly(chartData.conversations.daily);

  // Satisfaction data
  chartData.satisfaction.daily = [
    { label: 'Satisfied', data: generateDailyData(30, 60, 90) },
    { label: 'Neutral', data: generateDailyData(30, 5, 25) },
    { label: 'Unsatisfied', data: generateDailyData(30, 1, 15) }
  ];
  chartData.satisfaction.weekly = [
    { label: 'Satisfied', data: aggregateToWeekly(chartData.satisfaction.daily[0].data) },
    { label: 'Neutral', data: aggregateToWeekly(chartData.satisfaction.daily[1].data) },
    { label: 'Unsatisfied', data: aggregateToWeekly(chartData.satisfaction.daily[2].data) }
  ];
  chartData.satisfaction.monthly = [
    { label: 'Satisfied', data: [75, 15, 10] }
  ];

  // Popular topics data
  chartData.topics.daily = [
    { label: 'Product Info', data: 35 },
    { label: 'Pricing', data: 25 },
    { label: 'Returns', data: 20 },
    { label: 'Shipping', data: 15 },
    { label: 'Other', data: 5 }
  ];
  chartData.topics.weekly = [
    { label: 'Product Info', data: 32 },
    { label: 'Pricing', data: 28 },
    { label: 'Returns', data: 18 },
    { label: 'Shipping', data: 17 },
    { label: 'Other', data: 5 }
  ];
  chartData.topics.monthly = [
    { label: 'Product Info', data: 30 },
    { label: 'Pricing', data: 30 },
    { label: 'Returns', data: 15 },
    { label: 'Shipping', data: 20 },
    { label: 'Other', data: 5 }
  ];

  // Response time data
  chartData.responseTime.daily = generateDailyData(30, 0.8, 2.5);
  chartData.responseTime.weekly = aggregateToWeekly(chartData.responseTime.daily);
  chartData.responseTime.monthly = aggregateToMonthly(chartData.responseTime.daily);
}

/**
 * Generate daily data for a specified number of days
 * @param {number} days - Number of days to generate data for
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Array} - Array of data points
 */
function generateDailyData(days, min, max) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    data.push({
      date: date,
      value: Math.floor(Math.random() * (max - min + 1)) + min
    });
  }

  return data;
}

/**
 * Aggregate daily data to weekly
 * @param {Array} dailyData - Daily data points
 * @returns {Array} - Weekly aggregated data
 */
function aggregateToWeekly(dailyData) {
  const weeklyData = [];
  const weeks = Math.ceil(dailyData.length / 7);

  for (let i = 0; i < weeks; i++) {
    const weekStart = i * 7;
    const weekEnd = Math.min(weekStart + 7, dailyData.length);
    const weekSlice = dailyData.slice(weekStart, weekEnd);

    const sum = weekSlice.reduce((total, item) => total + item.value, 0);
    const avg = sum / weekSlice.length;

    weeklyData.push({
      date: weekSlice[0].date,
      value: Math.round(avg)
    });
  }

  return weeklyData;
}

/**
 * Aggregate daily data to monthly
 * @param {Array} dailyData - Daily data points
 * @returns {Array} - Monthly aggregated data
 */
function aggregateToMonthly(dailyData) {
  const monthlyData = [];
  const monthMap = {};

  dailyData.forEach(item => {
    const monthKey = item.date.getFullYear() + '-' + item.date.getMonth();

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        date: new Date(item.date.getFullYear(), item.date.getMonth(), 1),
        values: []
      };
    }

    monthMap[monthKey].values.push(item.value);
  });

  Object.values(monthMap).forEach(month => {
    const sum = month.values.reduce((total, value) => total + value, 0);
    const avg = sum / month.values.length;

    monthlyData.push({
      date: month.date,
      value: Math.round(avg)
    });
  });

  return monthlyData;
}

/**
 * Create conversation volume chart
 */
function createConversationVolumeChart() {
  const chartEl = document.getElementById('volume-chart');
  if (!chartEl) return;

  const ctx = chartEl.getContext('2d');
  const data = chartData.conversations.daily;

  // Prepare chart data
  const labels = data.map(item => formatDate(item.date, 'daily'));
  const values = data.map(item => item.value);

  // Create chart
  chartInstances.volume = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Conversations',
        data: values,
        backgroundColor: 'rgba(0, 113, 227, 0.8)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Conversations'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });

  console.log('Conversation volume chart created');
}

/**
 * Create user satisfaction chart
 */
function createUserSatisfactionChart() {
  const chartEl = document.getElementById('satisfaction-chart');
  if (!chartEl) return;

  const ctx = chartEl.getContext('2d');
  const data = chartData.satisfaction.monthly[0];

  // Create chart
  chartInstances.satisfaction = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Satisfied', 'Neutral', 'Unsatisfied'],
      datasets: [{
        data: data.data,
        backgroundColor: [
          'rgba(52, 199, 89, 0.8)',
          'rgba(0, 113, 227, 0.8)',
          'rgba(255, 59, 48, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${percentage}% (${value})`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  console.log('User satisfaction chart created');
}

/**
 * Create popular topics chart
 */
function createPopularTopicsChart() {
  const chartEl = document.getElementById('topics-chart');
  if (!chartEl) return;

  const ctx = chartEl.getContext('2d');
  const data = chartData.topics.monthly;

  // Prepare chart data
  const labels = data.map(item => item.label);
  const values = data.map(item => item.data);

  // Create chart
  chartInstances.topics = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(0, 113, 227, 0.8)',
          'rgba(52, 199, 89, 0.8)',
          'rgba(255, 149, 0, 0.8)',
          'rgba(88, 86, 214, 0.8)',
          'rgba(255, 59, 48, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });

  console.log('Popular topics chart created');
}

/**
 * Create response time chart
 */
function createResponseTimeChart() {
  const chartEl = document.getElementById('response-time-chart');
  if (!chartEl) return;

  const ctx = chartEl.getContext('2d');
  const data = chartData.responseTime.daily;

  // Prepare chart data
  const labels = data.map(item => formatDate(item.date, 'daily'));
  const values = data.map(item => item.value);

  // Create chart
  chartInstances.responseTime = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Response Time (seconds)',
        data: values,
        borderColor: 'rgba(88, 86, 214, 1)',
        backgroundColor: 'rgba(88, 86, 214, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `Response Time: ${context.raw.toFixed(1)}s`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Response Time (seconds)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });

  console.log('Response time chart created');
}

/**
 * Setup chart controls
 */
function setupChartControls() {
  // Date range selector
  const dateRangeLinks = document.querySelectorAll('.date-selector .dropdown-menu a');
  dateRangeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Update active state
      dateRangeLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Get selected range
      const range = this.getAttribute('data-range');

      // If custom range, show date range modal
      if (range === 'custom') {
        showModal('date-range-modal');
        return;
      }

      // Update charts
      updateChartsForDateRange(range);

      // Update date selector button text
      const button = this.closest('.date-selector').querySelector('button');
      if (button) {
        const icon1 = '<i class="far fa-calendar-alt"></i>';
        const icon2 = '<i class="fas fa-chevron-down"></i>';
        button.innerHTML = `${icon1} ${this.textContent} ${icon2}`;
      }
    });
  });

  // Custom date range modal
  const applyDateRangeBtn = document.getElementById('apply-date-range-btn');
  if (applyDateRangeBtn) {
    applyDateRangeBtn.addEventListener('click', function() {
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;

      if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
      }

      // Validate date range
      if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
      }

      // Update charts with custom date range
      updateChartsForCustomDateRange(startDate, endDate);

      // Update date selector button text
      const dateSelector = document.querySelector('.date-selector button');
      if (dateSelector) {
        const formattedStart = formatDateShort(new Date(startDate));
        const formattedEnd = formatDateShort(new Date(endDate));
        const icon1 = '<i class="far fa-calendar-alt"></i>';
        const icon2 = '<i class="fas fa-chevron-down"></i>';
        dateSelector.innerHTML = `${icon1} ${formattedStart} - ${formattedEnd} ${icon2}`;
      }

      // Close modal
      hideModal('date-range-modal');

      // Update active state in dropdown
      const customRangeLink = document.querySelector('.date-selector .dropdown-menu a[data-range="custom"]');
      if (customRangeLink) {
        document.querySelectorAll('.date-selector .dropdown-menu a').forEach(a => a.classList.remove('active'));
        customRangeLink.classList.add('active');
      }
    });
  }

  // Chart type selectors
  const chartTypeSelectors = document.querySelectorAll('.chart-type-selector');
  chartTypeSelectors.forEach(selector => {
    const buttons = selector.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Get chart ID and type
        const chartId = selector.getAttribute('data-chart');
        const chartType = this.getAttribute('data-type');

        // Update chart
        updateChartType(chartId, chartType);
      });
    });
  });
}

/**
 * Update charts for a date range
 * @param {string} range - Date range (today, yesterday, 7days, 30days, 90days, custom)
 */
function updateChartsForDateRange(range) {
  console.log(`Updating charts for range: ${range}`);

  // Show loading state
  document.querySelectorAll('.chart-container').forEach(container => {
    container.classList.add('loading');
  });

  // Determine data period based on range
  let period;
  switch (range) {
    case 'today':
    case 'yesterday':
    case '7days':
      period = 'daily';
      break;
    case '30days':
      period = 'weekly';
      break;
    case '90days':
    case 'custom':
      period = 'monthly';
      break;
    default:
      period = 'daily';
  }

  // Update conversation volume chart
  updateVolumeChart(range, period);

  // Update satisfaction chart
  updateSatisfactionChart(range, period);

  // Update topics chart
  updateTopicsChart(range, period);

  // Update response time chart
  updateResponseTimeChart(range, period);

  // Remove loading state after a delay
  setTimeout(() => {
    document.querySelectorAll('.chart-container').forEach(container => {
      container.classList.remove('loading');
    });
  }, 500);
}

/**
 * Update charts for a custom date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 */
function updateChartsForCustomDateRange(startDate, endDate) {
  console.log(`Updating charts for custom range: ${startDate} to ${endDate}`);

  // Show loading state
  document.querySelectorAll('.chart-container').forEach(container => {
    container.classList.add('loading');
  });

  // Convert string dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Determine appropriate period based on date range length
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  let period;

  if (daysDiff <= 14) {
    period = 'daily';
  } else if (daysDiff <= 90) {
    period = 'weekly';
  } else {
    period = 'monthly';
  }

  // Filter data for the custom date range
  const filteredConversationData = filterDataByCustomDateRange(chartData.conversations[period], start, end);
  const filteredResponseTimeData = filterDataByCustomDateRange(chartData.responseTime[period], start, end);

  // Update charts with filtered data
  updateChartsWithCustomData(filteredConversationData, filteredResponseTimeData, period);

  // Remove loading state after a delay
  setTimeout(() => {
    document.querySelectorAll('.chart-container').forEach(container => {
      container.classList.remove('loading');
    });
  }, 500);
}

/**
 * Filter data by custom date range
 * @param {Array} data - Data to filter
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered data
 */
function filterDataByCustomDateRange(data, startDate, endDate) {
  return data.filter(item => {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Update charts with custom data
 * @param {Array} conversationData - Filtered conversation data
 * @param {Array} responseTimeData - Filtered response time data
 * @param {string} period - Data period (daily, weekly, monthly)
 */
function updateChartsWithCustomData(conversationData, responseTimeData, period) {
  // Update volume chart
  const volumeChart = chartInstances.volume;
  if (volumeChart) {
    volumeChart.data.labels = conversationData.map(item => formatDate(item.date, period));
    volumeChart.data.datasets[0].data = conversationData.map(item => item.value);
    volumeChart.update();
  }

  // Update response time chart
  const responseTimeChart = chartInstances.responseTime;
  if (responseTimeChart) {
    responseTimeChart.data.labels = responseTimeData.map(item => formatDate(item.date, period));
    responseTimeChart.data.datasets[0].data = responseTimeData.map(item => item.value);
    responseTimeChart.update();
  }

  // For satisfaction and topics charts, we'll use the aggregated data
  // Calculate average satisfaction for the period
  const satisfactionData = [
    Math.round(Math.random() * 20 + 70), // Satisfied
    Math.round(Math.random() * 10 + 10), // Neutral
    Math.round(Math.random() * 10 + 5)   // Unsatisfied
  ];

  const satisfactionChart = chartInstances.satisfaction;
  if (satisfactionChart) {
    satisfactionChart.data.datasets[0].data = satisfactionData;
    satisfactionChart.update();
  }

  // For topics chart, we'll use random data
  const topicsData = [
    Math.round(Math.random() * 10 + 25), // Product Info
    Math.round(Math.random() * 10 + 20), // Pricing
    Math.round(Math.random() * 10 + 15), // Returns
    Math.round(Math.random() * 10 + 10), // Shipping
    Math.round(Math.random() * 5 + 5)    // Other
  ];

  const topicsChart = chartInstances.topics;
  if (topicsChart) {
    topicsChart.data.datasets[0].data = topicsData;
    topicsChart.update();
  }
}

/**
 * Format date in short format (MM/DD)
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDateShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Update volume chart for a date range
 * @param {string} range - Date range
 * @param {string} period - Data period (daily, weekly, monthly)
 */
function updateVolumeChart(range, period) {
  const chart = chartInstances.volume;
  if (!chart) return;

  // Get data for the period
  let data = chartData.conversations[period];

  // Filter data based on range
  data = filterDataByRange(data, range);

  // Update chart data
  chart.data.labels = data.map(item => formatDate(item.date, period));
  chart.data.datasets[0].data = data.map(item => item.value);

  // Update chart
  chart.update();
}

/**
 * Update satisfaction chart for a date range
 * @param {string} range - Date range
 * @param {string} period - Data period (daily, weekly, monthly)
 */
function updateSatisfactionChart(range, period) {
  const chart = chartInstances.satisfaction;
  if (!chart) return;

  // For doughnut chart, we'll use the aggregated data
  let data;

  if (period === 'monthly') {
    data = chartData.satisfaction.monthly[0].data;
  } else {
    // Calculate average satisfaction for the period
    const satisfied = calculateAverageForRange(chartData.satisfaction[period][0].data, range);
    const neutral = calculateAverageForRange(chartData.satisfaction[period][1].data, range);
    const unsatisfied = calculateAverageForRange(chartData.satisfaction[period][2].data, range);

    data = [satisfied, neutral, unsatisfied];
  }

  // Update chart data
  chart.data.datasets[0].data = data;

  // Update chart
  chart.update();
}

/**
 * Update topics chart for a date range
 * @param {string} range - Date range
 * @param {string} period - Data period (daily, weekly, monthly)
 */
function updateTopicsChart(range, period) {
  const chart = chartInstances.topics;
  if (!chart) return;

  // Get data for the period
  const data = chartData.topics[period];

  // Update chart data
  chart.data.labels = data.map(item => item.label);
  chart.data.datasets[0].data = data.map(item => item.data);

  // Update chart
  chart.update();
}

/**
 * Update response time chart for a date range
 * @param {string} range - Date range
 * @param {string} period - Data period (daily, weekly, monthly)
 */
function updateResponseTimeChart(range, period) {
  const chart = chartInstances.responseTime;
  if (!chart) return;

  // Get data for the period
  let data = chartData.responseTime[period];

  // Filter data based on range
  data = filterDataByRange(data, range);

  // Update chart data
  chart.data.labels = data.map(item => formatDate(item.date, period));
  chart.data.datasets[0].data = data.map(item => item.value);

  // Update chart
  chart.update();
}

/**
 * Update chart type
 * @param {string} chartId - Chart ID
 * @param {string} chartType - Chart type (bar, line, pie, doughnut)
 */
function updateChartType(chartId, chartType) {
  const chart = chartInstances[chartId];
  if (!chart) return;

  // Save current data
  const data = chart.data;

  // Destroy current chart
  chart.destroy();

  // Get chart element
  const chartEl = document.getElementById(`${chartId}-chart`);
  if (!chartEl) return;

  // Create new chart with the same data but different type
  const ctx = chartEl.getContext('2d');

  // Create chart options based on type
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'pie' || chartType === 'doughnut',
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };

  // Add scales for bar and line charts
  if (chartType === 'bar' || chartType === 'line') {
    options.scales = {
      y: {
        beginAtZero: true
      }
    };
  }

  // Create new chart
  chartInstances[chartId] = new Chart(ctx, {
    type: chartType,
    data: data,
    options: options
  });
}

/**
 * Filter data by date range
 * @param {Array} data - Data to filter
 * @param {string} range - Date range
 * @returns {Array} - Filtered data
 */
function filterDataByRange(data, range) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (range) {
    case 'today':
      return data.filter(item => {
        const date = new Date(item.date);
        return date.toDateString() === today.toDateString();
      });

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return data.filter(item => {
        const date = new Date(item.date);
        return date.toDateString() === yesterday.toDateString();
      });

    case '7days':
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return data.filter(item => {
        const date = new Date(item.date);
        return date >= sevenDaysAgo;
      });

    case '30days':
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return data.filter(item => {
        const date = new Date(item.date);
        return date >= thirtyDaysAgo;
      });

    case '90days':
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return data.filter(item => {
        const date = new Date(item.date);
        return date >= ninetyDaysAgo;
      });

    default:
      return data;
  }
}

/**
 * Calculate average value for a date range
 * @param {Array} data - Data to calculate average from
 * @param {string} range - Date range
 * @returns {number} - Average value
 */
function calculateAverageForRange(data, range) {
  const filteredData = filterDataByRange(data, range);

  if (filteredData.length === 0) return 0;

  const sum = filteredData.reduce((total, item) => total + item.value, 0);
  return Math.round(sum / filteredData.length);
}

/**
 * Format date based on period
 * @param {Date} date - Date to format
 * @param {string} period - Data period (daily, weekly, monthly)
 * @returns {string} - Formatted date
 */
function formatDate(date, period) {
  date = new Date(date);

  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    case 'weekly':
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    case 'monthly':
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    default:
      return date.toLocaleDateString();
  }
}

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAnalyticsCharts);
