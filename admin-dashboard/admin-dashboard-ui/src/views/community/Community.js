import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CBadge } from '@coreui/react';
import axios from 'axios';

const LyfCommunity = () => {
  const [communityMembers, setCommunityMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the community members from the API
    const fetchCommunityMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8002/search-freelancers');
        setCommunityMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch community members');
        setLoading(false);
      }
    };

    fetchCommunityMembers();
  }, []);

  if (loading) {
    return <CSpinner color="primary" className="mt-3" />;
  }

  if (error) {
    return <div className="text-danger mt-3">{error}</div>;
  }

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Lyf Community Members</h4>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {communityMembers.map((member) => (
                <CCol xs="12" sm="6" md="4" lg="3" key={member.email} className="mb-4">
                  <CCard>
                    <CCardBody>
                      <div className="text-center">
                        <h5>{member.name}</h5>
                        <p className="text-muted">{member.job_title}</p>
                        <p>{member.bio.substring(0, 50)}...</p>
                        <div className="mb-2">
                          {member.skills.map((skill, index) => (
                            <CBadge color="info" className="me-1" key={index}>
                              {skill}
                            </CBadge>
                          ))}
                        </div>
                        <p className="text-muted">Experience: {member.experience_years} years</p>
                        <p className="text-muted">Hourly Rate: ${member.hourly_rate}</p>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default LyfCommunity;
