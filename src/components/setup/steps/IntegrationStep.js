/**
 * Integration Step Component
 * Fourth step of the setup wizard for integrating with external platforms
 */

import React, { useState } from 'react';
import IntegrationService from '../../../services/integrationService';

/**
 * Integration Step Component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Array} props.initialData - Initial integration data
 * @returns {JSX.Element} - Integration step component
 */
export const IntegrationStep = ({ onSubmit, initialData }) => {
  // State for integrations
  const [integrations, setIntegrations] = useState(initialData || []);
  
  // State for new integration
  const [integrationType, setIntegrationType] = useState('');
  const [integrationDetails, setIntegrationDetails] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Integration service
  const integrationService = new IntegrationService();
  
  /**
   * Handle integration type change
   * @param {Event} e - Select change event
   */
  const handleTypeChange = (e) => {
    setIntegrationType(e.target.value);
    setIntegrationDetails({});
  };
  
  /**
   * Handle integration detail change
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  const handleDetailChange = (field, value) => {
    setIntegrationDetails({
      ...integrationDetails,
      [field]: value
    });
  };
  
  /**
   * Connect to integration
   * @param {Event} e - Form event
   */
  const handleConnect = async (e) => {
    e.preventDefault();
    
    setIsConnecting(true);
    
    try {
      // Validate integration type
      if (!integrationType) {
        alert('Please select an integration type.');
        setIsConnecting(false);
        return;
      }
      
      // Connect to external source
      const success = await integrationService.connectToExternalSource(
        integrationType,
        integrationDetails
      );
      
      if (success) {
        // Create integration object
        const newIntegration = {
          id: Date.now().toString(),
          type: integrationType,
          details: { ...integrationDetails },
          connected: true,
          connectedAt: new Date()
        };
        
        // Add to integrations
        setIntegrations([...integrations, newIntegration]);
        
        // Reset form
        setIntegrationType('');
        setIntegrationDetails({});
        
        alert('Integration connected successfully!');
      } else {
        alert('Failed to connect integration. Please check your details and try again.');
      }
    } catch (error) {
      console.error('Integration error:', error);
      alert(`Error connecting integration: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };
  
  /**
   * Remove an integration
   * @param {string} id - Integration ID
   */
  const handleRemoveIntegration = (id) => {
    setIntegrations(integrations.filter(integration => integration.id !== id));
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    // Submit integrations
    onSubmit(integrations);
  };
  
  /**
   * Render integration form based on type
   * @returns {JSX.Element} - Integration form
   */
  const renderIntegrationForm = () => {
    switch (integrationType) {
      case 'website':
        return (
          <div className="integration-form">
            <div className="form-group">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                value={integrationDetails.url || ''}
                onChange={(e) => handleDetailChange('url', e.target.value)}
                placeholder="https://yourbusiness.com"
                required
                className="form-control"
              />
            </div>
          </div>
        );
        
      case 'crm':
        return (
          <div className="integration-form">
            <div className="form-group">
              <label htmlFor="crmType">CRM Platform</label>
              <select
                id="crmType"
                value={integrationDetails.crmType || ''}
                onChange={(e) => handleDetailChange('crmType', e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select CRM Platform</option>
                <option value="salesforce">Salesforce</option>
                <option value="hubspot">HubSpot</option>
                <option value="zoho">Zoho CRM</option>
                <option value="pipedrive">Pipedrive</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="apiKey">API Key</label>
              <input
                type="text"
                id="apiKey"
                value={integrationDetails.apiKey || ''}
                onChange={(e) => handleDetailChange('apiKey', e.target.value)}
                placeholder="Enter your API key"
                required
                className="form-control"
              />
            </div>
            
            {integrationDetails.crmType && (
              <div className="form-group">
                <label htmlFor="instance">Instance URL</label>
                <input
                  type="url"
                  id="instance"
                  value={integrationDetails.instanceUrl || ''}
                  onChange={(e) => handleDetailChange('instanceUrl', e.target.value)}
                  placeholder={`https://yourdomain.${integrationDetails.crmType}.com`}
                  className="form-control"
                />
              </div>
            )}
          </div>
        );
        
      case 'calendar':
        return (
          <div className="integration-form">
            <div className="form-group">
              <label htmlFor="calendarType">Calendar Platform</label>
              <select
                id="calendarType"
                value={integrationDetails.calendarType || ''}
                onChange={(e) => handleDetailChange('calendarType', e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select Calendar Platform</option>
                <option value="google">Google Calendar</option>
                <option value="outlook">Microsoft Outlook</option>
                <option value="apple">Apple Calendar</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="calendarEmail">Calendar Email</label>
              <input
                type="email"
                id="calendarEmail"
                value={integrationDetails.email || ''}
                onChange={(e) => handleDetailChange('email', e.target.value)}
                placeholder="Enter your calendar email"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="calendarAuth">Authentication</label>
              <button
                type="button"
                id="calendarAuth"
                className="btn btn-secondary"
                onClick={() => alert('In a real implementation, this would open an OAuth flow.')}
              >
                Authorize Calendar Access
              </button>
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="integration-form">
            <div className="form-group">
              <label htmlFor="emailService">Email Service</label>
              <select
                id="emailService"
                value={integrationDetails.emailService || ''}
                onChange={(e) => handleDetailChange('emailService', e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select Email Service</option>
                <option value="mailchimp">Mailchimp</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="emailApiKey">API Key</label>
              <input
                type="text"
                id="emailApiKey"
                value={integrationDetails.apiKey || ''}
                onChange={(e) => handleDetailChange('apiKey', e.target.value)}
                placeholder="Enter your API key"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromEmail">From Email</label>
              <input
                type="email"
                id="fromEmail"
                value={integrationDetails.fromEmail || ''}
                onChange={(e) => handleDetailChange('fromEmail', e.target.value)}
                placeholder="noreply@yourbusiness.com"
                className="form-control"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="integration-form">
            <p className="select-prompt">Please select an integration type to continue.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="integration-step">
      <h2>Connect External Platforms</h2>
      <p className="step-description">
        Integrate your AI assistant with your existing business tools to provide better service to your customers.
        These integrations are optional and can be set up later.
      </p>
      
      <div className="integration-content">
        <div className="add-integration">
          <h3>Add Integration</h3>
          
          <form onSubmit={handleConnect}>
            <div className="form-group">
              <label htmlFor="integrationType">Integration Type</label>
              <select
                id="integrationType"
                value={integrationType}
                onChange={handleTypeChange}
                className="form-control"
              >
                <option value="">Select Integration Type</option>
                <option value="website">Website</option>
                <option value="crm">CRM System</option>
                <option value="calendar">Calendar</option>
                <option value="email">Email Marketing</option>
              </select>
            </div>
            
            {renderIntegrationForm()}
            
            {integrationType && (
              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Integration'}
              </button>
            )}
          </form>
        </div>
        
        <div className="connected-integrations">
          <h3>Connected Integrations</h3>
          
          {integrations.length === 0 ? (
            <div className="empty-state">
              <p>No integrations connected yet. Integrations are optional and can be set up later.</p>
            </div>
          ) : (
            <div className="integrations-list">
              {integrations.map((integration) => (
                <div key={integration.id} className="integration-item">
                  <div className="integration-header">
                    <h4 className="integration-type">
                      {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} Integration
                    </h4>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveIntegration(integration.id)}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="integration-details">
                    {integration.type === 'website' && (
                      <p>Connected to: {integration.details.url}</p>
                    )}
                    
                    {integration.type === 'crm' && (
                      <p>Connected to: {integration.details.crmType} CRM</p>
                    )}
                    
                    {integration.type === 'calendar' && (
                      <p>Connected to: {integration.details.calendarType} Calendar ({integration.details.email})</p>
                    )}
                    
                    {integration.type === 'email' && (
                      <p>Connected to: {integration.details.emailService} ({integration.details.fromEmail})</p>
                    )}
                  </div>
                  
                  <div className="integration-footer">
                    <span className="integration-status">
                      <span className="status-dot"></span>
                      Connected
                    </span>
                    <span className="integration-date">
                      Connected on: {new Date(integration.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => onSubmit(initialData)}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Next: Preview
        </button>
      </div>
    </div>
  );
};
