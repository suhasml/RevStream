import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import { networkAdapter } from 'services/NetworkAdapter';
import { DEFAULT_TAX_DETAILS } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { formatPrice } from 'utils/price-helpers';
import Toast from 'components/ux/toast/Toast';
import format from 'date-fns/format';

const HotelBookingDetailsCard = ({ hotelCode }) => {
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  const [selectedRoom, setSelectedRoom] = useState({
    value: 'One of a Kind (Studio)',
    label: 'One of a Kind (Studio)',
  });
  const [selectedGuests, setSelectedGuests] = useState({
    value: 2,
    label: '2 guests',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 room',
  });

  const [total, setTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({});

  const guestOptions = Array.from(
    { length: bookingDetails.maxGuestsAllowed },
    (_, i) => ({ value: i + 1, label: `${i + 1} guest` })
  );
  const roomNumberOptions = Array.from(
    { length: bookingDetails.maxRoomsAllowedPerGuest },
    (_, i) => ({ value: i + 1, label: `${i + 1} room` })
  );
  
  const roomOptions = [
    {
      value: 'One of a Kind (Studio)',
      label: 'One of a Kind (Studio)',
    },
    {
      value: 'Up and Down (Studio)',
      label: 'Up and Down (Studio)',
    },
    {
      value: 'lyf Style (Thematic Studio)',
      label: 'lyf Style (Thematic Studio)',
    },
    {
      value: 'One of a Kind Plus (Studio)',
      label: 'One of a Kind Plus (Studio)',
    },
    {
      value: 'Two of a Kind (2-Bedroom Apartment)',
      label: 'Two of a Kind (2-Bedroom Apartment)',
    },
    {
      value: 'All Together (2 Bedroom)',
      label: 'All Together (2 Bedroom)',
    },
    {
      value: 'All Together (4 Bedroom)',
      label: 'All Together (4 Bedroom)',
    },
    {
      value: 'All Together (6 Bedroom Duplex)',
      label: 'All Together (6 Bedroom Duplex)',
    }
  ];

  // Helper function to get the next room type
  const getNextRoomType = (currentRoom) => {
    const currentIndex = roomOptions.findIndex(room => room.value === currentRoom.value);
    if (currentIndex < roomOptions.length - 1) {
      return roomOptions[currentIndex + 1];
    }
    return null;
  };

  // Promotional message component
  const PromotionalMessage = ({ nextRoom }) => {
    if (!nextRoom) return null;
    
    return (
      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-700">
          <span className="font-semibold">Special Offer!</span> Upgrade to {nextRoom.label} and get 30% off! 🎉
        </p>
      </div>
    );
  };

  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
    calculatePrices();
  };
  
  const handleGuestsNumberChange = (selectedOption) => {
    setSelectedGuests(selectedOption);
  };
  
  const handleRoomsNumberChange = (selectedOption) => {
    setSelectedRooms(selectedOption);
    calculatePrices();
  };

  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  const onDateChangeHandler = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    const days =
      startDate && endDate
        ? differenceInCalendarDays(endDate, startDate) + 1
        : 1;
    setBookingPeriodDays(days);
    calculatePrices();
  };

  const calculatePrices = () => {
    const pricePerNight = bookingDetails.currentNightRate * selectedRooms.value;
    const gstRate =
      pricePerNight <= 2500 ? 0.12 : pricePerNight > 7500 ? 0.18 : 0.12;
    const totalGst = (pricePerNight * bookingPeriodDays * gstRate).toFixed(2);
    const totalPrice = (
      pricePerNight * bookingPeriodDays +
      parseFloat(totalGst)
    ).toFixed(2);
    if (!isNaN(totalPrice)) {
      setTotal(`${formatPrice(totalPrice)} INR`);
    }
    setTaxes(`${formatPrice(totalGst)} INR`);
  };

  const onBookingConfirm = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      return;
    }
    const checkIn = format(dateRange[0].startDate, 'dd-MM-yyyy');
    const checkOut = format(dateRange[0].endDate, 'dd-MM-yyyy');
    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      guests: selectedGuests.value,
      rooms: selectedRooms.value,
      hotelName: bookingDetails.name.replaceAll(' ', '-'),
    };

    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total,
        checkInTime: bookingDetails.checkInTime,
        checkOutTime: bookingDetails.checkOutTime,
      },
    });
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    calculatePrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPeriodDays, selectedRooms, selectedRoom, bookingDetails]);

  useEffect(() => {
    const getBookingDetails = async () => {
      const response = await networkAdapter.get(
        `api/hotel/${hotelCode}/booking/enquiry`
      );
      if (response && response.data) {
        setBookingDetails(response.data);
      }
    };
    getBookingDetails();
  }, [hotelCode]);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-black text-white">
        <h2 className="text-xl font-bold">Booking Details</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        {/* Total Price */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Total Price
          </div>
          <div className="text-xl font-bold text-blue-500">{total}</div>
          <div className="text-sm text-green-600">
            {bookingDetails.cancellationPolicy}
          </div>
        </div>

        {/* Dates & Time */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Dates & Time</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerIconClick={onDatePickerIconClick}
              onDateChangeHandler={onDateChangeHandler}
              setisDatePickerVisible={setisDatePickerVisible}
              dateRange={dateRange}
              inputStyle="DARK"
            />
          </div>
        </div>

        {/* Reservation */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Reservation</div>
          <Select
            value={selectedRooms}
            onChange={handleRoomsNumberChange}
            options={roomNumberOptions}
            className="mb-2"
          />
          <Select
            value={selectedGuests}
            onChange={handleGuestsNumberChange}
            options={guestOptions}
          />
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Room Type</div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
          />
          <PromotionalMessage nextRoom={getNextRoomType(selectedRoom)} />
        </div>

        {/* Per day rate */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Per day rate</div>
          <div className="text-gray-600">
            {formatPrice(bookingDetails.currentNightRate)} INR
          </div>
        </div>

        {/* Taxes */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Taxes</div>
          <div className="text-gray-600">{taxes}</div>
          <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div>
        </div>

        {errorMessage && (
          <Toast
            type="error"
            message={errorMessage}
            dismissError={dismissError}
          />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-black text-white py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;