// import React, { useState, useEffect } from 'react'
// import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

// const ManageEventsComponent = () => {
//   const [upcomingEvents, setUpcomingEvents] = useState([]) // Initialize as an empty array
//   const [requestedEvents, setRequestedEvents] = useState([]) // Same for requested events

//   useEffect(() => {
//     fetch('http://localhost:8002/hosted-events')
//       .then((response) => response.json())
//       .then((data) => {
//         setUpcomingEvents(Array.isArray(data) ? data : [])
//       })
//       .catch((error) => console.error('Error fetching upcoming events:', error))

//     fetch('http://localhost:8002/requested-events')
//       .then((response) => response.json())
//       .then((data) => {
//         setRequestedEvents(Array.isArray(data) ? data : [])
//       })
//       .catch((error) => console.error('Error fetching requested events:', error))
//   }, [])

//   // Function to format the date to Singapore Date (without time)
//   const formatDateToSGT = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' })
//   }

//   // Function to handle event cancellation
//   const cancelEvent = (eventId) => {
//     if (window.confirm('Are you sure you want to cancel this event?')) {
//       fetch(`http://localhost:8002/events/${eventId}`, {
//         method: 'DELETE'
//       })
//         .then((response) => {
//           if (response.ok) {
//             // Remove the canceled event from the upcoming events list
//             setUpcomingEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
//           } else {
//             console.error('Failed to delete the event.')
//           }
//         })
//         .catch((error) => console.error('Error deleting event:', error))
//     }
//   }

//   // Function to handle event acceptance
//   const acceptEvent = (event) => {
//     if (window.confirm('Are you sure you want to accept this event?')) {
//       fetch('http://localhost:8002/host-event', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: event.title,
//           date: event.date,
//           description: event.description,
//           details: event.details // Assuming details is part of the event data
//         }),
//       })
//         .then((response) => {
//           if (response.ok) {
//             return response.json()
//           } else {
//             throw new Error('Failed to accept event')
//           }
//         })
//         .then((data) => {
//           // Add the newly accepted event to the upcoming events list
//           setUpcomingEvents((prevEvents) => [...prevEvents, { ...event, id: data.id }])
//           // Remove the accepted event from the requested events list
//           setRequestedEvents((prevEvents) => prevEvents.filter((reqEvent) => reqEvent.id !== event.id))
//         })
//         .catch((error) => console.error('Error accepting event:', error))
//     }
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <h2>Manage Events</h2>

//         <h4>Upcoming Events</h4>
//         {upcomingEvents.length === 0 ? (
//           <p>No upcoming events.</p>
//         ) : (
//           upcomingEvents.map((event, index) => (
//             <CCard key={index} className="mb-4">
//               <CCardHeader>{event.title}</CCardHeader>
//               <CCardBody>
//                 <p>Date: {formatDateToSGT(event.date)}</p>
//                 <p>Description: {event.description}</p>
//                 <CButton color="danger" size="sm" onClick={() => cancelEvent(event.id)}>
//                   Cancel Event
//                 </CButton>
//               </CCardBody>
//             </CCard>
//           ))
//         )}

//         <h4>Requested Events</h4>
//         {requestedEvents.length === 0 ? (
//           <p>No event requests at the moment.</p>
//         ) : (
//           requestedEvents.map((event, index) => (
//             <CCard key={index} className="mb-4">
//               <CCardHeader>{event.title}</CCardHeader>
//               <CCardBody>
//                 <p>Description: {event.description}</p>
//                 <CButton color="primary" onClick={() => acceptEvent(event)}>
//                   Accept
//                 </CButton>
//                 <CButton color="danger" className="ml-2">
//                   Reject
//                 </CButton>
//               </CCardBody>
//             </CCard>
//           ))
//         )}
//       </CCol>
//     </CRow>
//   )
// }

// export default ManageEventsComponent

import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react';

const ManageEventsComponent = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]); // Initialize as an empty array
  const [requestedEvents, setRequestedEvents] = useState([]); // Same for requested events

  useEffect(() => {
    fetch('http://localhost:8002/hosted-events')
      .then((response) => response.json())
      .then((data) => {
        setUpcomingEvents(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching upcoming events:', error));

    fetch('http://localhost:8002/requested-events')
      .then((response) => response.json())
      .then((data) => {
        setRequestedEvents(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching requested events:', error));
  }, []);

  // Function to format the date to Singapore Date (without time)
  const formatDateToSGT = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' });
  };

  // Function to handle event cancellation
  const cancelEvent = (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      fetch(`http://localhost:8002/events/${eventId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // Remove the canceled event from the upcoming events list
            setUpcomingEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
          } else {
            console.error('Failed to delete the event.');
          }
        })
        .catch((error) => console.error('Error deleting event:', error));
    }
  };

  // Function to handle event acceptance
  const acceptEvent = (event) => {
    if (window.confirm('Are you sure you want to accept this event?')) {
      // Add the event to the hosted events
      fetch('http://localhost:8002/host-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: event.title,
          date: event.date,
          description: event.description,
          details: event.details, // Assuming details is part of the event data
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json().then((data) => {
              // After successfully adding to hosted events, delete from requested events
              return fetch(`http://localhost:8002/requested-events/${event.id}`, {
                method: 'DELETE',
              }).then((deleteResponse) => {
                if (deleteResponse.ok) {
                  // Update the requestedEvents state to remove the accepted event
                  setRequestedEvents((prevEvents) =>
                    prevEvents.filter((reqEvent) => reqEvent.id !== event.id)
                  );

                  // Add the newly accepted event to upcomingEvents and sort by date
                  setUpcomingEvents((prevEvents) => {
                    const newEvent = { ...event, id: data.id }; // Include the new ID returned from the POST request
                    return [...prevEvents, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date));
                  });
                } else {
                  throw new Error('Failed to delete from requested events');
                }
              });
            });
          } else {
            throw new Error('Failed to accept event');
          }
        })
        .catch((error) => {
          console.error('Error processing event:', error);
        });
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h2>Manage Events</h2>

        <h4>Upcoming Events</h4>
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          upcomingEvents.map((event, index) => (
            <CCard key={index} className="mb-4">
              <CCardHeader>{event.title}</CCardHeader>
              <CCardBody>
                <p>Date: {formatDateToSGT(event.date)}</p>
                <p>Description: {event.description}</p>
                <CButton color="danger" size="sm" onClick={() => cancelEvent(event.id)}>
                  Cancel Event
                </CButton>
              </CCardBody>
            </CCard>
          ))
        )}

        <h4>Requested Events</h4>
        {requestedEvents.length === 0 ? (
          <p>No event requests at the moment.</p>
        ) : (
          requestedEvents.map((event, index) => (
            <CCard key={index} className="mb-4">
              <CCardHeader>{event.title}</CCardHeader>
              <CCardBody>
                <p>Description: {event.description}</p>
                <CButton color="primary" onClick={() => acceptEvent(event)}>
                  Accept
                </CButton>
                <CButton color="danger" className="ml-2">
                  Reject
                </CButton>
              </CCardBody>
            </CCard>
          ))
        )}
      </CCol>
    </CRow>
  );
};

export default ManageEventsComponent;
