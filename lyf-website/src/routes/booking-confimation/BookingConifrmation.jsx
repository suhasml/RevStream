import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const BookingConfirmation = () => {
  const contentToPrint = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: 'Booking Confirmation',
    removeAfterPrint: true,
  });

  const handleCopyCode = async () => {
    const confirmationCode = bookingDetails?.find(detail => detail.label === 'Confirmation Code')?.value;
    if (confirmationCode) {
      await navigator.clipboard.writeText(confirmationCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  useEffect(() => {
    if (location.state) {
      const { bookingDetails } = location.state.confirmationData;
      setBookingDetails(bookingDetails);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to home
          </Link>
        </div>

        <div
          ref={contentToPrint}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Confirmed
              </h1>
              <button
                onClick={handlePrint}
                className="border p-2 min-w-[120px] transition-all delay-75 hover:bg-gray-500 hover:text-white"
              >
                Print
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-green-500 mr-2"
                />
                <p className="text-lg text-gray-700">
                  Thank you for your booking! Your reservation has been confirmed.
                </p>
              </div>
              <p className="text-gray-600">
                Please save your confirmation code for future reference.
              </p>
            </div>

            {bookingDetails && (
              <div className="border-t pt-6">
                {bookingDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b last:border-b-0"
                  >
                    <span className="font-medium text-gray-600">
                      {detail.label}
                    </span>
                    <div className="flex items-center">
                      <span className="text-gray-900">{detail.value}</span>
                      {detail.label === 'Confirmation Code' && (
                        <button
                          onClick={handleCopyCode}
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy confirmation code"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                          {copySuccess && (
                            <span className="ml-2 text-sm text-green-500">Copied!</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;