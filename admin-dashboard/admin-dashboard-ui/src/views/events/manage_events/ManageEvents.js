import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react';

const ManageEventsComponent = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [requestedEvents, setRequestedEvents] = useState([]);
  const [socialMediaEvents, setSocialMediaEvents] = useState([]); // State for social media events

  const fetchEvents = () => {
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

    // Fetch social media events
    fetch('http://localhost:8002/ongoing-sme-campaigns')
      .then((response) => response.json())
      .then((data) => {
        setSocialMediaEvents(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching social media events:', error));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDateToSGT = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' });
  };

  const cancelEvent = (eventId) => {
    if (!eventId) {
      console.error('Invalid event ID');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this event?')) {
      fetch(`http://localhost:8002/hosted-events/${eventId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setUpcomingEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
          } else {
            console.error('Failed to delete the event.');
          }
        })
        .catch((error) => console.error('Error deleting event:', error));
    }
  };

  const acceptEvent = (event) => {
    if (!event || !event.id) {
      console.error('Invalid event object');
      return;
    }

    if (window.confirm('Are you sure you want to accept this event?')) {
      fetch('http://localhost:8002/host-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: event.title,
          date: event.date,
          description: event.description,
          details: event.details,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to accept event');
          }
        })
        .then(() => {
          return fetch(`http://localhost:8002/requested-events/${event.id}`, {
            method: 'DELETE',
          });
        })
        .then((response) => {
          if (response.ok) {
            fetchEvents(); // Refresh both lists after successful operations
          } else {
            throw new Error('Failed to delete from requested events');
          }
        })
        .catch((error) => console.error('Error processing event:', error));
    }
  };

  const rejectEvent = (eventId) => {
    if (!eventId) {
      console.error('Invalid event ID');
      return;
    }

    if (window.confirm('Are you sure you want to reject this event?')) {
      fetch(`http://localhost:8002/requested-events/${eventId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setRequestedEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
          } else {
            console.error('Failed to reject the event.');
          }
        })
        .catch((error) => console.error('Error rejecting event:', error));
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
          upcomingEvents.map((event) => (
            <CCard key={event.id} className="mb-4">
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
          requestedEvents.map((event) => (
            <CCard key={event.id} className="mb-4">
              <CCardHeader>{event.title}</CCardHeader>
              <CCardBody>
                <p>Description: {event.description}</p>
                <CButton color="primary" onClick={() => acceptEvent(event)}>
                  Accept
                </CButton>
                <CButton color="danger" className="ml-2" onClick={() => rejectEvent(event.id)}>
                  Reject
                </CButton>
              </CCardBody>
            </CCard>
          ))
        )}

        <h4>Social Media Events</h4>
        {socialMediaEvents.length === 0 ? (
          <p>No social media events at the moment.</p>
        ) : (
          socialMediaEvents.map((event) => (
            <CCard key={event.id} className="mb-4">
              <CCardHeader>{event.title}</CCardHeader>
              <CCardBody>
                <p>Description: {event.description}</p>
                <p>Hashtag: {event.hashtag}</p>
                <CButton color="danger" size="sm" onClick={() => cancelEvent(event.id)}>
                  Cancel Event
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
