'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Age range options
const ageRanges = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

// Interest options
const interestOptions = [
  'Food & Dining',
  'Shopping',
  'Health & Fitness',
  'Beauty & Self-care',
  'Home & Garden',
  'Travel',
  'Entertainment',
  'Technology',
  'Sports',
  'Family & Parenting',
  'Education',
  'Business & Finance',
];

export default function TargetAudiencePage() {
  const [serviceArea, setServiceArea] = useState('');
  const [serviceRadius, setServiceRadius] = useState('5');
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // Handle age range selection
  const handleAgeRangeToggle = (ageRange: string) => {
    if (selectedAgeRanges.includes(ageRange)) {
      setSelectedAgeRanges(selectedAgeRanges.filter(range => range !== ageRange));
    } else {
      setSelectedAgeRanges([...selectedAgeRanges, ageRange]);
    }
  };

  // Handle gender selection
  const handleGenderToggle = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!serviceArea) {
      setFormError('Please enter your service area');
      return;
    }
    
    if (selectedAgeRanges.length === 0) {
      setFormError('Please select at least one age range');
      return;
    }
    
    if (selectedGenders.length === 0) {
      setFormError('Please select at least one gender');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would save this data to your backend
      // For now, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo purposes
      localStorage.setItem('targetAudience', JSON.stringify({
        serviceArea,
        serviceRadius,
        ageRanges: selectedAgeRanges,
        genders: selectedGenders,
        interests: selectedInterests,
      }));
      
      router.push('/onboarding/connect-channels');
    } catch (err) {
      console.error('Target audience error:', err);
      setFormError('Failed to save target audience data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Define your target audience
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Help us understand who your customers are
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="service-area" className="block text-sm font-medium text-gray-700">
                Service Area <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="service-area"
                  name="service-area"
                  type="text"
                  required
                  placeholder="City, State or ZIP code"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="service-radius" className="block text-sm font-medium text-gray-700">
                Service Radius (miles)
              </label>
              <div className="mt-1">
                <input
                  id="service-radius"
                  name="service-radius"
                  type="range"
                  min="1"
                  max="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(e.target.value)}
                />
                <div className="text-center mt-2 text-sm text-gray-600">
                  {serviceRadius} miles
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Ranges <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ageRanges.map((ageRange) => (
                  <button
                    key={ageRange}
                    type="button"
                    onClick={() => handleAgeRangeToggle(ageRange)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      selectedAgeRanges.includes(ageRange)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {ageRange}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleGenderToggle(gender)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      selectedGenders.includes(gender)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      selectedInterests.includes(interest)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {formError && (
              <div className="text-red-500 text-sm text-center">
                {formError}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
