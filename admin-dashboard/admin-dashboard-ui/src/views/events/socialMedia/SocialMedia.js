import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CCardImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormLabel,
} from '@coreui/react';
import './SocialMedia.css'; // Adjust the path as necessary

const SocialMediaEvents = () => {
  const [searchTag, setSearchTag] = useState('');
  const [topPosts, setTopPosts] = useState([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [launchEvent, setLaunchEvent] = useState({
    title: '',
    description: '',
    hashtag: '',
  });

  const handleSearchTag = () => {
    if (!searchTag) return;

    fetch(`http://localhost:8002/search-instagram?tag=${searchTag}`)
      .then((response) => response.json())
      .then((data) => {
        setTopPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching Instagram posts:', error);
      });
  };

  useEffect(() => {
    fetch('http://localhost:8002/ongoing-sme-campaigns') // Fixed URL syntax
      .then((response) => response.json())
      .then((data) => setOngoingCampaigns(data))
      .catch((error) => {
        console.error('Error fetching ongoing campaigns:', error);
      });
  }, []);

  const handleLaunchEvent = () => {
    fetch('http://localhost:8002/launch-sme-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launchEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        setOngoingCampaigns([...ongoingCampaigns, data]);
        setShowLaunchModal(false);
        setLaunchEvent({ title: '', description: '', hashtag: '' });
      })
      .catch((error) => {
        console.error('Error launching event:', error);
      });
  };

  const removeCampaign = (campaignId) => {
    if (!campaignId) {
      console.error('Invalid campaign ID');
      return;
    }

    if (window.confirm('Are you sure you want to remove this campaign?')) {
      fetch(`http://localhost:8002/ongoing-sme-campaigns/${campaignId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setOngoingCampaigns((prevCampaigns) =>
              prevCampaigns.filter((campaign) => campaign.id !== campaignId)
            );
          } else {
            console.error('Failed to delete the campaign.');
          }
        })
        .catch((error) => console.error('Error deleting campaign:', error));
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h1 className="text-center mb-5">Social Media Events</h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Launch a Social Media Event</h3>
          <CButton className="button-custom" onClick={() => setShowLaunchModal(true)}>
            Launch Social Media Event
          </CButton>
        </div>

        <div className="mb-4">
          <h6>Search Instagram by Hashtag</h6>
          <CFormInput
            placeholder="Enter a hashtag (e.g., travel)"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
          <CButton className="btn-black mt-2" onClick={handleSearchTag}>
            Search
          </CButton>

          <div className="mt-5">
            <h3>Top 5 Posts</h3>
            {topPosts.length > 0 ? (
              topPosts.map((post, index) => (
                <CCard key={index} className="mb-3">
                  <CCardHeader>
                    <strong>Post {index + 1}</strong>
                  </CCardHeader>
                  <CCardImage orientation="top" src={post.display_url} />
                  <CCardBody>
                    <p>Likes: {post.likes}</p>
                    <p>Comments: {post.comments}</p>
                    <p>Caption: {post.caption}</p>
                    <p>Timestamp: {new Date(post.timestamp).toLocaleString()}</p>
                    <a href={`https://www.instagram.com/p/${post.shortcode}`} target="_blank" rel="noopener noreferrer">View on Instagram</a>
                  </CCardBody>
                </CCard>
              ))
            ) : (
              <p>No posts to display</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h3>Ongoing SME Campaigns</h3>
          {ongoingCampaigns.length > 0 ? (
            ongoingCampaigns.map((campaign, index) => (
              <CCard key={index} className="mb-3">
                <CCardHeader>
                  <strong>{campaign.title}</strong>
                </CCardHeader>
                <CCardBody>
                  <p>{campaign.description}</p>
                  <CButton className="btn-black" onClick={() => removeCampaign(campaign.id)}>
                    Remove Campaign
                  </CButton>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <p>No ongoing campaigns at the moment.</p>
          )}
        </div>

        <CModal visible={showLaunchModal} onClose={() => setShowLaunchModal(false)}>
          <CModalHeader>
            <strong>Launch Social Media Event</strong>
          </CModalHeader>
          <CModalBody>
            <CFormLabel>Title</CFormLabel>
            <CFormInput
              value={launchEvent.title}
              onChange={(e) => setLaunchEvent({ ...launchEvent, title: e.target.value })}
            />
            <CFormLabel>Description</CFormLabel>
            <CFormInput
              value={launchEvent.description}
              onChange={(e) => setLaunchEvent({ ...launchEvent, description: e.target.value })}
            />
            <CFormLabel>Hashtag</CFormLabel>
            <CFormInput
              value={launchEvent.hashtag}
              onChange={(e) => setLaunchEvent({ ...launchEvent, hashtag: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleLaunchEvent}>
              Launch Event
            </CButton>
            <CButton color="secondary" onClick={() => setShowLaunchModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
};

export default SocialMediaEvents;