import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CListGroup, CListGroupItem } from '@coreui/react';
import { Plus } from 'lucide-react';

const OtherPartnershipUses = () => {
  const additionalPartnershipIdeas = [
    {
      title: 'Setup Stalls for Events',
      description: 'Set up stalls during events, either by partners or the community, offering products or services that resonate with the theme of the event or the community’s interest.',
    },
    {
      title: 'Opportunities for Filmmaking',
      description: 'Provide opportunities for partners or external organizations to use the venue for filmmaking, photoshoots, or content creation, turning it into a visually attractive location.',
    },
    {
      title: 'Parking Collaborations During Peak Times',
      description: 'Collaborate with nearby parking services to manage traffic and provide better parking options for guests during peak times, ensuring convenience for large events or high-traffic seasons.',
    },
    {
      title: 'Host Workshops & Trainings',
      description: 'Work with partners to host workshops or training sessions for both residents and external attendees, providing value-added experiences around technology, wellness, or other trending topics.',
    },
    {
      title: 'Exclusive Discounts & Perks',
      description: 'Collaborate with partners to provide residents and guests with exclusive discounts or perks on services such as restaurants, fitness classes, or local experiences, enhancing the value of the stay.',
    },
    {
      title: 'Pop-Up Shops & Markets',
      description: 'Invite local businesses or startups to set up pop-up shops, creating a marketplace atmosphere where residents and guests can explore unique products or services from the community.',
    },
    {
      title: 'Collaborative Marketing Campaigns',
      description: 'Co-create marketing campaigns with partners that spotlight your property while promoting partner brands, such as social media takeovers, influencer events, or special themed days.',
    },
    {
      title: 'Event Co-Sponsorships',
      description: 'Allow partners to co-sponsor larger events like festivals, concerts, or conferences at the venue, giving them visibility and aligning their brand with the experiences provided at the property.',
    },
  ];

  const handleAddMore = () => {
    // Functionality to handle adding more partnership ideas can go here.
    alert('Add more ideas for using partnerships!');
  };

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Other Ways to Utilize Partnerships</h4>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              {additionalPartnershipIdeas.map((idea, index) => (
                <CListGroupItem key={index}>
                  <h5>{idea.title}</h5>
                  <p>{idea.description}</p>
                </CListGroupItem>
              ))}
            </CListGroup>
            <CButton color="primary" className="mt-3" onClick={handleAddMore}>
              <Plus size={18} /> Add More Ideas
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default OtherPartnershipUses;
