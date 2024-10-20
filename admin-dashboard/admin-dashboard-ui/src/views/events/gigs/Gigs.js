// import React, { useState, useEffect } from 'react';
// import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner } from '@coreui/react';

// const ManageGigsComponent = () => {
//   const [artists, setArtists] = useState([]);  // State for artists
//   const [events, setEvents] = useState([]);   // State for events
//   const [loading, setLoading] = useState(true);  // State to track loading

//   useEffect(() => {
//     // Fetch artists and events from the API endpoint
//     fetch('http://localhost:8002/gigs', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },  
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setArtists(data.artists || []);  // Ensure fallback to an empty array if undefined
//         setEvents(data.events || []);    // Ensure fallback to an empty array if undefined
//         setLoading(false);  // Set loading to false once data is fetched
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);  // Set loading to false in case of error
//       });
//   }, []);

//   const sendEmail = (artistName) => {
//     const artistEmail = artistName.toLowerCase().replace(/\s/g, '') + '@example.com';
//     const subject = encodeURIComponent('Event Performance Inquiry');
//     const body = encodeURIComponent(`Hello ${artistName},\n\nWe would like to inquire if you're interested in performing at our event.\n\nBest regards,\nEvent Team`);
    
//     // Construct the Gmail URL to open in compose mode
//     const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${artistEmail}&su=${subject}&body=${body}`;
    
//     // Open Gmail compose in a new tab
//     window.open(gmailLink, '_blank');
//   };
  
//   if (loading) {
//     // Display loading spinner while fetching data
//     return (
//       <CRow>
//         <CCol xs={12}>
//           <h2>Manage Gigs</h2>
//           <CSpinner color="primary" /> Loading...
//         </CCol>
//       </CRow>
//     );
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <h2>Manage Gigs</h2>

//         <h4>Artists</h4>
//         {artists.length === 0 ? (
//           <p>No artists available for the upcoming events.</p>
//         ) : (
//           artists.map((artist, index) => (
//             <CCard key={index} className="mb-4">
//               <CCardHeader>{artist.name}</CCardHeader> {/* Make sure 'name' matches your API response */}
//               <CCardBody>
//                 <p>Occupation: {artist.occupation}</p> {/* Ensure 'occupation' matches the response */}
//                 <p>Date of Arrival: {new Date(artist.arrival_datetime).toLocaleDateString()}</p>
//                 <CButton color="primary" onClick={() => sendEmail(artist.name)}>
//                   Contact {artist.name}
//                 </CButton>
//               </CCardBody>
//             </CCard>
//           ))
//         )}

//         <h4>Events</h4>
//         {events.length === 0 ? (
//           <p>No events available for the upcoming period.</p>
//         ) : (
//           events.map((event, index) => (
//             <CCard key={index} className="mb-4">
//               <CCardHeader>Event Type: {event.event}</CCardHeader> {/* Ensure 'event' key matches your API response */}
//               <CCardBody>
//                 <p>Description: {event.description}</p> {/* Ensure 'description' key matches your API response */}
//                 <p>Artist: {event.artist}</p> {/* Ensure 'artist' key matches your API response */}
//                 <p>Date: {new Date(event.date).toLocaleDateString()}</p>
//               </CCardBody>
//             </CCard>
//           ))
//         )}
//       </CCol>
//     </CRow>
//   );
// };

// export default ManageGigsComponent;


import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner } from '@coreui/react';
import { v4 as uuidv4 } from 'uuid';  // Import UUID to generate session IDs

const SESSION_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

const ManageGigsComponent = () => {
  const [artists, setArtists] = useState([]);  // State for artists
  const [events, setEvents] = useState([]);   // State for events
  const [loading, setLoading] = useState(true);  // State to track loading

  // Function to generate or retrieve session ID
  const getSessionId = () => {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    const now = new Date().getTime();

    // Check if session exists and is still valid (not expired)
    if (sessionData && sessionData.sessionId && now - sessionData.timestamp < SESSION_EXPIRATION_TIME) {
      return sessionData.sessionId;  // Return existing valid session ID
    } else {
      // Generate a new session ID
      const newSessionId = uuidv4();  // Use uuidv4 to generate a new session ID
      const newSessionData = {
        sessionId: newSessionId,
        timestamp: now
      };
      localStorage.setItem('sessionData', JSON.stringify(newSessionData));  // Store session ID and timestamp
      return newSessionId;  // Return new session ID
    }
  };

  useEffect(() => {
    const sessionId = getSessionId();  // Get or create session ID

    // Fetch artists and events from the API endpoint
    fetch('http://localhost:8002/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),  // Send session ID to backend
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtists(data.artists || []);  // Ensure fallback to an empty array if undefined
        setEvents(data.events || []);    // Ensure fallback to an empty array if undefined
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);  // Set loading to false in case of error
      });
  }, []);

  const sendEmail = (artistName) => {
    const artistEmail = artistName.toLowerCase().replace(/\s/g, '') + '@example.com';
    const subject = encodeURIComponent('Event Performance Inquiry');
    const body = encodeURIComponent(`Hello ${artistName},\n\nWe would like to inquire if you're interested in performing at our event.\n\nBest regards,\nEvent Team`);
    
    // Construct the Gmail URL to open in compose mode
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${artistEmail}&su=${subject}&body=${body}`;
    
    // Open Gmail compose in a new tab
    window.open(gmailLink, '_blank');
  };

  if (loading) {
    // Display loading spinner while fetching data
    return (
      <CRow>
        <CCol xs={12}>
          <h2>Manage Gigs</h2>
          <CSpinner color="primary" /> Loading...
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h2>Manage Gigs</h2>

        <h4>Artists</h4>
        {artists.length === 0 ? (
          <p>No artists available for the upcoming events.</p>
        ) : (
          artists.map((artist, index) => (
            <CCard key={index} className="mb-4">
              <CCardHeader>{artist.name}</CCardHeader> {/* Make sure 'name' matches your API response */}
              <CCardBody>
                <p>Occupation: {artist.occupation}</p> {/* Ensure 'occupation' matches the response */}
                <p>Date of Arrival: {new Date(artist.arrival_datetime).toLocaleDateString()}</p>
                <CButton color="primary" onClick={() => sendEmail(artist.name)}>
                  Contact {artist.name}
                </CButton>
              </CCardBody>
            </CCard>
          ))
        )}

        <h4>Events</h4>
        {events.length === 0 ? (
          <p>No events available for the upcoming period.</p>
        ) : (
          events.map((event, index) => (
            <CCard key={index} className="mb-4">
              <CCardHeader>Event Type: {event.event}</CCardHeader> {/* Ensure 'event' key matches your API response */}
              <CCardBody>
                <p>Description: {event.description}</p> {/* Ensure 'description' key matches your API response */}
                <p>Artist: {event.artist}</p> {/* Ensure 'artist' key matches your API response */}
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              </CCardBody>
            </CCard>
          ))
        )}
      </CCol>
    </CRow>
  );
};

export default ManageGigsComponent;
