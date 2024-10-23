import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel, CFormTextarea, CBadge } from '@coreui/react';
import axios from 'axios';
import { Edit, Trash, Plus, Eye } from 'lucide-react';
import './Packages.css';

const AdminPackageDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [sponsoredPackages, setSponsoredPackages] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({});
  const [modalMode, setModalMode] = useState('view');

  useEffect(() => {
    fetchPackages();
    fetchSponsoredPackages();
    fetchCustomRequests();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8002/admin/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchSponsoredPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8002/admin/sponsored-packages');
      setSponsoredPackages(response.data);
    } catch (error) {
      console.error('Error fetching sponsored packages:', error);
    }
  };

  const fetchCustomRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8002/admin/custom-package-requests');
      setCustomRequests(response.data);
    } catch (error) {
      console.error('Error fetching custom package requests:', error);
    }
  };

  const handleModalOpen = (mode, pkg = {}) => {
    setModalMode(mode);
    setCurrentPackage(pkg);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentPackage({});
  };

  const handlePackageSave = async () => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:8002/admin/packages', currentPackage);
      } else {
        await axios.put(`http://localhost:8002/admin/packages/${currentPackage.id}`, currentPackage);
      }
      fetchPackages();
      handleModalClose();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handlePackageDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`http://localhost:8002/admin/packages/${id}`);
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const renderPackageTable = (packages, title) => (
    <CCard className="mb-4">
      <CCardHeader>
        <h4 className="mb-0">{title}</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Duration</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
          {packages.map((pkg) => (
  <CTableRow key={pkg.id}>
              {pkg.title ? (
                <CTableDataCell>{pkg.title}</CTableDataCell>
              ) : pkg.name ? (
                <CTableDataCell>{pkg.name}</CTableDataCell>
              ) : null}
              <CTableDataCell>${pkg.price}</CTableDataCell>
              <CTableDataCell>{pkg.duration}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" size="sm" className="me-2" onClick={() => handleModalOpen('view', pkg)}>
                  <Eye size={18} />
                </CButton>
                <CButton color="warning" size="sm" className="me-2" onClick={() => handleModalOpen('edit', pkg)}>
                  <Edit size={18} />
                </CButton>
                <CButton color="danger" size="sm" onClick={() => handlePackageDelete(pkg.id)}>
                  <Trash size={18} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}

          </CTableBody>
        </CTable>
        <CButton className="add-package-button" onClick={() => handleModalOpen('add')}>
          <Plus size={18} /> Add New Package
        </CButton>
      </CCardBody>
    </CCard>
  );

  return (
    <div>
      <h2 className="mb-4">Package Management Dashboard</h2>

      <CRow>
        <CCol lg={6}>
          {renderPackageTable(packages, 'Regular Packages')}
        </CCol>
        <CCol lg={6}>
          {renderPackageTable(sponsoredPackages, 'Sponsored Packages')}
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>
          <h4 className="mb-0">Custom Package Requests</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {customRequests.map((request) => (
                <CTableRow key={request.id}>
                  <CTableDataCell>{request.name}</CTableDataCell>
                  <CTableDataCell>{request.description.substring(0, 50)}...</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={request.status === 'Pending' ? 'warning' : 'success'}>
                      {request.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" size="sm" onClick={() => handleModalOpen('view', request)}>
                      <Eye size={18} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={handleModalClose} size="lg">
        <CModalHeader closeButton>
          <h5>{modalMode === 'view' ? 'View Package' : modalMode === 'edit' ? 'Edit Package' : 'Add New Package'}</h5>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="packageName">Package Name</CFormLabel>
            <CFormInput
              id="packageName"
              value={currentPackage.title || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
            <CFormLabel htmlFor="packageDescription">Description</CFormLabel>
            <CFormTextarea
              id="packageDescription"
              value={currentPackage.description || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
            <CFormLabel htmlFor="packagePrice">Price</CFormLabel>
            <CFormInput
              id="packagePrice"
              type="number"
              value={currentPackage.price || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, price: parseFloat(e.target.value) })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
            <CFormLabel htmlFor="packageDuration">Duration</CFormLabel>
            <CFormInput
              id="packageDuration"
              value={currentPackage.duration || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, duration: e.target.value })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalClose}>
            Close
          </CButton>
          {modalMode !== 'view' && (
            <CButton color="primary" onClick={handlePackageSave}>
              {modalMode === 'edit' ? 'Save Changes' : 'Add Package'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdminPackageDashboard;