// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { networkAdapter } from 'services/NetworkAdapter';
// import React, { useContext } from 'react';
// import { AuthContext } from 'contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import validations from 'utils/validations';
// import Toast from 'components/ux/toast/Toast';
// import { LOGIN_MESSAGES } from 'utils/constants';

// /**
//  * Login Component
//  * Renders a login form allowing users to sign in to their account.
//  * It handles user input for email and password, submits login credentials to the server,
//  * and navigates the user to their profile upon successful authentication.
//  * Displays an error message for invalid login attempts.
//  */
// const Login = () => {
//   const navigate = useNavigate();
//   const context = useContext(AuthContext);
//   const [loginData, setLoginData] = useState({
//     email: '',
//     password: '',
//   });

//   const [errorMessage, setErrorMessage] = useState(false);

//   /**
//    * Handles input changes for the login form fields.
//    * Updates the loginData state with the field values.
//    * @param {Object} e - The event object from the input field.
//    */
//   const handleInputChange = (e) => {
//     setLoginData({ ...loginData, [e.target.name]: e.target.value });
//   };

//   /**
//    * Handles the submission of the login form.
//    * Attempts to authenticate the user with the provided credentials.
//    * Navigates to the user profile on successful login or sets an error message on failure.
//    * @param {Object} e - The event object from the form submission.
//    */
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     if (validations.validate('email', loginData.email)) {
//       const response = await networkAdapter.post('api/users/login', loginData);
//       if (response && response.data.token) {
//         context.triggerAuthCheck();
//         navigate('/user-profile');
//       } else if (response && response.errors.length > 0) {
//         setErrorMessage(response.errors[0]);
//       }
//     } else {
//       setErrorMessage(LOGIN_MESSAGES.FAILED);
//     }
//   };

//   /**
//    * Clears the current error message displayed to the user.
//    */
//   const dismissError = () => {
//     setErrorMessage('');
//   };

//   return (
//     <>
//       <div className="login__form">
//         <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
//           <form
//             onSubmit={handleLoginSubmit}
//             className="w-full max-w-lg p-4 md:p-10 shadow-md"
//           >
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-extrabold text-brand">
//                 Welcome Back
//               </h2>
//               <p className="text-gray-500">
//                 Log in to continue to your account
//               </p>
//             </div>
//             <div className="mb-6">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={loginData.email}
//                 onChange={handleInputChange}
//                 autoComplete="username"
//                 className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//               />
//             </div>
//             <div className="mb-6">
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={loginData.password}
//                 onChange={handleInputChange}
//                 autoComplete="current-password"
//                 className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//               />
//             </div>
//             {errorMessage && (
//               <Toast
//                 type="error"
//                 message={errorMessage}
//                 dismissError={dismissError}
//               />
//             )}
//             <div className="items-center">
//               <div>
//                 <button
//                   type="submit"
//                   className="bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//                 >
//                   Log In
//                 </button>
//               </div>
//               <div className="flex flex-wrap justify-center my-3 w-full">
//                 <Link
//                   to="/forgot-password"
//                   className="inline-block align-baseline text-md text-gray-500 hover:text-blue-800 text-right"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <div className="absolute left-0 right-0 flex justify-center items-center">
//                   <div className="border-t w-full absolute"></div>
//                   <span className="bg-white px-3 text-gray-500 z-10">
//                     New to Stay Booker?
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-wrap justify-center my-3 w-full mt-12">
//                 <Link
//                   to="/register"
//                   className="inline-block align-baseline font-medium text-md text-brand hover:text-blue-800 text-right"
//                 >
//                   Create an account
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
    
//     </>
//   );
// };

// export default Login;

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
