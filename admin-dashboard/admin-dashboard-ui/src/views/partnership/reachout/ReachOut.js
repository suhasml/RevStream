import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import axios from 'axios';

const PartnerEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get the session ID from localStorage or generate a new one if it doesn't exist
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('sessionId', sessionId);
        }

        const response = await axios.post('http://localhost:8002/partner-events', {
          session_id: sessionId
        });
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

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
              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {events.map((event, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{event.partner}</CTableDataCell>
                <CTableDataCell>{event.event}</CTableDataCell>
                <CTableDataCell>{event.description}</CTableDataCell>
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