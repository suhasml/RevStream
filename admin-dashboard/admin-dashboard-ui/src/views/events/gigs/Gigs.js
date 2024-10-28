import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner } from '@coreui/react';
import { v4 as uuidv4 } from 'uuid';
import './Gigs.css'; // Adjust the path as necessary

const SESSION_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

const ManageGigsComponent = () => {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSessionId = () => {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    const now = new Date().getTime();

    if (sessionData && sessionData.sessionId && now - sessionData.timestamp < SESSION_EXPIRATION_TIME) {
      return sessionData.sessionId;
    } else {
      const newSessionId = uuidv4();
      const newSessionData = {
        sessionId: newSessionId,
        timestamp: now
      };
      localStorage.setItem('sessionData', JSON.stringify(newSessionData));
      return newSessionId;
    }
  };

  useEffect(() => {
    const sessionId = getSessionId();

    fetch('https://revstream-461943786929.us-central1.run.app/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setArtists(data.artists || []);
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const sendEmail = (artistName) => {
    const artistEmail = artistName.toLowerCase().replace(/\s/g, '') + '@example.com';
    const subject = encodeURIComponent('Event Performance Inquiry');
    const body = encodeURIComponent(`Hello ${artistName},\n\nWe would like to inquire if you're interested in performing at our event.\n\nBest regards,\nEvent Team`);

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${artistEmail}&su=${subject}&body=${body}`;

    window.open(gmailLink, '_blank');
  };

  if (loading) {
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
        <h2>Manage Gigs</h2> {/* Main heading */}

        <h4>Artists</h4> {/* Subheading for artists */}
        <div className="card-grid">
          {artists.length === 0 ? (
            <p>No artists available for the upcoming events.</p>
          ) : (
            artists.map((artist, index) => (
              <CCard key={index} className="mb-4 ccard"> {/* Added 'ccard' class */}
                <CCardHeader className="ccard-header">{artist.name}</CCardHeader>
                <CCardBody>
                  <p>Occupation: {artist.occupation}</p>
                  <p>Date of Arrival: {new Date(artist.arrival_datetime).toLocaleDateString()}</p>
                  <CButton className="custom-button" onClick={() => sendEmail(artist.name)}>
                    Contact {artist.name}
                  </CButton>
                </CCardBody>
              </CCard>
            ))
          )}
        </div>

        <h4>Events</h4> {/* Subheading for events */}
        <div className="card-grid">
          {events.length === 0 ? (
            <p>No events available for the upcoming period.</p>
          ) : (
            events.map((event, index) => (
              <CCard key={index} className="mb-4 ccard"> {/* Added 'ccard' class */}
                <CCardHeader className="ccard-header">Event Type: {event.event}</CCardHeader>
                <CCardBody>
                  <p>Description: {event.description}</p>
                  <p>Artist: {event.artist}</p>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                </CCardBody>
              </CCard>
            ))
          )}
        </div>
      </CCol>
    </CRow>
  );
};

export default ManageGigsComponent;
