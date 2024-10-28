import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CListGroup,
  CListGroupItem,
  CProgress,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEnvelopeOpen, cilTask, cilUser } from '@coreui/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 400 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 500 },
    { name: 'Jul', value: 700 },
  ];

  return (
    <>
      <CRow>
        <CCol xs={12} md={8}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="fw-bold">Welcome, Admin!</h1>
                <CDropdown>
                  <CDropdownToggle color="primary">
                    <CIcon icon={cilBell} />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#">New Order</CDropdownItem>
                    <CDropdownItem href="#">Event Reminder</CDropdownItem>
                    <CDropdownItem href="#">Partnership Request</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
              <p className="text-muted">
                Manage your Lyf Properties business with ease. Access important information and
                updates at a glance.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Quick Actions</h4>
                <CButton color="primary">
                  <CIcon icon={cilTask} />
                </CButton>
              </div>
              <CListGroup flush>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <CIcon icon={cilEnvelopeOpen} className="me-2" />
                      New Messages
                    </div>
                    <span className="badge bg-primary rounded-pill">12</span>
                  </div>
                </CListGroupItem>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <CIcon icon={cilUser} className="me-2" />
                      New Users
                    </div>
                    <span className="badge bg-success rounded-pill">24</span>
                  </div>
                </CListGroupItem>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <CIcon icon={cilTask} className="me-2" />
                      Pending Tasks
                    </div>
                    <span className="badge bg-warning rounded-pill">8</span>
                  </div>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Orders</h4>
                <CButton color="primary">View</CButton>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <p className="text-muted mb-1">Today</p>
                  <h4 className="mb-0">32</h4>
                </div>
                <div>
                  <p className="text-muted mb-1">This Week</p>
                  <h4 className="mb-0">156</h4>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Events</h4>
                <CButton color="success">Manage</CButton>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <p className="text-muted mb-1">Upcoming</p>
                  <h4 className="mb-0">8</h4>
                </div>
                <div>
                  <p className="text-muted mb-1">Past</p>
                  <h4 className="mb-0">24</h4>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Partnerships</h4>
                <CButton color="info">Manage</CButton>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <p className="text-muted mb-1">Active</p>
                  <h4 className="mb-0">16</h4>
                </div>
                <div>
                  <p className="text-muted mb-1">Pending</p>
                  <h4 className="mb-0">4</h4>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Community</h4>
                <CButton color="warning">Manage</CButton>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <p className="text-muted mb-1">Members</p>
                  <h4 className="mb-0">1,246</h4>
                </div>
                <div>
                  <p className="text-muted mb-1">New This Week</p>
                  <h4 className="mb-0">14</h4>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h4>Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h4>New Users</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;