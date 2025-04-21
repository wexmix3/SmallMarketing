/**
 * Completion Step Component
 * Final step of the setup wizard with deployment options
 */

import React, { useState } from 'react';
import { PricingService, PricingTier } from '../../../services/pricingService';

/**
 * Completion Step Component
 * @param {Object} props - Component props
 * @param {Object} props.businessInfo - Business information
 * @param {Array} props.integrations - Integration data
 * @returns {JSX.Element} - Completion step component
 */
export const CompletionStep = ({ businessInfo, integrations }) => {
  // State for selected tier
  const [selectedTier, setSelectedTier] = useState(PricingTier.BASIC);
  
  // State for deployment platform
  const [deploymentPlatform, setDeploymentPlatform] = useState('');
  const [deploymentCode, setDeploymentCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  
  // Pricing service
  const pricingService = new PricingService();
  
  // Get tier details
  const tiers = pricingService.getAllTierDetails();
  
  /**
   * Handle tier selection
   * @param {string} tier - Selected tier
   */
  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };
  
  /**
   * Handle deployment platform selection
   * @param {string} platform - Selected platform
   */
  const handlePlatformSelect = (platform) => {
    setDeploymentPlatform(platform);
    
    // Generate deployment code
    setIsGeneratingCode(true);
    
    // Simulate code generation
    setTimeout(() => {
      setDeploymentCode(generateDeploymentCode(platform));
      setIsGeneratingCode(false);
    }, 1000);
  };
  
  /**
   * Generate deployment code
   * @param {string} platform - Deployment platform
   * @returns {string} - Deployment code
   */
  const generateDeploymentCode = (platform) => {
    switch (platform) {
      case 'wordpress':
        return `
<!-- WordPress Plugin Shortcode -->
[ai_assistant id="your-assistant-id"]

<!-- Or add to your theme's header.php -->
<?php if (function_exists('ai_assistant_embed')) {
  ai_assistant_embed('your-assistant-id');
} ?>
        `;
        
      case 'shopify':
        return `
<!-- Shopify Theme Section -->
{% section 'ai-assistant' %}

<!-- Or add to theme.liquid -->
<script>
  window.aiAssistantConfig = {
    id: 'your-assistant-id',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.aiassistant.com/embed.js" async></script>
        `;
        
      case 'wix':
        return `
<!-- Wix Custom Element -->
<div id="ai-assistant-container"></div>

<!-- Add to your site's code -->
<script>
  import wixWindow from 'wix-window';
  
  $w.onReady(function() {
    wixWindow.renderComponent({
      compId: "ai-assistant",
      compProps: {
        id: "your-assistant-id",
        position: "bottom-right"
      }
    });
  });
</script>
        `;
        
      case 'html':
        return `
<!-- HTML Embed Code -->
<script>
  window.aiAssistantConfig = {
    id: 'your-assistant-id',
    position: 'bottom-right',
    primaryColor: '${businessInfo.customization?.primaryColor || '#0071e3'}'
  };
</script>
<script src="https://cdn.aiassistant.com/embed.js" async></script>
        `;
        
      default:
        return '';
    }
  };
  
  /**
   * Copy code to clipboard
   */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(deploymentCode.trim())
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch((error) => {
        console.error('Copy error:', error);
        alert('Failed to copy code. Please try again.');
      });
  };
  
  return (
    <div className="completion-step">
      <h2>Setup Complete!</h2>
      <p className="step-description">
        Your AI Customer Service Assistant is ready to go! Choose your subscription plan and deploy your assistant to your website.
      </p>
      
      <div className="completion-content">
        <div className="pricing-section">
          <h3>Choose Your Plan</h3>
          
          <div className="pricing-tiers">
            {Object.entries(tiers).map(([tier, details]) => (
              <div 
                key={tier}
                className={`pricing-tier ${selectedTier === tier ? 'selected' : ''}`}
                onClick={() => handleTierSelect(tier)}
              >
                <div className="tier-header">
                  <h4 className="tier-name">{details.name}</h4>
                  <div className="tier-price">
                    <span className="price">${details.price}</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                
                <div className="tier-features">
                  <ul>
                    <li>
                      <span className="feature-check">✓</span>
                      {details.maxInteractions.toLocaleString()} monthly interactions
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      {details.maxKnowledgeBaseItems.toLocaleString()} knowledge base items
                    </li>
                    <li>
                      <span className={details.features.customization ? 'feature-check' : 'feature-x'}>
                        {details.features.customization ? '✓' : '✗'}
                      </span>
                      Customization options
                    </li>
                    <li>
                      <span className={details.features.analytics ? 'feature-check' : 'feature-x'}>
                        {details.features.analytics ? '✓' : '✗'}
                      </span>
                      Basic analytics
                    </li>
                    <li>
                      <span className={details.features.multiPlatform ? 'feature-check' : 'feature-x'}>
                        {details.features.multiPlatform ? '✓' : '✗'}
                      </span>
                      Multi-platform support
                    </li>
                    <li>
                      <span className={details.features.appointmentScheduling ? 'feature-check' : 'feature-x'}>
                        {details.features.appointmentScheduling ? '✓' : '✗'}
                      </span>
                      Appointment scheduling
                    </li>
                    <li>
                      <span className={details.features.productCatalog ? 'feature-check' : 'feature-x'}>
                        {details.features.productCatalog ? '✓' : '✗'}
                      </span>
                      Product catalog integration
                    </li>
                    <li>
                      <span className={details.features.advancedAnalytics ? 'feature-check' : 'feature-x'}>
                        {details.features.advancedAnalytics ? '✓' : '✗'}
                      </span>
                      Advanced analytics
                    </li>
                  </ul>
                </div>
                
                <div className="tier-footer">
                  <button 
                    type="button" 
                    className={`btn ${selectedTier === tier ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {selectedTier === tier ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="deployment-section">
          <h3>Deploy Your Assistant</h3>
          
          <div className="platform-selector">
            <button
              type="button"
              className={`platform-button ${deploymentPlatform === 'wordpress' ? 'active' : ''}`}
              onClick={() => handlePlatformSelect('wordpress')}
            >
              WordPress
            </button>
            <button
              type="button"
              className={`platform-button ${deploymentPlatform === 'shopify' ? 'active' : ''}`}
              onClick={() => handlePlatformSelect('shopify')}
            >
              Shopify
            </button>
            <button
              type="button"
              className={`platform-button ${deploymentPlatform === 'wix' ? 'active' : ''}`}
              onClick={() => handlePlatformSelect('wix')}
            >
              Wix
            </button>
            <button
              type="button"
              className={`platform-button ${deploymentPlatform === 'html' ? 'active' : ''}`}
              onClick={() => handlePlatformSelect('html')}
            >
              HTML
            </button>
          </div>
          
          {deploymentPlatform && (
            <div className="deployment-code">
              <div className="code-header">
                <h4>Installation Code</h4>
                <button
                  type="button"
                  className="btn-copy"
                  onClick={handleCopyCode}
                >
                  Copy Code
                </button>
              </div>
              
              {isGeneratingCode ? (
                <div className="code-loading">Generating code...</div>
              ) : (
                <pre className="code-block">
                  <code>{deploymentCode}</code>
                </pre>
              )}
              
              <div className="code-instructions">
                <h5>Installation Instructions</h5>
                {deploymentPlatform === 'wordpress' && (
                  <ol>
                    <li>Install the AI Assistant WordPress plugin from the WordPress plugin directory</li>
                    <li>Activate the plugin in your WordPress admin dashboard</li>
                    <li>Go to AI Assistant settings and enter your assistant ID</li>
                    <li>Add the shortcode to any page or post where you want the assistant to appear</li>
                  </ol>
                )}
                
                {deploymentPlatform === 'shopify' && (
                  <ol>
                    <li>Go to your Shopify admin dashboard</li>
                    <li>Navigate to Online Store > Themes</li>
                    <li>Click "Actions" on your current theme and select "Edit code"</li>
                    <li>Add the code to your theme.liquid file before the closing &lt;/body&gt; tag</li>
                  </ol>
                )}
                
                {deploymentPlatform === 'wix' && (
                  <ol>
                    <li>Go to your Wix dashboard</li>
                    <li>Navigate to Settings > Custom Code</li>
                    <li>Click "Add Custom Code"</li>
                    <li>Paste the code and set it to load on all pages</li>
                    <li>Save and publish your site</li>
                  </ol>
                )}
                
                {deploymentPlatform === 'html' && (
                  <ol>
                    <li>Open your website's HTML file in a code editor</li>
                    <li>Paste the code before the closing &lt;/body&gt; tag</li>
                    <li>Save the file and upload it to your web server</li>
                    <li>The assistant will appear on your website automatically</li>
                  </ol>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="completion-actions">
        <button type="button" className="btn btn-primary">
          Activate Your Plan
        </button>
        <button type="button" className="btn btn-secondary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};
