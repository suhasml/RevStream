import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import LoginNavbar from 'components/login-navbar/LoginNavbar';

const UserEventsView = () => {
  const [events, setEvents] = useState([]);
  const [socialMediaEvents, setSocialMediaEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '',
    description: '',
    details: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = () => {
    fetch('http://localhost:8002/hosted-events')
      .then(response => response.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching events:', error));

    fetch('http://localhost:8002/ongoing-sme-campaigns')
      .then(response => response.json())
      .then(data => setSocialMediaEvents(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching social media events:', error));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8002/requested-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEventForm),
    })
      .then(response => {
        if (response.ok) {
          setIsDialogOpen(false);
          setNewEventForm({
            title: '',
            date: '',
            description: '',
            details: ''
          });
          alert('Event request submitted successfully!');
        } else {
          throw new Error('Failed to submit event request');
        }
      })
      .catch(error => console.error('Error submitting event:', error));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <LoginNavbar />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Community Events</h1>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Request to Host Event
          </button>
        </div>

        {/* Event Request Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              {/* Event Request Form */}
              {/* ... Form contents remain the same */}
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.length === 0 ? (
              <p className="text-gray-500">No upcoming events at the moment.</p>
            ) : (
              events.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event)}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Social Media Campaigns Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Social Media Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialMediaEvents.length === 0 ? (
              <p className="text-gray-500">No social media campaigns at the moment.</p>
            ) : (
              socialMediaEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event)}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  {event.hashtag && (
                    <p className="mt-2 text-sm font-medium text-blue-500">
                      Hashtag to post with: #{event.hashtag}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Modal for Expanded Event Details */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-2">{selectedEvent.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {formatDate(selectedEvent.date)}
              </p>
              <p className="text-gray-700">{selectedEvent.description}</p>
              {selectedEvent.details && (
                <p className="mt-2 text-sm text-gray-600">{selectedEvent.details}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserEventsView;
