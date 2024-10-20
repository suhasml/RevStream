// import React, { useState } from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CCollapse,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CRow,
// } from '@coreui/react'
// import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
// import './EventsPage.css' // Your custom CSS file for the calendar

// const themedEvents = [
//   {
//     title: 'Festive Fusion Feast',
//     date: 'Last weekend of November',
//     description:
//       'A community potluck event with a twist, celebrating Singapore\'s multicultural holiday traditions.',
//     details: [
//       'Guests bring dishes representing their cultural holiday traditions',
//       'Hotel provides fusion dishes combining different cultural elements',
//       'Live cooking stations for interactive experiences',
//       'Recipe sharing and cooking tips exchange',
//       'Festive decoration workshop using sustainable materials',
//     ],
//   },
//   {
//     title: 'Tech-mas Tree Lighting Ceremony',
//     date: 'First weekend of December',
//     description:
//       'A high-tech twist on the traditional Christmas tree lighting, showcasing Funan Mall\'s tech-savvy image.',
//     details: [
//       'LED-powered Christmas tree with interactive elements',
//       'Guests can control tree lighting patterns via a special app',
//       'Virtual reality "ornament hunt" around the hotel',
//       'Tech gadget showcase from Funan Mall partners',
//       '"Coding for Christmas" workshop for kids and adults',
//     ],
//   },
//   {
//     title: 'Sustainable Santa\'s Workshop',
//     date: 'Mid-December weekend',
//     description: 'An eco-friendly holiday event focusing on sustainable gifting and decorations.',
//     details: [
//       'Upcycling workshops to create holiday decorations',
//       'Sustainable gift-wrapping tutorials',
//       'Pop-up market featuring local eco-friendly brands',
//       '"Green Santa" photo booth with plantable photo frames',
//       'Workshop on creating digital holiday cards to reduce paper waste',
//     ],
//   },
// ]

// const localCulturalEvents = [
//   {
//     title: 'Singlish 101: Language & Laughter',
//     date: 'Bi-weekly, Thursday evenings',
//     description:
//       "An entertaining workshop on Singlish, Singapore's unique colloquial English.",
//     details: [
//       'Interactive Singlish lessons with local comedians or language experts',
//       'Role-playing games using Singlish phrases',
//       '"Translate the Singlish" competition with prizes',
//       'Singlish karaoke session',
//       'Complimentary local snacks and drinks',
//     ],
//   },
// ]

// const EventCard = ({ event, index, isOpen, toggle, onSelectEvent }) => {
//   return (
//     <CCard className="mb-4">
//       <CCardHeader onClick={() => toggle(index)} style={{ cursor: 'pointer' }}>
//         <strong>{event.title}</strong>
//         <small className="float-end">{event.date}</small>
//       </CCardHeader>
//       <CCollapse visible={isOpen}>
//         <CCardBody>
//           <p>{event.description}</p>
//           <ul>
//             {event.details.map((detail, idx) => (
//               <li key={idx}>{detail}</li>
//             ))}
//           </ul>
//           <CButton color="primary" onClick={() => onSelectEvent(event)}>
//             Select Event
//           </CButton>
//         </CCardBody>
//       </CCollapse>
//     </CCard>
//   )
// }

// const EventsPage = () => {
//   const [openEvent, setOpenEvent] = useState(null)
//   const [selectedEvent, setSelectedEvent] = useState(null)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [hostedEvents, setHostedEvents] = useState([])

//   const toggleEvent = (index) => {
//     setOpenEvent(openEvent === index ? null : index)
//   }

//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event) // Open the modal with the selected event
//   }

//   const handleHostEvent = () => {
//     const requestData = {
//       title: selectedEvent.title,  // Change "event" to "title"
//       date: selectedDate.toISOString(),  // Ensure correct date format
//       description: selectedEvent.description,
//       details: selectedEvent.details,
//     }

//     fetch('http://localhost:8002/host-event', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setHostedEvents([...hostedEvents, { ...selectedEvent, date: selectedDate }])
//         setSelectedEvent(null) // Close modal
//       })
//       .catch((error) => {
//         console.error('Error hosting event:', error)
//       })
//   }



//   // CSS class logic for highlighting the selected date
//   const tileClassName = ({ date, view }) => {
//     // Only add class to day view (exclude months, years)
//     if (view === 'month') {
//       if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
//         return 'highlighted-date' // Add custom class
//       }
//     }
//     return null
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <h1 className="text-center mb-4">Events to Host</h1>
//         <h2 className="mb-4">Themed Events</h2>
//         {themedEvents.map((event, index) => (
//           <EventCard
//             key={index}
//             event={event}
//             index={index}
//             isOpen={openEvent === index}
//             toggle={toggleEvent}
//             onSelectEvent={handleSelectEvent}
//           />
//         ))}

//         <h2 className="mb-4 mt-5">Local Cultural Events</h2>
//         {localCulturalEvents.map((event, index) => (
//           <EventCard
//             key={index + themedEvents.length}
//             event={event}
//             index={index + themedEvents.length}
//             isOpen={openEvent === index + themedEvents.length}
//             toggle={toggleEvent}
//             onSelectEvent={handleSelectEvent}
//           />
//         ))}

//         {/* Modal for event selection */}
//         {selectedEvent && (
//           <CModal visible={true} onClose={() => setSelectedEvent(null)}>
//             <CModalHeader>
//               <strong>{selectedEvent.title}</strong>
//             </CModalHeader>
//             <CModalBody color="primary">
//               <p>{selectedEvent.description}</p>
//               <h5>Select a date for the event:</h5>
//               <Calendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileClassName={tileClassName} // Apply CSS class for selected date
//               />
//             </CModalBody>
//             <CModalFooter>
//               <CButton color="primary" onClick={handleHostEvent}>
//                 Host Event
//               </CButton>
//               <CButton color="secondary" onClick={() => setSelectedEvent(null)}>
//                 Cancel
//               </CButton>
//             </CModalFooter>
//           </CModal>
//         )}
//       </CCol>
//     </CRow>
//   )
// }

// export default EventsPage


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
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './EventsPage.css' // Your custom CSS file for the calendar

const themedEvents = [
  {
    title: 'Festive Fusion Feast',
    date: 'Last weekend of November',
    description:
      'A community potluck event with a twist, celebrating Singapore\'s multicultural holiday traditions.',
    details: [
      'Guests bring dishes representing their cultural holiday traditions',
      'Hotel provides fusion dishes combining different cultural elements',
      'Live cooking stations for interactive experiences',
      'Recipe sharing and cooking tips exchange',
      'Festive decoration workshop using sustainable materials',
    ],
  },
  {
    title: 'Tech-mas Tree Lighting Ceremony',
    date: 'First weekend of December',
    description:
      'A high-tech twist on the traditional Christmas tree lighting, showcasing Funan Mall\'s tech-savvy image.',
    details: [
      'LED-powered Christmas tree with interactive elements',
      'Guests can control tree lighting patterns via a special app',
      'Virtual reality "ornament hunt" around the hotel',
      'Tech gadget showcase from Funan Mall partners',
      '"Coding for Christmas" workshop for kids and adults',
    ],
  },
  {
    title: 'Sustainable Santa\'s Workshop',
    date: 'Mid-December weekend',
    description: 'An eco-friendly holiday event focusing on sustainable gifting and decorations.',
    details: [
      'Upcycling workshops to create holiday decorations',
      'Sustainable gift-wrapping tutorials',
      'Pop-up market featuring local eco-friendly brands',
      '"Green Santa" photo booth with plantable photo frames',
      'Workshop on creating digital holiday cards to reduce paper waste',
    ],
  },
]

const localCulturalEvents = [
  {
    title: 'Singlish 101: Language & Laughter',
    date: 'Bi-weekly, Thursday evenings',
    description:
      "An entertaining workshop on Singlish, Singapore's unique colloquial English.",
    details: [
      'Interactive Singlish lessons with local comedians or language experts',
      'Role-playing games using Singlish phrases',
      '"Translate the Singlish" competition with prizes',
      'Singlish karaoke session',
      'Complimentary local snacks and drinks',
    ],
  },
]

// const EventCard = ({ event, index, isOpen, toggle, onSelectEvent }) => {
//   return (
//     <CCard className="mb-4">
//       <CCardHeader onClick={() => toggle(index)} style={{ cursor: 'pointer' }}>
//         <strong>{event.title}</strong>
//         <small className="float-end">{event.date}</small>
//       </CCardHeader>
//       <CCollapse visible={isOpen}>
//         <CCardBody>
//           <p>{event.description}</p>
//           <ul>
//             {event.details.map((detail, idx) => (
//               <li key={idx}>{detail}</li>
//             ))}
//           </ul>
//           <CButton color="primary" onClick={() => onSelectEvent(event)}>
//             Select Event
//           </CButton>
//         </CCardBody>
//       </CCollapse>
//     </CCard>
//   )
// }

// const EventsPage = () => {
//   const [openEvent, setOpenEvent] = useState(null)
//   const [selectedEvent, setSelectedEvent] = useState(null)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [hostedEvents, setHostedEvents] = useState([])
//   const [availableThemedEvents, setAvailableThemedEvents] = useState([])
//   const [availableLocalEvents, setAvailableLocalEvents] = useState([])

//   useEffect(() => {
//     fetch('http://localhost:8002/hosted-events')
//       .then((response) => response.json())
//       .then((data) => {
//         setHostedEvents(data)
//         const hostedTitles = data.map(event => event.title)

//         setAvailableThemedEvents(themedEvents.filter(
//           event => !hostedTitles.includes(event.title)
//         ))

//         setAvailableLocalEvents(localCulturalEvents.filter(
//           event => !hostedTitles.includes(event.title)
//         ))
//       })
//       .catch((error) => {
//         console.error('Error fetching hosted events:', error)
//       })
//   }, [])

//   const toggleEvent = (index) => {
//     setOpenEvent(openEvent === index ? null : index)
//   }

//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event)
//   }

//   const handleHostEvent = () => {
//     const requestData = {
//       title: selectedEvent.title,
//       date: selectedDate.toISOString(),
//       description: selectedEvent.description,
//       details: selectedEvent.details,
//     }

//     fetch('http://localhost:8002/host-event', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setAvailableThemedEvents(availableThemedEvents.filter(event => event.title !== selectedEvent.title))
//         setAvailableLocalEvents(availableLocalEvents.filter(event => event.title !== selectedEvent.title))
//         setHostedEvents([...hostedEvents, { ...selectedEvent, date: selectedDate }])
//         setSelectedEvent(null)
//       })
//       .catch((error) => {
//         console.error('Error hosting event:', error)
//       })
//   }

//   const tileClassName = ({ date, view }) => {
//     if (view === 'month' && selectedDate && date.toDateString() === selectedDate.toDateString()) {
//       return 'highlighted-date'
//     }
//     return null
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <h1 className="text-center mb-4">Events to Host</h1>

//         <h2 className="mb-4">Themed Events</h2>
//         {availableThemedEvents.length === 0 && <p>No themed events available to host.</p>}
//         {availableThemedEvents.map((event, index) => (
//           <EventCard
//             key={index}
//             event={event}
//             index={index}
//             isOpen={openEvent === index}
//             toggle={toggleEvent}
//             onSelectEvent={handleSelectEvent}
//           />
//         ))}

//         <h2 className="mb-4 mt-5">Local Cultural Events</h2>
//         {availableLocalEvents.length === 0 && <p>No local cultural events available to host.</p>}
//         {availableLocalEvents.map((event, index) => (
//           <EventCard
//             key={index + availableThemedEvents.length}
//             event={event}
//             index={index + availableThemedEvents.length}
//             isOpen={openEvent === index + availableThemedEvents.length}
//             toggle={toggleEvent}
//             onSelectEvent={handleSelectEvent}
//           />
//         ))}

//         {/* Modal for event selection */}
//         {selectedEvent && (
//           <CModal visible={true} onClose={() => setSelectedEvent(null)}>
//             <CModalHeader>
//               <strong>{selectedEvent.title}</strong>
//             </CModalHeader>
//             <CModalBody color="primary">
//               <p>{selectedEvent.description}</p>
//               <h5>Select a date for the event:</h5>
//               <Calendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileClassName={tileClassName}
//               />
//             </CModalBody>
//             <CModalFooter>
//               <CButton color="primary" onClick={handleHostEvent}>
//                 Host Event
//               </CButton>
//               <CButton color="secondary" onClick={() => setSelectedEvent(null)}>
//                 Cancel
//               </CButton>
//             </CModalFooter>
//           </CModal>
//         )}
//       </CCol>
//     </CRow>
//   )
// }

// export default EventsPage

const EventCard = ({ event, index, isOpen, toggle, onSelectEvent }) => {
  return (
    <div className="event-card">
      <div className="event-card-header" onClick={() => toggle(index)}>
        <strong style={{ fontWeight: 'normal' }} onMouseOver={(e) => e.currentTarget.style.fontWeight = 'bold'} onMouseOut={(e) => e.currentTarget.style.fontWeight = 'normal'}>
          {event.title}
        </strong>
        <small className="float-end" style={{ color: 'black' }}>{event.date}</small>
      </div>
      <CCollapse visible={isOpen}>
        <div className="event-card-body">
          <p>{event.description}</p>
          <ul>
            {event.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
          <CButton color="primary" onClick={() => onSelectEvent(event)}>
            Select Event
          </CButton>
        </div>
      </CCollapse>
    </div>
  );
};


const EventsPage = () => {
  const [openEvent, setOpenEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hostedEvents, setHostedEvents] = useState([])
  const [availableThemedEvents, setAvailableThemedEvents] = useState([])
  const [availableLocalEvents, setAvailableLocalEvents] = useState([])

  // State for custom themed event modal
  const [customThemedEvent, setCustomThemedEvent] = useState({
    title: '',
    date: '',
    description: '',
    details: '',
  })
  const [showCustomEventModal, setShowCustomEventModal] = useState(false)

  // State for custom cultural event modal
  const [customCulturalEvent, setCustomCulturalEvent] = useState({
    title: '',
    date: '',
    description: '',
    details: '',
  })
  const [showCustomCulturalEventModal, setShowCustomCulturalEventModal] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8002/hosted-events')
      .then((response) => response.json())
      .then((data) => {
        setHostedEvents(data)
        const hostedTitles = data.map(event => event.title)

        setAvailableThemedEvents(themedEvents.filter(
          event => !hostedTitles.includes(event.title)
        ))

        setAvailableLocalEvents(localCulturalEvents.filter(
          event => !hostedTitles.includes(event.title)
        ))
      })
      .catch((error) => {
        console.error('Error fetching hosted events:', error)
      })
  }, [])

  const toggleEvent = (index) => {
    setOpenEvent(openEvent === index ? null : index)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
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
        setAvailableThemedEvents(availableThemedEvents.filter(event => event.title !== selectedEvent.title))
        setAvailableLocalEvents(availableLocalEvents.filter(event => event.title !== selectedEvent.title))
        setHostedEvents([...hostedEvents, { ...selectedEvent, date: selectedDate }])
        setSelectedEvent(null)
      })
      .catch((error) => {
        console.error('Error hosting event:', error)
      })
  }

  const handleAddCustomEvent = () => {
    const requestData = {
      title: customThemedEvent.title,
      date: customThemedEvent.date,
      description: customThemedEvent.description,
      details: customThemedEvent.details.split(',').map(detail => detail.trim()), // Convert details to an array
    }

    fetch('http://localhost:8002/add-custom-themed-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the custom themed event to available events
        setAvailableThemedEvents([...availableThemedEvents, requestData])
        setShowCustomEventModal(false) // Close the modal
        setCustomThemedEvent({ title: '', date: '', description: '', details: '' }) // Reset the form
      })
      .catch((error) => {
        console.error('Error adding custom themed event:', error)
      })
  }

  const handleAddCustomCulturalEvent = () => {
    const requestData = {
      title: customCulturalEvent.title,
      date: customCulturalEvent.date,
      description: customCulturalEvent.description,
      details: customCulturalEvent.details.split(',').map(detail => detail.trim()), // Convert details to an array
    }

    fetch('http://localhost:8002/add-custom-cultural-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the custom cultural event to available events
        setAvailableLocalEvents([...availableLocalEvents, requestData])
        setShowCustomCulturalEventModal(false) // Close the modal
        setCustomCulturalEvent({ title: '', date: '', description: '', details: '' }) // Reset the form
      })
      .catch((error) => {
        console.error('Error adding custom cultural event:', error)
      })
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'highlighted-date'
    }
    return null
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h1 className="text-center mb-4">Events to Host</h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Themed Events</h2>
          <CButton className="button-custom" onClick={() => setShowCustomEventModal(true)}>
            Host Custom Themed Event
          </CButton>
        </div>

        <div className="card-container">
          {availableThemedEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              index={index}
              isOpen={openEvent === index}
              toggle={toggleEvent}
              onSelectEvent={handleSelectEvent}
            />
          ))}
        </div>


        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h2 className="mb-0">Local Cultural Events</h2>
          <CButton className="button-custom" onClick={() => setShowCustomCulturalEventModal(true)}>
            Host Custom Cultural Event
          </CButton>
        </div>

        {availableLocalEvents.length === 0 && <p>No local cultural events available to host.</p>}
        {availableLocalEvents.map((event, index) => (
          <EventCard
            key={index + availableThemedEvents.length}
            event={event}
            index={index + availableThemedEvents.length}
            isOpen={openEvent === index + availableThemedEvents.length}
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
                tileClassName={tileClassName}
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

        {/* Modal for Custom Themed Event */}
        <CModal visible={showCustomEventModal} onClose={() => setShowCustomEventModal(false)}>
          <CModalHeader>
            <strong>Host Custom Themed Event</strong>
          </CModalHeader>
          <CModalBody>
            <CFormLabel>Title</CFormLabel>
            <CFormInput
              value={customThemedEvent.title}
              onChange={(e) => setCustomThemedEvent({ ...customThemedEvent, title: e.target.value })}
            />
            <CFormLabel>Date</CFormLabel>
            <CFormInput
              type="date"
              value={customThemedEvent.date}
              onChange={(e) => setCustomThemedEvent({ ...customThemedEvent, date: e.target.value })}
            />
            <CFormLabel>Description</CFormLabel>
            <CFormInput
              value={customThemedEvent.description}
              onChange={(e) => setCustomThemedEvent({ ...customThemedEvent, description: e.target.value })}
            />
            <CFormLabel>Details (comma-separated)</CFormLabel>
            <CFormInput
              value={customThemedEvent.details}
              onChange={(e) => setCustomThemedEvent({ ...customThemedEvent, details: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleAddCustomEvent}>
              Host Custom Event
            </CButton>
            <CButton color="secondary" onClick={() => setShowCustomEventModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal for Custom Cultural Event */}
        <CModal visible={showCustomCulturalEventModal} onClose={() => setShowCustomCulturalEventModal(false)}>
          <CModalHeader>
            <strong>Host Custom Cultural Event</strong>
          </CModalHeader>
          <CModalBody>
            <CFormLabel>Title</CFormLabel>
            <CFormInput
              value={customCulturalEvent.title}
              onChange={(e) => setCustomCulturalEvent({ ...customCulturalEvent, title: e.target.value })}
            />
            <CFormLabel>Date</CFormLabel>
            <CFormInput
              type="date"
              value={customCulturalEvent.date}
              onChange={(e) => setCustomCulturalEvent({ ...customCulturalEvent, date: e.target.value })}
            />
            <CFormLabel>Description</CFormLabel>
            <CFormInput
              value={customCulturalEvent.description}
              onChange={(e) => setCustomCulturalEvent({ ...customCulturalEvent, description: e.target.value })}
            />
            <CFormLabel>Details (comma-separated)</CFormLabel>
            <CFormInput
              value={customCulturalEvent.details}
              onChange={(e) => setCustomCulturalEvent({ ...customCulturalEvent, details: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleAddCustomCulturalEvent}>
              Host Custom Cultural Event
            </CButton>
            <CButton color="secondary" onClick={() => setShowCustomCulturalEventModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default EventsPage