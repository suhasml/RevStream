import React, { useEffect, useRef, useState } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';

/**
 * UserProfile
 * Renders the user profile page with tabs for personal details and booking details.
 * @returns {JSX.Element} - The UserProfile component
 * */
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access state from the previous page
  const { reservationDetails } = location.state || {}; // Get reservationDetails from the state

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  console.log('reservationDetails', reservationDetails);

  // Redirect if no reservationDetails
  useEffect(() => {
    if (!reservationDetails) {
      navigate('/login');
    }
  }, [reservationDetails, navigate]);

  return (
    <div className="container mx-auto p-4 my-10 min-h-[530px]">
      <div className="mx-4">
        <button
          ref={buttonRef}
          onClick={onTabsMenuButtonAction}
          className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FontAwesomeIcon icon={isTabsVisible ? faXmark : faBars} size="lg" />
        </button>
      </div>
      <Tabs isTabsVisible={isTabsVisible} wrapperRef={wrapperRef}>
        <TabPanel label="Personal Details" icon={faAddressCard}>
          {/* Display user's personal details if available */}
          <ProfileDetailsPanel userDetails={reservationDetails?.email} />
        </TabPanel>
        <TabPanel label="Booking Details" icon={faHotel}>
          {/* Display the reservation details */}
          <BookingPanel
            bookings={[
              {
                confirmation_code: reservationDetails?.confirmation_code,
                hotel_name: reservationDetails?.hotel_name,
                check_in: reservationDetails?.check_in,
                check_out: reservationDetails?.check_out,
                billing_address: reservationDetails?.billing_address,
                booking_date: reservationDetails?.booking_date,
                payment_status: reservationDetails?.payment_status,
              },
            ]}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default UserProfile;
