import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';

const FrequentVisitorsDashboard = () => {
  const [frequentVisitors, setFrequentVisitors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8002/frequent-visitors')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setFrequentVisitors(data))
      .catch(error => {
        console.error('Error fetching frequent visitors:', error);
        setError('Failed to fetch frequent visitors. Please try again later.');
      });
  }, []);

  const visitorCounts = frequentVisitors.map(visitor => visitor.visit_dates.length);

  return (
    <CRow>
      <CCol xs={12}>
        <h1 className="text-center mb-4">Frequent Visitors Dashboard</h1>
        {error && (
          <CAlert color="danger">{error}</CAlert>
        )}
      </CCol>

      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Frequent Visitors</CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Visit Dates</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {frequentVisitors.map((visitor, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{visitor.name}</CTableDataCell>
                    <CTableDataCell>{visitor.email}</CTableDataCell>
                    <CTableDataCell>{visitor.visit_dates.join(', ')}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Visit Frequency</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: frequentVisitors.map(visitor => visitor.name),
                datasets: [
                  {
                    label: 'Number of Visits',
                    backgroundColor: '#001F3F',
                    data: visitorCounts,
                  },
                ],
              }}
              labels="visitors"
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Loyalty Benefits for Frequent Visitors</CCardHeader>
          <CCardBody>
            <h3>Suggested Benefits for Loyal Customers:</h3>
            <ul>
              <li>Free room upgrades when available</li>
              <li>Complimentary breakfast for the entire stay</li>
              <li>Late check-out option (up to 4 PM)</li>
              <li>Welcome amenity upon arrival (e.g., fruit basket, local treats)</li>
              <li>Priority reservations for hotel restaurants and spa services</li>
              <li>Exclusive access to hotel lounges or VIP areas</li>
              <li>Discounted rates for additional guest rooms</li>
              <li>Earn bonus points on loyalty program for each stay</li>
              <li>Annual free night stay after reaching a certain number of visits</li>
              <li>Personalized concierge service</li>
              <li>Complimentary airport transfers</li>
              <li>Special rates for friends and family bookings</li>
            </ul>
            <p>
              Implementing these benefits can significantly enhance customer loyalty and encourage more frequent visits.
              The exact benefits can be tailored based on the number of visits or total nights stayed.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FrequentVisitorsDashboard;