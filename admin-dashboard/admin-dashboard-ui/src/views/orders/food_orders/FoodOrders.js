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

const FoodOrders = () => {
  const [foodOrders, setFoodOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodOrders = async () => {
      try {
        const response = await fetch('http://localhost:8002/get-food-orders'); // API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch food orders');
        }
        const data = await response.json();
        setFoodOrders(data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching food orders:', error);
        setError('Failed to load food orders. Please try again later.'); // Error handling
      }
    };

    fetchFoodOrders();

    const ws = new WebSocket('ws://localhost:8002/ws'); // WebSocket endpoint

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setFoodOrders(data.data); // Update state with new food orders
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to real-time updates. Please refresh the page.'); // Error handling
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
          <CCardHeader>
            <strong>Food Orders</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Room Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Food Items</CTableHeaderCell> {/* Updated to match API response */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {foodOrders.length > 0 ? (
                  foodOrders.map((order, index) => (
                    <CTableRow key={order.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{order.room_number}</CTableDataCell>
                      <CTableDataCell>{order.items}</CTableDataCell> {/* Updated to match API response */}
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

export default FoodOrders;
