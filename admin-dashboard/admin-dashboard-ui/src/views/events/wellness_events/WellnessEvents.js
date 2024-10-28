import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './EventsPage.css' // Your custom CSS file for the calendar

const wellnessEvents = [
  {
    title: 'Sunrise Serenity: Rooftop Yoga & Meditation',
    frequency: 'Weekly, Tuesday and Thursday mornings',
    description: 'Start the day with a rejuvenating yoga and meditation session on the hotel\'s rooftop.',
    details: [
      '60-minute gentle yoga flow suitable for all levels',
      '15-minute guided meditation with city views',
      'Healthy breakfast smoothie bar post-session',
      'Option for private sessions or group classes',
      'Occasional themed sessions (e.g., full moon yoga, solstice celebrations)',
    ],
  },
  {
    title: 'Urban Oasis: Mini-Retreats',
    frequency: 'Monthly, first weekend',
    description: 'A day-long retreat offering a variety of wellness activities without leaving the city.',
    details: [
      'Morning yoga or Pilates class',
      'Mindfulness workshop',
      'Nutrition talk and cooking demonstration',
      'Spa treatment taster sessions',
      'Ending with a sound bath or guided relaxation',
      'Healthy lunch and refreshments included',
    ],
  },
  {
    title: 'Tech-Life Balance Workshop',
    frequency: 'Bi-weekly, Wednesday evenings',
    description: 'Learn how to maintain wellness in the digital age, perfect for tech-savvy guests.',
    details: [
      'Sessions on digital detox strategies',
      'Ergonomics workshop for desk workers',
      'Introduction to wellness apps and gadgets',
      'Eye strain reduction techniques',
      'Mindful use of social media discussion',
      'Take-home toolkit with recommended apps and practices',
    ],
  },
  {
    title: 'Flavor & Fitness Fusion',
    frequency: 'Weekly, Saturday afternoons',
    description: 'Combine culinary experiences with fitness activities for a holistic approach to wellness.',
    details: [
      'Alternating weekends of:',
      'Healthy cooking class followed by a dance fitness session',
      'Nutrition workshop followed by a HIIT workout',
      'Focus on local, nutritious ingredients',
      'Take-home recipe cards and workout plans',
      'Option to join a monthly wellness challenge',
    ],
  },
]

// export default WellnessEventsPage
const WellnessEventCard = ({ event, index, isOpen, toggle, onSelectEvent }) => {
  return (
    <CCard className="wellness-event-card mb-4">
      <CCardHeader onClick={() => toggle(index)} style={{ cursor: 'pointer' }}>
        <strong className="card-header-title">{event.title}</strong>
        <small className="float-end card-header-frequency">{event.frequency}</small>
      </CCardHeader>
      <CCollapse visible={isOpen}>
        <CCardBody className="wellness-event-card-body">
          <p>{event.description}</p>
          <ul>
            {event.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
          <CButton color="primary" onClick={() => onSelectEvent(event)}>
            Select Event
          </CButton>
        </CCardBody>
      </CCollapse>
    </CCard>
  );
};


const WellnessEventsPage = () => {
  const [openEvent, setOpenEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hostedEvents, setHostedEvents] = useState([]) // Hosted events from DB
  const [availableEvents, setAvailableEvents] = useState(wellnessEvents) // Set initial available events

  // State for custom event modal
  const [customEvent, setCustomEvent] = useState({
    title: '',
    frequency: '',
    description: '',
    details: '',
  })
  const [showCustomEventModal, setShowCustomEventModal] = useState(false)

  // Fetch hosted events from the database on mount
  useEffect(() => {
    fetch('http://localhost:8002/hosted-events')
      .then((response) => response.json())
      .then((data) => {
        setHostedEvents(data)
        // Filter out already hosted events from the available ones
        const hostedTitles = data.map(event => event.title)
        const filteredEvents = wellnessEvents.filter(
          event => !hostedTitles.includes(event.title)
        )
        setAvailableEvents(filteredEvents)
      })
      .catch((error) => {
        console.error('Error fetching hosted events:', error)
      })
  }, [])

  const toggleEvent = (index) => {
    setOpenEvent(openEvent === index ? null : index)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event) // Open the modal with the selected event
  }

  const handleHostEvent = () => {
    const requestData = {
      title: selectedEvent.title,
      date: selectedDate.toISOString(),
      description: selectedEvent.description,
      details: selectedEvent.details,
    }

    fetch('http://localhost:8002/host-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Remove the hosted event from the available events
        setAvailableEvents(availableEvents.filter(event => event.title !== selectedEvent.title))
        setHostedEvents([...hostedEvents, { ...selectedEvent, date: selectedDate }])
        setSelectedEvent(null) // Close modal
      })
      .catch((error) => {
        console.error('Error hosting event:', error)
      })
  }

  const handleAddCustomEvent = () => {
    const requestData = {
      title: customEvent.title,
      frequency: customEvent.frequency,
      description: customEvent.description,
      details: customEvent.details.split(',').map(detail => detail.trim()), // Convert details to an array
    }

    fetch('http://localhost:8002/add-custom-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the custom event to the available events
        setAvailableEvents([...availableEvents, requestData])
        setShowCustomEventModal(false) // Close the modal
        setCustomEvent({ title: '', frequency: '', description: '', details: '' }) // Reset the form
      })
      .catch((error) => {
        console.error('Error adding custom event:', error)
      })
  }

  // CSS class logic for highlighting the selected date
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        return 'highlighted-date' // Add custom class
      }
    }
    return null
  }

  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Wellness and Retreat Events</h1>
          <CButton className="button-custom" onClick={() => setShowCustomEventModal(true)}>
            Add Custom Wellness Event
          </CButton>
        </div>

        {availableEvents.length === 0 && <p>No events available to host.</p>}

        {availableEvents.map((event, index) => (
          <WellnessEventCard
            key={index}
            event={event}
            index={index}
            isOpen={openEvent === index}
            toggle={toggleEvent}
            onSelectEvent={handleSelectEvent}
          />
        ))}

        {/* Modal for event selection */}
        {selectedEvent && (
          <CModal visible={true} onClose={() => setSelectedEvent(null)}>
            <CModalHeader>
              <strong>{selectedEvent.title}</strong>
            </CModalHeader>
            <CModalBody color="primary">
              <p>{selectedEvent.description}</p>
              <h5>Select a date for the event:</h5>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName} // Apply CSS class for selected date
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={handleHostEvent}>
                Host Event
              </CButton>
              <CButton color="secondary" onClick={() => setSelectedEvent(null)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
        )}

        {/* Modal for adding custom event */}
        <CModal visible={showCustomEventModal} onClose={() => setShowCustomEventModal(false)}>
          <CModalHeader>
            <strong>Add Custom Wellness Event</strong>
          </CModalHeader>
          <CModalBody>
            <CFormLabel>Event Title</CFormLabel>
            <CFormInput
              type="text"
              value={customEvent.title}
              onChange={(e) => setCustomEvent({ ...customEvent, title: e.target.value })}
            />
            <CFormLabel>Event Frequency</CFormLabel>
            <CFormInput
              type="text"
              value={customEvent.frequency}
              onChange={(e) => setCustomEvent({ ...customEvent, frequency: e.target.value })}
            />
            <CFormLabel>Event Description</CFormLabel>
            <CFormInput
              type="text"
              value={customEvent.description}
              onChange={(e) => setCustomEvent({ ...customEvent, description: e.target.value })}
            />
            <CFormLabel>Event Details (comma separated)</CFormLabel>
            <CFormInput
              type="text"
              value={customEvent.details}
              onChange={(e) => setCustomEvent({ ...customEvent, details: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleAddCustomEvent}>
              Add Event
            </CButton>
            <CButton color="secondary" onClick={() => setShowCustomEventModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default WellnessEventsPage