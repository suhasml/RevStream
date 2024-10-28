import React, { useState } from 'react';
import { Calendar, Users, Sparkles, Trophy, BookOpen, Rocket, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import './AdminEventsDashboard.css';

const AdminEventsDashboard = () => {
  const [events] = useState([
    {
      id: 1,
      type: 'fan-meetup',
      title: 'Tech Influencer Meetup 2024',
      date: '2024-11-15',
      duration: '1 day',
      fee: 49.99,
      location: 'Grand Ballroom',
      capacity: 200,
      description: 'Meet your favorite tech influencers and join exclusive networking sessions',
      perks: ['Photo opportunities', 'Exclusive merchandise', 'VIP dinner'],
      roomDiscount: false
    },
    {
      id: 2,
      type: 'community',
      title: 'BookLovers Convention',
      date: '2024-12-01',
      duration: '2 days',
      fee: 29.99,
      location: 'Library Hall',
      capacity: 150,
      description: 'Join fellow book enthusiasts for readings, discussions, and author meetups',
      perks: ['Author signatures', 'Book swaps', 'Reading workshops'],
      roomDiscount: false
    },
    {
      id: 3,
      type: 'startup',
      title: 'Innovation Summit 2024',
      date: '2024-12-15',
      duration: '3 days',
      fee: 299.99,
      location: 'Convention Center',
      capacity: 500,
      description: 'Connect with investors, showcase your startup, and attend masterclasses',
      perks: ['Investor pitching', '50% room discount', 'Networking dinners'],
      roomDiscount: true
    },
    {
      id: 4,
      type: 'regular',
      title: 'Startup Hub Weekly',
      date: 'Every Thursday',
      duration: '3 hours',
      fee: 0,
      location: 'Coworking Space',
      capacity: 50,
      description: 'Weekly meetup for entrepreneurs to share ideas and collaborate',
      perks: ['Free mentoring', 'Coffee & snacks', 'Coworking access'],
      roomDiscount: false
    }
  ]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'fan-meetup': return <Users className="w-12 h-12 text-purple-500" />;
      case 'community': return <BookOpen className="w-12 h-12 text-blue-500" />;
      case 'startup': return <Rocket className="w-12 h-12 text-red-500" />;
      case 'regular': return <Calendar className="w-12 h-12 text-green-500" />;
      default: return <Sparkles className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1 className="header-title">Exclusive Community Events</h1>
        <Trophy className="header-icon" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div>
                <p className="event-type">{event.type.replace('-', ' ')}</p>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{event.date} • {event.duration}</p>
              </div>
              {getEventIcon(event.type)}
            </div>
            <div className="event-description">
              <p>{event.description}</p>
              <div className="event-info">
                <div className="info-item">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{event.capacity} spots</span>
                </div>
                <div className="info-item">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>{event.fee === 0 ? 'Free Entry' : `$${event.fee}`}</span>
                </div>
              </div>
              <div className="discount-info">
                {event.roomDiscount ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>
                  {event.roomDiscount ? 'Room Discount Available' : 'No Room Discount'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsDashboard;