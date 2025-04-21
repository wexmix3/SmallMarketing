/**
 * Business Info Step Component
 * First step of the setup wizard for collecting business information
 */

import React, { useState } from 'react';
import { BusinessType, BusinessTypeNames } from '../../../models/businessTypes';

/**
 * Business hours interface
 * @typedef {Object} BusinessHours
 * @property {Object} monday - Monday hours
 * @property {Object} tuesday - Tuesday hours
 * @property {Object} wednesday - Wednesday hours
 * @property {Object} thursday - Thursday hours
 * @property {Object} friday - Friday hours
 * @property {Object} saturday - Saturday hours
 * @property {Object} sunday - Sunday hours
 */

/**
 * Business Info Step Component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.initialData - Initial business data
 * @returns {JSX.Element} - Business info step component
 */
export const BusinessInfoStep = ({ onSubmit, initialData }) => {
  // State for business information
  const [businessName, setBusinessName] = useState(initialData?.name || '');
  const [businessType, setBusinessType] = useState(initialData?.type || BusinessType.OTHER);
  const [description, setDescription] = useState(initialData?.description || '');
  const [phone, setPhone] = useState(initialData?.contact?.phone || '');
  const [email, setEmail] = useState(initialData?.contact?.email || '');
  const [address, setAddress] = useState(initialData?.contact?.address || '');
  const [hours, setHours] = useState(initialData?.hours || {
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '15:00', closed: false },
    sunday: { open: '10:00', close: '15:00', closed: true }
  });
  
  /**
   * Handle hours change
   * @param {string} day - Day of the week
   * @param {string} field - Field to update
   * @param {string|boolean} value - New value
   */
  const handleHoursChange = (day, field, value) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value
      }
    });
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create business info object
    const businessInfo = {
      name: businessName,
      type: businessType,
      description,
      contact: {
        phone,
        email,
        address
      },
      hours
    };
    
    // Submit business info
    onSubmit(businessInfo);
  };
  
  return (
    <div className="business-info-step">
      <h2>Tell us about your business</h2>
      <p className="step-description">
        This information will help us set up your AI assistant with accurate information about your business.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
              className="form-control"
            >
              {Object.entries(BusinessTypeNames).map(([type, name]) => (
                <option key={type} value={type}>{name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Business Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Briefly describe what your business offers..."
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(123) 456-7890"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@yourbusiness.com"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="123 Business St, City, State 12345"
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Business Hours</h3>
          <p className="section-description">Set your regular business hours. This helps the AI assistant provide accurate information to customers.</p>
          
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
            <div key={day} className="hours-row">
              <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
              
              <div className="hours-inputs">
                <label className="closed-checkbox">
                  <input
                    type="checkbox"
                    checked={hours[day].closed}
                    onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                  />
                  Closed
                </label>
                
                {!hours[day].closed && (
                  <>
                    <div className="time-input">
                      <label htmlFor={`${day}-open`}>Open</label>
                      <input
                        type="time"
                        id={`${day}-open`}
                        value={hours[day].open}
                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                        disabled={hours[day].closed}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="time-input">
                      <label htmlFor={`${day}-close`}>Close</label>
                      <input
                        type="time"
                        id={`${day}-close`}
                        value={hours[day].close}
                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                        disabled={hours[day].closed}
                        className="form-control"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Next: Knowledge Base
          </button>
        </div>
      </form>
    </div>
  );
};
