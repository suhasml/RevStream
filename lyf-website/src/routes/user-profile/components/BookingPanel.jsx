import { QRCodeCanvas } from 'qrcode.react'; // Import the QRCodeCanvas
import Countdown from 'react-countdown'; // Import the Countdown component

const BookingPanel = ({ bookings }) => {
  const generateQRCode = (confirmationCode) => {
    const details = {
      confirmationCode,
      // Add any other relevant details you want to embed in the QR code
    };
    return JSON.stringify(details);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {bookings.map((booking, index) => {
          const checkOutDate = new Date(booking.check_out).getTime(); // Get the checkout time

          return (
            <li key={index} className="bg-white hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-brand truncate">
                    {booking.hotel_name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Confirmation Code: {booking.confirmation_code}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex gap-x-6">
                    <p className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-1">Check-in:</span>
                      {booking.check_in}
                    </p>
                    <p className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-1">Check-out:</span>
                      {booking.check_out}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                    <p className="flex items-center">
                      <span className="font-medium">Payment Status:</span>
                      <span className="ml-2">{booking.payment_status}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-start">
                  <button
                    onClick={() => {
                      const qrCodeElement = document.getElementById(`qr-code-${index}`);
                      qrCodeElement.classList.toggle('hidden'); // Toggle visibility
                    }}
                    className="mt-2 px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition duration-150"
                  >
                    Generate Keycard
                  </button>
                  <div id={`qr-code-${index}`} className="hidden mt-2 flex flex-col items-center">
                    <QRCodeCanvas value={generateQRCode(booking.confirmation_code)} size={128} />
                    <Countdown
                      date={checkOutDate}
                      renderer={({ hours, minutes, seconds, completed }) => {
                        if (completed) {
                          return <p className="mt-2 text-sm text-red-600">QR Code has expired</p>;
                        } else {
                          return (
                            <p className="mt-2 text-sm text-gray-600">
                              QR Code expires in: {hours}h {minutes}m {seconds}s
                            </p>
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BookingPanel;
