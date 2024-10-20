import React from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'

const collaborators = [
  { name: "AngelHack", specialty: "Technology", benefits: "Host tech conferences, Conduct hackathons" },
  { name: "ArtisanWorkshops", specialty: "Art", benefits: "Organize art workshops, Set up pop-up art galleries" },
  { name: "CulinaryMasters", specialty: "Culinary", benefits: "Arrange cooking classes, Host food tasting events" },
  { name: "EcoAdventures", specialty: "Outdoor", benefits: "Lead nature excursions, Organize photography tours" },
  { name: "HealthHub Seminars", specialty: "Health", benefits: "Provide wellness seminars, Offer fitness assessments" },
  { name: "GlobalMinds Symposiums", specialty: "Education", benefits: "Host educational conferences, Organize expert panel discussions" },
  { name: "InnovateTech Hackathons", specialty: "Innovation", benefits: "Conduct themed hackathons, Host innovation workshops" },
  { name: "MusicFusion Festivals", specialty: "Music", benefits: "Coordinate music performances, Host instrument workshops" },
  { name: "FitLife Retreats", specialty: "Fitness", benefits: "Offer fitness boot camps, Host yoga retreats" },
  { name: "BusinessElite Networking", specialty: "Business", benefits: "Facilitate networking events, Provide business mentorship sessions" },
  { name: "GreenEarth Exhibitions", specialty: "Environment", benefits: "Conduct environmental science exhibitions, Host sustainability workshops" },
  { name: "FilmMakers United", specialty: "Film", benefits: "Organize film screenings, Host filmmaking workshops" },
  { name: "DigitalNomad Meetups", specialty: "Remote Work", benefits: "Host remote work strategy sessions, Organize digital nomad networking events" },
  { name: "ScienceXplorer Events", specialty: "Science", benefits: "Conduct interactive science exhibitions, Host talks by renowned scientists" }
]

const CollaboratorsTable = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4 className="mb-0">Current Collaborators</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive align="middle" className="mb-0 border">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Partner Name</CTableHeaderCell>
              <CTableHeaderCell>Specialty</CTableHeaderCell>
              <CTableHeaderCell>Benefits Offered</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {collaborators.map((collaborator, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  <div>{collaborator.name}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{collaborator.specialty}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{collaborator.benefits}</div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default CollaboratorsTable