import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const BestRooms = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    guests: '',
    duration: ''
  });
  const [response, setResponse] = useState({
    bestRoom: '',
    why: ''
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8002/best-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose: formData.purpose,
          guests: parseInt(formData.guests),
          duration: parseInt(formData.duration)
        })
      });

      const data = await response.json();
      if (data) {
        setResponse({
          bestRoom: data.best_room,
          why: data.why
        });
        setIsPopupVisible(true);
      }
    } catch (error) {
      console.error('Error fetching best rooms:', error);
      setResponse({
        bestRoom: 'Sorry, there was an error processing your request. Please try again.',
        why: ''
      });
      setIsPopupVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Your Perfect Room</h2>
        <div className="space-y-4">
          {/* Purpose Input */}
          <div className="space-y-2">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose of Visit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <input
                id="purpose"
                type="text"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Enter purpose of visit"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Number of Guests Input */}
          <div className="space-y-2">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                placeholder="Enter number of guests"
                min="1"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Number of Days
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Enter number of days"
                min="1"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4" 
          onClick={() => setIsPopupVisible(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Recommended Room</h3>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Best Room:</h4>
              <p className="text-gray-700 whitespace-pre-line">{response.bestRoom}</p>
            </div>
            {response.why && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Why This Room?</h4>
                <div className="text-gray-700 prose prose-sm">
                  <ReactMarkdown>{response.why}</ReactMarkdown>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsPopupVisible(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestRooms;