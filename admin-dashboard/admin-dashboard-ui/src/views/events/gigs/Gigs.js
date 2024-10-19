import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react';

const ManageGigsComponent = () => {
  const [artists, setArtists] = useState([]); // State for artists
  const [events, setEvents] = useState([]);  // State for events

  useEffect(() => {
    // Fetch artists and events from the API endpoint
    fetch('http://localhost:8002/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },  
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtists(data.artists || []);  // Ensure fallback to an empty array if undefined
        setEvents(data.events || []);    // Ensure fallback to an empty array if undefined
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Function to handle sending email to the artist
  const sendEmail = (artistName) => {
    const email = prompt(`Enter your email to contact ${artistName}`);
    if (email) {
      const mailtoLink = `mailto:${email}?subject=Event Performance Inquiry&body=Hello ${artistName},%0D%0A%0D%0AWe would like to inquire if you're interested in performing at our event.%0D%0A%0D%0ABest regards,%0D%0AEvent Team`;
      window.location.href = mailtoLink;
    }
  };

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
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Capacity: {event.capacity}</p> {/* If 'capacity' exists, make sure it matches the response */}
              </CCardBody>
            </CCard>
          ))
        )}
      </CCol>
    </CRow>
  );
};

export default ManageGigsComponent;
