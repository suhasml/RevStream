import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import './styles.css'; // Import your CSS file here

const RoomServiceRequests = () => {
  const [roomServices, setRoomServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomServices = async () => {
      try {
        const response = await fetch('http://localhost:8002/get-room-services');
        if (!response.ok) {
          throw new Error('Failed to fetch room services');
        }
        const data = await response.json();
        setRoomServices(data);
      } catch (error) {
        console.error('Error fetching room services:', error);
        setError('Failed to load room services. Please try again later.');
      }
    };

    fetchRoomServices();

    const ws = new WebSocket('ws://localhost:8002/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setRoomServices(data.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to real-time updates. Please refresh the page.');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="card-header-custom">
            <strong>Room Service Requests</strong>
          </CCardHeader>
          <CCardBody>
            <CTable className="transparent-table" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Room Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Service Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roomServices.length > 0 ? (
                  roomServices.map((service, index) => (
                    <CTableRow key={service.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{service.room_number}</CTableDataCell>
                      <CTableDataCell>{service.service_type}</CTableDataCell>
                      <CTableDataCell>{service.date}</CTableDataCell>
                      <CTableDataCell>{service.time}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5">No data available</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RoomServiceRequests;