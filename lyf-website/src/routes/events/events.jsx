import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Events</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Request to Host Event
        </button>
      </div>

      {/* Event Request Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request to Host an Event</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEventForm.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newEventForm.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newEventForm.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={newEventForm.details}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Events Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-4">
          {events.length === 0 ? (
            <p className="text-gray-500">No upcoming events at the moment.</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                </div>
                <div className="px-6 py-4">
                  <p className="text-gray-700">{event.description}</p>
                  {event.details && (
                    <p className="mt-2 text-sm text-gray-600">{event.details}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Social Media Campaigns Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Social Media Campaigns</h2>
        <div className="grid gap-4">
          {socialMediaEvents.length === 0 ? (
            <p className="text-gray-500">No social media campaigns at the moment.</p>
          ) : (
            socialMediaEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-gray-700">{event.description}</p>
                  {event.hashtag && (
                    <p className="mt-2 text-sm font-medium text-blue-500">Hastag to post with: #{event.hashtag}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default UserEventsView;