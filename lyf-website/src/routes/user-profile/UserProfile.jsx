import React, { useEffect, useRef, useState } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { useNavigate, useLocation } from 'react-router-dom';
import BookingPanel from './components/BookingPanel';
import LoginNavbar from 'components/login-navbar/LoginNavbar';

/**
 * UserProfile
 * Renders the user profile page with tabs for personal details and booking details.
 * @returns {JSX.Element} - The UserProfile component
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationDetails } = location.state || {}; // Safely destructure reservationDetails

  const wrapperRef = useRef();
  const buttonRef = useRef();
  const [isTabsVisible, setIsTabsVisible] = useState(false);

  useOutsideClickHandler(wrapperRef, (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible((prev) => !prev);
  };

  // Redirect if no reservationDetails
  useEffect(() => {
    if (!reservationDetails) {
      navigate('/login');
    }
  }, [reservationDetails, navigate]);

  return (
    <>
      <LoginNavbar />
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
          <TabPanel label="Booking Details" icon={faHotel}>
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
          <TabPanel label="Profile Details">
            {/* Uncomment this line when you have the ProfileDetailsPanel ready */}
            {/* <ProfileDetailsPanel userDetails={reservationDetails?.email} /> */}
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfile;
