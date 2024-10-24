// import React, { useState, useEffect } from 'react';
// import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel } from '@coreui/react';
// import axios from 'axios';
// import { Edit, Trash, Plus, Eye } from 'lucide-react';
// import './TargetedAds.css';

// const TargetedAdsDashboard = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentCampaign, setCurrentCampaign] = useState({});
//   const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', or 'add'

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   const fetchCampaigns = async () => {
//     try {
//       const response = await axios.get('http://localhost:8002/admin/targeted-ads');
//       setCampaigns(response.data);
//     } catch (error) {
//       console.error('Error fetching campaigns:', error);
//     }
//   };

//   const handleModalOpen = (mode, campaign = {}) => {
//     setModalMode(mode);
//     setCurrentCampaign(campaign);
//     setShowModal(true);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setCurrentCampaign({});
//   };

//   const handleCampaignSave = async () => {
//     try {
//       if (modalMode === 'add') {
//         await axios.post('http://localhost:8002/admin/targeted-ads', currentCampaign);
//       } else {
//         await axios.put(`http://localhost:8002/admin/targeted-ads/${currentCampaign.id}`, currentCampaign);
//       }
//       fetchCampaigns();
//       handleModalClose();
//     } catch (error) {
//       console.error('Error saving campaign:', error);
//     }
//   };

//   const handleCampaignDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this campaign?')) {
//       try {
//         await axios.delete(`http://localhost:8002/admin/targeted-ads/${id}`);
//         fetchCampaigns();
//       } catch (error) {
//         console.error('Error deleting campaign:', error);
//       }
//     }
//   };

//   const renderCampaignTable = (campaigns, title) => (
//     <CCard className="mb-4">
//       <CCardHeader>
//         <h4 className="mb-0">{title}</h4>
//       </CCardHeader>
//       <CCardBody>
//         <CTable hover responsive>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>Campaign Name</CTableHeaderCell>
//               <CTableHeaderCell>Target Audience</CTableHeaderCell>
//               <CTableHeaderCell>Budget</CTableHeaderCell>
//               <CTableHeaderCell>Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {campaigns.map((campaign) => (
//               <CTableRow key={campaign.id}>
//                 <CTableDataCell>{campaign.name}</CTableDataCell>
//                 <CTableDataCell>{campaign.target_audience}</CTableDataCell>
//                 <CTableDataCell>${campaign.budget}</CTableDataCell>
//                 <CTableDataCell>
//                   <CButton color="info" size="sm" className="me-2" onClick={() => handleModalOpen('view', campaign)}>
//                     <Eye size={18} />
//                   </CButton>
//                   <CButton color="warning" size="sm" className="me-2" onClick={() => handleModalOpen('edit', campaign)}>
//                     <Edit size={18} />
//                   </CButton>
//                   <CButton color="danger" size="sm" onClick={() => handleCampaignDelete(campaign.id)}>
//                     <Trash size={18} />
//                   </CButton>
//                 </CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//         <CButton className="launch-campaign-button" onClick={() => handleModalOpen('add')}>
//           <Plus size={18} /> Launch New Campaign
//         </CButton>
//       </CCardBody>
//     </CCard>
//   );

//   return (
//     <div>
//       <h2 className="mb-4">Targeted Ads Dashboard</h2>

//       <CRow>
//         <CCol lg={12}>
//           {renderCampaignTable(campaigns, 'Ongoing Campaigns')}
//         </CCol>
//       </CRow>

//       <CModal visible={showModal} onClose={handleModalClose} size="lg">
//         <CModalHeader closeButton>
//           <h5>{modalMode === 'view' ? 'View Campaign' : modalMode === 'edit' ? 'Edit Campaign' : 'Launch New Campaign'}</h5>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <CFormLabel htmlFor="campaignName">Campaign Name</CFormLabel>
//             <CFormInput
//               id="campaignName"
//               value={currentCampaign.name || ''}
//               onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
//               disabled={modalMode === 'view'}
//               className="mb-3"
//             />
//             <CFormLabel htmlFor="targetAudience">Target Audience</CFormLabel>
//             <CFormInput
//               id="targetAudience"
//               value={currentCampaign.target_audience || ''}
//               onChange={(e) => setCurrentCampaign({ ...currentCampaign, target_audience: e.target.value })}
//               disabled={modalMode === 'view'}
//               className="mb-3"
//             />
//             <CFormLabel htmlFor="budget">Budget</CFormLabel>
//             <CFormInput
//               id="budget"
//               type="number"
//               value={currentCampaign.budget || ''}
//               onChange={(e) => setCurrentCampaign({ ...currentCampaign, budget: parseFloat(e.target.value) })}
//               disabled={modalMode === 'view'}
//               className="mb-3"
//             />
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleModalClose}>
//             Close
//           </CButton>
//           {modalMode !== 'view' && (
//             <CButton color="primary" onClick={handleCampaignSave}>
//               {modalMode === 'edit' ? 'Save Changes' : 'Launch Campaign'}
//             </CButton>
//           )}
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default TargetedAdsDashboard;

import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormInput, CFormLabel } from '@coreui/react';
import axios from 'axios';
import { Edit, Trash, Plus, Eye } from 'lucide-react';
import './Affiliations.css';

const AffiliationsDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState({});
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', or 'add'
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCampaigns();
    fetchCoupons();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:8002/admin/targeted-ads');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:8002/coupons');
      console.log('response', response.data);
      setCoupons(response.data.coupons);  // Update with actual coupons data
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleModalOpen = (mode, campaign = {}) => {
    setModalMode(mode);
    setCurrentCampaign(campaign);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentCampaign({});
  };

  const handleCampaignSave = async () => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:8002/admin/targeted-ads', currentCampaign);
      } else {
        await axios.put(`http://localhost:8002/admin/targeted-ads/${currentCampaign.id}`, currentCampaign);
      }
      fetchCampaigns();
      handleModalClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleCampaignDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await axios.delete(`http://localhost:8002/admin/targeted-ads/${id}`);
        fetchCampaigns();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const renderCampaignTable = (campaigns, title) => (
    <CCard className="mb-4">
      <CCardHeader>
        <h4 className="mb-0">{title}</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Campaign Name</CTableHeaderCell>
              <CTableHeaderCell>Target Audience</CTableHeaderCell>
              <CTableHeaderCell>Budget</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {campaigns.map((campaign) => (
              <CTableRow key={campaign.id}>
                <CTableDataCell>{campaign.name}</CTableDataCell>
                <CTableDataCell>{campaign.target_audience}</CTableDataCell>
                <CTableDataCell>${campaign.budget}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="info" size="sm" className="me-2" onClick={() => handleModalOpen('view', campaign)}>
                    <Eye size={18} />
                  </CButton>
                  <CButton color="warning" size="sm" className="me-2" onClick={() => handleModalOpen('edit', campaign)}>
                    <Edit size={18} />
                  </CButton>
                  <CButton color="danger" size="sm" onClick={() => handleCampaignDelete(campaign.id)}>
                    <Trash size={18} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <CButton className="launch-campaign-button" onClick={() => handleModalOpen('add')}>
          <Plus size={18} /> Launch New Campaign
        </CButton>
      </CCardBody>
    </CCard>
  );

  const renderCouponsTable = () => (
    <CCard className="mb-4">
      <CCardHeader>
        <h4 className="mb-0">Coupons & Offers</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Coupon Code</CTableHeaderCell>
              <CTableHeaderCell>Discount</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Array.isArray(coupons) && coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{coupon.coupon}</CTableDataCell>
                  <CTableDataCell>{(coupon.discount * 100).toFixed(0)}%</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={2}>No coupons available</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );

  return (
    <div>
      <h2 className="mb-4">Affiliations Dashboard</h2>

      <CRow>
        <CCol lg={12}>
          {/* Affiliations Section */}
          {/* <CCard className="mb-4">
            <CCardHeader>
              <h4>Innovative Affiliations</h4>
            </CCardHeader>
            <CCardBody>
              <p>
                Hotels and chains can partner with companies or startups to promote their products through various hotel
                amenities like displaying logos on cups, showing ads on the TV, or using hotel lobby displays. This allows
                partners to promote their brands while the hotel earns a commission or a fixed fee for the promotional space.
              </p>
            </CCardBody>
          </CCard> */}
          <CCard className="mb-4">
  <CCardHeader>
    <h4>Innovative Affiliations</h4>
  </CCardHeader>
  <CCardBody>
    <p>
      <strong>
      Hotels and chains can partner with companies or startups to promote their products through various hotel amenities like displaying logos on cups, showing ads on the TV, or using hotel lobby displays. This allows partners to promote their brands while the hotel earns a commission or a fixed fee for the promotional space.
      </strong>
    </p>

    <p>
      In addition to traditional methods, hotels can introduce more innovative affiliation opportunities:
    </p>
    <ul>
     
      
     
      <li>
        <strong>Customized Room Ambiance by Brand:</strong> Allow guests to select a specific room ambiance or theme sponsored by a partner brand, where the lighting, scent, and digital content (on screens or smart devices) are tailored to a particular product or lifestyle, like a wellness theme for fitness brands.
      </li>
      <li>
        <strong>Branded Hotel Amenities:</strong> In addition to traditional branded toiletries, hotels can partner with luxury brands for branded amenities like branded sleep masks, workout gear, or even tech gadgets (such as wireless chargers) that guests can use during their stay and buy at checkout.
      </li>
     
  
    </ul>
    <p>
      These innovative affiliation methods provide both immersive guest experiences and new revenue streams for hotels, while giving brands more creative and personalized ways to engage with potential customers.
    </p>
  </CCardBody>
</CCard>
          {/* Targeted Ads Section */}
          {renderCampaignTable(campaigns, 'Targetted Ads Campaigns')}

          {/* Coupons/Offers Section */}
          {renderCouponsTable()}
        </CCol>
      </CRow>

      {/* Modal for viewing/adding/editing campaigns */}
      <CModal visible={showModal} onClose={handleModalClose} size="lg">
        <CModalHeader closeButton>
          <h5>{modalMode === 'view' ? 'View Campaign' : modalMode === 'edit' ? 'Edit Campaign' : 'Launch New Campaign'}</h5>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="campaignName">Campaign Name</CFormLabel>
            <CFormInput
              id="campaignName"
              value={currentCampaign.name || ''}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
            <CFormLabel htmlFor="targetAudience">Target Audience</CFormLabel>
            <CFormInput
              id="targetAudience"
              value={currentCampaign.target_audience || ''}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, target_audience: e.target.value })}
              disabled={modalMode === 'view'}
              className="mb-3"
            />
            <CFormLabel htmlFor="budget">Budget</CFormLabel>
            <CFormInput
              id="budget"
              type="number"
              value={currentCampaign.budget || ''}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, budget: parseFloat(e.target.value) })}
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
            <CButton color="primary" onClick={handleCampaignSave}>
              {modalMode === 'edit' ? 'Save Changes' : 'Launch Campaign'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AffiliationsDashboard;
