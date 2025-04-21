'use client';

import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ChatbotIntegrationGuide() {
  const [businessId, setBusinessId] = useState('your-business-id');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const embedCode = `<script>
  (function(w,d,s,o,f,js,fjs){
    w['AIChatWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aichat','https://widget.example.com/loader.js'));
  
  aichat('init', '${businessId}', { theme: 'light' });
</script>`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Integration Guide</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Adding the AI Customer Service Assistant to Your Website</h2>
              
              <div className="space-y-8">
                {/* Step 1 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Step 1: Get Your Business ID</h3>
                  <p className="text-gray-600 mb-4">
                    Your Business ID is a unique identifier for your chatbot configuration. You can find it in your admin dashboard under Settings.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={businessId}
                        onChange={(e) => setBusinessId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your Business ID"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Step 2: Add the Embed Code to Your Website</h3>
                  <p className="text-gray-600 mb-4">
                    Copy the following code and paste it into your website's HTML, just before the closing <code>&lt;/body&gt;</code> tag.
                  </p>
                  <div className="bg-gray-800 text-white p-4 rounded-md relative">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      <code>{embedCode}</code>
                    </pre>
                    <CopyToClipboard text={embedCode} onCopy={handleCopy}>
                      <button className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Step 3: Customize Your Chatbot (Optional)</h3>
                  <p className="text-gray-600 mb-4">
                    You can customize the appearance and behavior of your chatbot by passing additional options to the initialization function.
                  </p>
                  <div className="bg-gray-800 text-white p-4 rounded-md">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      <code>{`aichat('init', '${businessId}', {
  theme: 'light', // or 'dark'
  position: 'right', // or 'left'
  primaryColor: '#0070f3',
  autoOpen: false, // set to true to automatically open the chat
  collectVisitorInfo: true // set to false to disable name/email collection
});`}</code>
                    </pre>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Step 4: Test Your Integration</h3>
                  <p className="text-gray-600 mb-4">
                    After adding the code to your website, refresh the page and you should see the chat widget in the bottom corner of your site.
                    Try sending a message to ensure everything is working correctly.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          If you encounter any issues with the integration, please check the browser console for errors or contact our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Integration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Integration</h3>
                  <p className="text-gray-600 mb-4">
                    For advanced use cases, you can programmatically control the chatbot using JavaScript.
                  </p>
                  <div className="bg-gray-800 text-white p-4 rounded-md">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      <code>{`// Open the chat widget
aichat('open');

// Close the chat widget
aichat('close');

// Send a message programmatically
aichat('sendMessage', 'Hello from my website!');

// Set visitor information
aichat('setVisitorInfo', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Listen for events
aichat('on', 'messageReceived', function(message) {
  console.log('New message received:', message);
});`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Need Help */}
              <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you need assistance with integrating the AI Customer Service Assistant into your website, our support team is here to help.
                </p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                    Contact Support
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none">
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
