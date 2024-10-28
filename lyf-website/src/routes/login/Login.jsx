import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from 'components/ux/toast/Toast';

const ReservationLookup = () => {
  const navigate = useNavigate();
  const [lookupData, setLookupData] = useState({
    email: '',
    reservation_id: ''  // Use reservation_id to match the backend field name
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLookupData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    if (!lookupData.email.trim()) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (!lookupData.reservation_id.trim()) {
      setErrorMessage('Please enter your reservation ID');
      return false;
    }

    return true;
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8002/get-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: lookupData.email,
          reservation_id: lookupData.reservation_id  // Use reservation_id for the backend
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to booking details page with the fetched data
        navigate('/user-profile', {
          state: {
            reservationDetails: data  // Directly use data as returned by FastAPI
          }
        });
      } else {
        throw new Error(data.detail || 'Reservation not found');  // Use FastAPI's "detail" key for error messages
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to find your reservation. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  return (
    <div className="login__form">
      <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
        <form onSubmit={handleLookupSubmit} className="w-full max-w-lg p-4 md:p-10 shadow-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand">
              Find Your Reservation
            </h2>
            <p className="text-gray-500">
              Enter your email and reservation ID to view your booking details
            </p>
          </div>

          <div className="mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={lookupData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
          </div>

          <div className="mb-6">
            <input
              type="text"
              name="reservation_id"  // Adjust the input field name to reservation_id
              placeholder="Reservation ID"
              value={lookupData.reservation_id}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
          </div>

          {errorMessage && (
            <Toast
              type="error"
              message={errorMessage}
              dismissError={dismissError}
            />
          )}

          <div className="items-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Looking up...
                </>
              ) : (
                'Find Reservation'
              )}
            </button>
          </div>

          <div className="flex flex-wrap justify-center mt-6">
            <p className="text-gray-500">
              Need help?{' '}
              <a href="/support" className="text-brand hover:text-blue-700 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationLookup;