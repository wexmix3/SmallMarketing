// UAT Dashboard JavaScript

// Test case data
const testCases = [
    { id: 'BF-01', name: 'Open Chat and Send a Message', category: 'Basic Functionality', status: 'pending', tester: '', severity: '' },
    { id: 'BF-02', name: 'Minimize and Maximize Chat', category: 'Basic Functionality', status: 'pending', tester: '', severity: '' },
    { id: 'BF-03', name: 'Close Chat and Reopen', category: 'Basic Functionality', status: 'pending', tester: '', severity: '' },
    { id: 'BF-04', name: 'Send Multiple Messages', category: 'Basic Functionality', status: 'pending', tester: '', severity: '' },
    { id: 'BF-05', name: 'Test All UI Controls', category: 'Basic Functionality', status: 'pending', tester: '', severity: '' },
    
    { id: 'FH-01', name: 'Upload a Single Image', category: 'File Handling', status: 'pending', tester: '', severity: '' },
    { id: 'FH-02', name: 'Upload Multiple Files', category: 'File Handling', status: 'pending', tester: '', severity: '' },
    { id: 'FH-03', name: 'Upload a Large File', category: 'File Handling', status: 'pending', tester: '', severity: '' },
    { id: 'FH-04', name: 'Upload Different File Types', category: 'File Handling', status: 'pending', tester: '', severity: '' },
    { id: 'FH-05', name: 'Upload File and Continue Conversation', category: 'File Handling', status: 'pending', tester: '', severity: '' },
    
    { id: 'CF-01', name: 'Ask About Business Hours', category: 'Conversation Flow', status: 'pending', tester: '', severity: '' },
    { id: 'CF-02', name: 'Ask About Shipping', category: 'Conversation Flow', status: 'pending', tester: '', severity: '' },
    { id: 'CF-03', name: 'Ask About Products', category: 'Conversation Flow', status: 'pending', tester: '', severity: '' },
    { id: 'CF-04', name: 'Ask About Order Issues', category: 'Conversation Flow', status: 'pending', tester: '', severity: '' },
    { id: 'CF-05', name: 'Test Conversation with Mixed Topics', category: 'Conversation Flow', status: 'pending', tester: '', severity: '' },
    
    { id: 'FS-01', name: 'Upload Image and Ask About It', category: 'File-Specific Conversations', status: 'pending', tester: '', severity: '' },
    { id: 'FS-02', name: 'Upload Document and Ask for Summary', category: 'File-Specific Conversations', status: 'pending', tester: '', severity: '' },
    { id: 'FS-03', name: 'Upload Multiple Files and Ask About Them', category: 'File-Specific Conversations', status: 'pending', tester: '', severity: '' },
    { id: 'FS-04', name: 'Upload File and Switch Topics', category: 'File-Specific Conversations', status: 'pending', tester: '', severity: '' },
    { id: 'FS-05', name: 'Test Suggested Actions After File Upload', category: 'File-Specific Conversations', status: 'pending', tester: '', severity: '' },
    
    { id: 'PR-01', name: 'Long Conversation Test', category: 'Performance and Reliability', status: 'pending', tester: '', severity: '' },
    { id: 'PR-02', name: 'Multiple File Uploads', category: 'Performance and Reliability', status: 'pending', tester: '', severity: '' },
    { id: 'PR-03', name: 'Rapid Message Sending', category: 'Performance and Reliability', status: 'pending', tester: '', severity: '' },
    { id: 'PR-04', name: 'Test on Slow Connection', category: 'Performance and Reliability', status: 'pending', tester: '', severity: '' },
    { id: 'PR-05', name: 'Test After Browser Refresh', category: 'Performance and Reliability', status: 'pending', tester: '', severity: '' }
];

// DOM Elements
const totalTestsElement = document.getElementById('totalTests');
const completedTestsElement = document.getElementById('completedTests');
const passedTestsElement = document.getElementById('passedTests');
const failedTestsElement = document.getElementById('failedTests');
const progressBarElement = document.getElementById('progressBar');
const testCasesTableBody = document.getElementById('testCasesTableBody');
const categoryFilterElement = document.getElementById('categoryFilter');
const statusFilterElement = document.getElementById('statusFilter');
const searchInputElement = document.getElementById('searchInput');
const lastUpdatedElement = document.getElementById('lastUpdated');

// Initialize dashboard
function initializeDashboard() {
    // Load test results from localStorage
    loadTestResults();
    
    // Update summary
    updateSummary();
    
    // Render test cases
    renderTestCases();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set last updated time
    lastUpdatedElement.textContent = new Date().toLocaleString();
    
    // Set up auto-refresh
    setInterval(() => {
        loadTestResults();
        updateSummary();
        renderTestCases();
        lastUpdatedElement.textContent = new Date().toLocaleString();
    }, 30000); // Refresh every 30 seconds
}

// Load test results from localStorage
function loadTestResults() {
    // In a real implementation, this would load from a server
    // For now, we'll simulate by checking localStorage for any test results
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith('uat-test-result-')) {
            try {
                const result = JSON.parse(localStorage.getItem(key));
                const testCaseId = result.testCase;
                
                // Find the test case and update its status
                const testCase = testCases.find(tc => tc.id === testCaseId);
                if (testCase) {
                    testCase.status = result.result.toLowerCase();
                    testCase.tester = 'Test User'; // In a real implementation, this would be the actual tester
                    testCase.severity = result.severity || '';
                    testCase.notes = result.notes || '';
                    testCase.timestamp = result.timestamp;
                }
            } catch (error) {
                console.error('Error parsing test result:', error);
            }
        }
    }
}

// Update summary statistics
function updateSummary() {
    const total = testCases.length;
    const completed = testCases.filter(tc => tc.status === 'pass' || tc.status === 'fail').length;
    const passed = testCases.filter(tc => tc.status === 'pass').length;
    const failed = testCases.filter(tc => tc.status === 'fail').length;
    
    totalTestsElement.textContent = total;
    completedTestsElement.textContent = completed;
    passedTestsElement.textContent = passed;
    failedTestsElement.textContent = failed;
    
    // Update progress bar
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    progressBarElement.style.width = `${progressPercentage}%`;
    
    // Change progress bar color based on pass/fail ratio
    if (completed > 0) {
        const passRatio = passed / completed;
        if (passRatio >= 0.9) {
            progressBarElement.style.backgroundColor = 'var(--success-color)';
        } else if (passRatio >= 0.7) {
            progressBarElement.style.backgroundColor = 'var(--warning-color)';
        } else {
            progressBarElement.style.backgroundColor = 'var(--error-color)';
        }
    }
}

// Render test cases table
function renderTestCases() {
    // Clear table body
    testCasesTableBody.innerHTML = '';
    
    // Get filter values
    const categoryFilter = categoryFilterElement.value;
    const statusFilter = statusFilterElement.value;
    const searchFilter = searchInputElement.value.toLowerCase();
    
    // Filter test cases
    const filteredTestCases = testCases.filter(tc => {
        // Category filter
        if (categoryFilter !== 'all' && !tc.id.startsWith(categoryFilter)) {
            return false;
        }
        
        // Status filter
        if (statusFilter !== 'all' && tc.status !== statusFilter) {
            return false;
        }
        
        // Search filter
        if (searchFilter && !tc.id.toLowerCase().includes(searchFilter) && 
            !tc.name.toLowerCase().includes(searchFilter)) {
            return false;
        }
        
        return true;
    });
    
    // Render filtered test cases
    filteredTestCases.forEach(tc => {
        const row = document.createElement('tr');
        
        // Create test case link
        const testCaseLink = document.createElement('a');
        testCaseLink.href = `integrated-chatbot-uat.html?testCase=${tc.id}`;
        testCaseLink.textContent = tc.id;
        testCaseLink.target = '_blank';
        
        // Create status badge
        const statusBadge = document.createElement('span');
        statusBadge.classList.add('status-badge', `status-${tc.status}`);
        statusBadge.textContent = tc.status.charAt(0).toUpperCase() + tc.status.slice(1);
        
        // Create severity badge if applicable
        const severityBadge = document.createElement('span');
        if (tc.severity) {
            severityBadge.classList.add('status-badge', `severity-${tc.severity.toLowerCase()}`);
            severityBadge.textContent = tc.severity;
        }
        
        // Create action buttons
        const viewButton = document.createElement('button');
        viewButton.classList.add('action-button');
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', () => {
            window.open(`integrated-chatbot-uat.html?testCase=${tc.id}`, '_blank');
        });
        
        // Populate row
        row.innerHTML = `
            <td>${testCaseLink.outerHTML}</td>
            <td>${tc.name}</td>
            <td>${tc.category}</td>
            <td>${tc.tester || '-'}</td>
            <td>${statusBadge.outerHTML}</td>
            <td>${tc.severity ? severityBadge.outerHTML : '-'}</td>
            <td>${viewButton.outerHTML}</td>
        `;
        
        testCasesTableBody.appendChild(row);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Filter change events
    categoryFilterElement.addEventListener('change', renderTestCases);
    statusFilterElement.addEventListener('change', renderTestCases);
    
    // Search input event
    searchInputElement.addEventListener('input', renderTestCases);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
