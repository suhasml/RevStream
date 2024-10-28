import { faLocationDot, faPerson } from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import Input from 'components/ux/input/Input';

/**
 * GlobalSearchBox Component
 * Renders a search box with input fields for location, number of guests, and a date range picker.
 * It includes a search button to trigger the search based on the entered criteria.
 *
 * @param {Object} props - Props for the component.
 * @param {string} props.locationInputValue - The current value of the location input.
 * @param {string} props.numGuestsInputValue - The current value of the number of guests input.
 * @param {boolean} props.isDatePickerVisible - Flag to control the visibility of the date picker.
 * @param {Function} props.onLocationChangeInput - Callback for location input changes.
 * @param {Function} props.onNumGuestsInputChange - Callback for number of guests input changes.
 * @param {Function} props.onDatePickerIconClick - Callback for the date picker icon click event.
 * @param {Array} props.locationTypeheadResults - Results for the location input typeahead.
 * @param {Function} props.onSearchButtonAction - Callback for the search button click event.
 * @param {Function} props.onDateChangeHandler - Callback for handling date range changes.
 * @param {Function} props.setisDatePickerVisible - Callback to set the visibility state of the date picker.
 * @param {Object} props.dateRange - The selected date range.
 */
const GlobalSearchBox = (props) => {
  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    onDatePickerIconClick,
    locationTypeheadResults,
    onSearchButtonAction,
    onDateChangeHandler,
    setisDatePickerVisible,
    dateRange,
  } = props;
  return (
    <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box rounded-md flex items-center gap-4">
      
      <DateRangePicker
        isDatePickerVisible={isDatePickerVisible}
        onDatePickerIconClick={onDatePickerIconClick}
        onDateChangeHandler={onDateChangeHandler}
        setisDatePickerVisible={setisDatePickerVisible}
        dateRange={dateRange}
      />
      <Input
        size="sm"
        value={numGuestsInputValue}
        onChangeInput={onNumGuestsInputChange}
        placeholder="No. of guests"
        icon={faPerson}
        type="number"
      />
      <button
        className="w-full md:w-auto bg-brand rounded-md hover:bg-yellow-600 px-4 py-2 text-white"
        onClick={onSearchButtonAction}
      >
        SEARCH
      </button>
    </div>
  );
};

export default GlobalSearchBox;

// import { faPerson } from '@fortawesome/free-solid-svg-icons';
// import Input from 'components/ux/input/Input';
// import { useState } from 'react';

// /**
//  * GlobalSearchBox Component
//  * Renders a search box with input fields for the purpose of visit and number of guests.
//  * Includes a search button to trigger the search and displays the best rooms in a popup.
//  *
//  * @param {Object} props - Props for the component.
//  * @param {string} props.numGuestsInputValue - The current value of the number of guests input.
//  * @param {Function} props.onNumGuestsInputChange - Callback for number of guests input changes.
//  * @param {Function} props.onSearchButtonAction - Callback for the search button click event.
//  */
// const GlobalSearchBox = (props) => {
//   const {
//     numGuestsInputValue,
//     onNumGuestsInputChange,
//     onSearchButtonAction,
//   } = props;

//   // State to manage the selected purpose of visit
//   const [purposeInputValue, setPurposeInputValue] = useState('leisure');

//   // State to manage the best rooms data and popup visibility
//   const [bestRoomsData, setBestRoomsData] = useState(null);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const handleSearch = async () => {
//     try {
//       // Trigger the search action and make an API call
//       const response = await onSearchButtonAction({
//         purpose: purposeInputValue,
//         numGuests: numGuestsInputValue,
//       });

//       if (response) {
//         setBestRoomsData(response.rooms);
//         setIsPopupVisible(true);  // Show popup if data is returned
//       }
//     } catch (error) {
//       console.error('Error fetching best rooms:', error);
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box">
        
//         {/* Dropdown for Purpose of Visit */}
//         <div className="w-full md:w-auto mb-4 md:mb-0">
//           <label htmlFor="purpose">Purpose of Visit:</label>
//           <select
//             id="purpose"
//             value={purposeInputValue}
//             onChange={(e) => setPurposeInputValue(e.target.value)}
//             className="p-2 my-4 border rounded-md"
//           >
//             <option value="leisure">Leisure</option>
//             <option value="business">Business</option>
//             <option value="romantic">Romantic Getaway</option>
//           </select>
//         </div>

//         {/* Number of Guests Input */}
//         <Input
//           size="sm"
//           value={numGuestsInputValue}
//           onChangeInput={onNumGuestsInputChange}
//           placeholder="No. of guests"
//           icon={faPerson}
//           type="number"
//         />

//         {/* Search Button */}
//         <button
//           className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 px-4 py-2 text-white"
//           onClick={handleSearch}
//         >
//           SEARCH
//         </button>
//       </div>

//       {/* Popup for displaying best rooms */}
//       {isPopupVisible && bestRoomsData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-md shadow-md w-1/2">
//             <h3 className="text-xl font-bold mb-4">Best Rooms for You</h3>
//             <ul>
//               {bestRoomsData.map((room) => (
//                 <li key={room.id} className="my-2">
//                   <strong>Room:</strong> {room.name} <br />
//                   <strong>Price:</strong> ${room.price} <br />
//                   <strong>Description:</strong> {room.description}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setIsPopupVisible(false)}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GlobalSearchBox;
