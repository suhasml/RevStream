// import React, { useState, useEffect } from 'react';
// import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
// import axios from 'axios';

// const PartnerEventsTable = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         // Get the session ID from localStorage or generate a new one if it doesn't exist
//         let sessionId = localStorage.getItem('sessionId');
//         if (!sessionId) {
//           sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
//           localStorage.setItem('sessionId', sessionId);
//         }

//         const response = await axios.post('http://localhost:8002/partner-events', {
//           session_id: sessionId
//         });
//         setEvents(response.data.events);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch events. Please try again later.');
//         setLoading(false);
//         console.error('Error fetching events:', err);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <CCard className="mb-4">
//       <CCardHeader>
//         <h4 className="mb-0">Upcoming Partner Events</h4>
//       </CCardHeader>
//       <CCardBody>
//         <CTable hover responsive align="middle" className="mb-0 border">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell>Partner</CTableHeaderCell>
//               <CTableHeaderCell>Event</CTableHeaderCell>
//               <CTableHeaderCell>Description</CTableHeaderCell>
//               <CTableHeaderCell>Why this event?</CTableHeaderCell>
//               <CTableHeaderCell>Date</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {events.map((event, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{event.partner}</CTableDataCell>
//                 <CTableDataCell>{event.event}</CTableDataCell>
//                 <CTableDataCell>{event.description}</CTableDataCell>
//                 <CTableDataCell>{event.why}</CTableDataCell>
//                 <CTableDataCell>{event.date}</CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//       </CCardBody>
//     </CCard>
//   );
// };

// export default PartnerEventsTable;

import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CFormSelect  } from '@coreui/react';
import axios from 'axios';

const PartnerEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('lastWeek'); // Default to 'lastWeek'

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('sessionId', sessionId);
        }

        // Create a cache key that includes the time range
        const cacheKey = `partnerEvents_${timeRange}`;
        const cachedEvents = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const cacheDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

        if (cachedEvents && cacheTimestamp && Date.now() - cacheTimestamp < cacheDuration) {
          // Use cached data if valid
          setEvents(JSON.parse(cachedEvents));
          setLoading(false);
        } else {
          // Make the API call and update the cache
          const response = await axios.post('http://localhost:8002/partner-events', {
            session_id: sessionId,
            time_range: timeRange, // Pass the selected time range to the API
          });
          setEvents(response.data.events);
          setLoading(false);

          // Cache the data and timestamp
          localStorage.setItem(cacheKey, JSON.stringify(response.data.events));
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
        }
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, [timeRange]); // Re-fetch data when the time range changes

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value); // Update time range based on user selection
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4 className="mb-0">Upcoming Partner Events</h4>
      
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Partner</CTableHeaderCell>
              <CTableHeaderCell>Event</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Why this event?</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {events.map((event, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{event.partner}</CTableDataCell>
                <CTableDataCell>{event.event}</CTableDataCell>
                <CTableDataCell>{event.description}</CTableDataCell>
                <CTableDataCell>{event.why}</CTableDataCell>
                <CTableDataCell>{event.date}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default PartnerEventsTable;
