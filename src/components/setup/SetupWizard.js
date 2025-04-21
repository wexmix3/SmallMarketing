/**
 * Setup Wizard Component
 * Main component for the business owner setup wizard
 */

import React, { useState } from 'react';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { KnowledgeBaseStep } from './steps/KnowledgeBaseStep';
import { CustomizationStep } from './steps/CustomizationStep';
import { IntegrationStep } from './steps/IntegrationStep';
import { PreviewStep } from './steps/PreviewStep';
import { CompletionStep } from './steps/CompletionStep';
import { BusinessType } from '../../models/businessTypes';

/**
 * Business information interface
 * @typedef {Object} BusinessInfo
 * @property {string} name - Business name
 * @property {string} type - Business type
 * @property {string} description - Business description
 * @property {Object} contact - Contact information
 * @property {string} contact.phone - Phone number
 * @property {string} contact.email - Email address
 * @property {string} contact.address - Physical address
 * @property {Object} hours - Business hours
 */

/**
 * Setup Wizard Component
 * @returns {JSX.Element} - Setup wizard component
 */
export const SetupWizard = () => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for business information
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    type: BusinessType.OTHER,
    description: '',
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '10:00', close: '15:00', closed: true }
    }
  });
  
  // State for knowledge base
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  
  // State for customization
  const [customization, setCustomization] = useState({
    primaryColor: '#0071e3',
    chatbotName: 'Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    logo: null
  });
  
  // State for integrations
  const [integrations, setIntegrations] = useState([]);
  
  // Navigation functions
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  
  // Step submission handlers
  const handleBusinessInfoSubmit = (info) => {
    setBusinessInfo(info);
    nextStep();
  };
  
  const handleKnowledgeBaseSubmit = (kb) => {
    setKnowledgeBase(kb);
    nextStep();
  };
  
  const handleCustomizationSubmit = (custom) => {
    setCustomization(custom);
    nextStep();
  };
  
  const handleIntegrationSubmit = (ints) => {
    setIntegrations(ints);
    nextStep();
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep 
                 onSubmit={handleBusinessInfoSubmit} 
                 initialData={businessInfo} 
               />;
      case 2:
        return <KnowledgeBaseStep 
                 onSubmit={handleKnowledgeBaseSubmit} 
                 initialData={knowledgeBase}
                 businessType={businessInfo?.type} 
               />;
      case 3:
        return <CustomizationStep 
                 onSubmit={handleCustomizationSubmit} 
                 initialData={customization} 
               />;
      case 4:
        return <IntegrationStep 
                 onSubmit={handleIntegrationSubmit} 
                 initialData={integrations} 
               />;
      case 5:
        return <PreviewStep 
                 businessInfo={businessInfo}
                 knowledgeBase={knowledgeBase}
                 customization={customization}
                 onNext={nextStep}
                 onBack={prevStep}
               />;
      case 6:
        return <CompletionStep 
                 businessInfo={businessInfo}
                 integrations={integrations}
               />;
      default:
        return <BusinessInfoStep 
                 onSubmit={handleBusinessInfoSubmit} 
                 initialData={businessInfo} 
               />;
    }
  };
  
  return (
    <div className="setup-wizard">
      <div className="setup-progress">
        <div className="steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Business Info</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Knowledge Base</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Customization</div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>Integration</div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>Preview</div>
          <div className={`step ${currentStep >= 6 ? 'active' : ''}`}>Complete</div>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(currentStep - 1) * 20}%` }}></div>
        </div>
      </div>
      
      <div className="setup-content">
        {renderStep()}
      </div>
    </div>
  );
};
