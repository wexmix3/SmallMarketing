'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Industry options
const industries = [
  'Food & Beverage',
  'Retail',
  'Professional Services',
  'Health & Wellness',
  'Beauty & Personal Care',
  'Home Services',
  'Automotive',
  'Education',
  'Entertainment',
  'Other',
];

export default function BusinessProfilePage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  
  const { createBusiness, isLoading, error } = useAuth();
  const router = useRouter();

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!businessName || !industry || !location) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    try {
      await createBusiness({
        name: businessName,
        industry,
        location,
        // In a real app, you would upload the logo to a storage service
        // and save the URL in the business profile
        logo: logoPreview || undefined,
      });
      
      router.push('/onboarding/target-audience');
    } catch (err) {
      console.error('Business profile creation error:', err);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (step === 1) {
      if (!businessName || !industry || !location) {
        setFormError('Please fill in all required fields');
        return;
      }
      setFormError('');
      setStep(2);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your business profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about your business to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <div className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Basic Info
                </div>
              </div>
              <div className={`flex-1 mx-4 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <div className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                  Additional Info
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="business-name"
                      name="business-name"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="industry"
                      name="industry"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="">Select an industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      placeholder="City, State"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {formError && (
                  <div className="text-red-500 text-sm text-center">
                    {formError}
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about your business..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogo(null);
                            setLogoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <label
                          htmlFor="logo-upload"
                          className="relative text-sm font-medium text-blue-600 pointer-events-none"
                        >
                          <span>Upload a file</span>
                          <span className="sr-only"> logo</span>
                        </label>
                        <input
                          id="logo-upload"
                          name="logo-upload"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {(formError || error) && (
                  <div className="text-red-500 text-sm text-center">
                    {formError || error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create Profile'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
