import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CBadge } from '@coreui/react';
import axios from 'axios';
import './styles.css'; // Import your styles here

const LyfCommunity = () => {
  const [communityMembers, setCommunityMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityMembers = async () => {
      try {
        const response = await axios.get('https://revstream-461943786929.us-central1.run.app/search-freelancers');
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
            <h4>Lyf Community Members</h4>``
          </CCardHeader>
          <CCardBody>
            <CRow>
              {communityMembers.map((member) => (
                <CCol xs="12" sm="6" md="4" lg="3" key={member.email} className="mb-4">
                  <CCard className="card-dark">
                    <CCardBody>
                      <div className="text-center text-black"> {/* Text color changed to black */}
                        <h5>{member.name}</h5>
                        <p>{member.job_title}</p>
                        <p>{member.bio.substring(0, 50)}...</p>
                        <div className="mb-2">
                          {member.skills.map((skill, index) => (
                            <CBadge className="skill-badge me-1" key={index}> {/* Changed badge color to black */}
                              {skill}
                            </CBadge>
                          ))}
                        </div>
                        <p>Experience: {member.experience_years} years</p>
                        <p>Hourly Rate: ${member.hourly_rate}</p>
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