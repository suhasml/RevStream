// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from 'components/ui/card/Card';
// import { Calendar, Users, Sparkles, Trophy, BookOpen, Rocket, DollarSign } from 'lucide-react';

// const ExclusiveEventsDashboard = () => {
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const events = [
//     {
//       id: 1,
//       type: 'fan-meetup',
//       title: 'Tech Influencer Meetup 2024',
//       date: '2024-11-15',
//       duration: '1 day',
//       fee: 49.99,
//       location: 'Grand Ballroom',
//       capacity: 200,
//       description: 'Meet your favorite tech influencers and join exclusive networking sessions',
//       perks: ['Photo opportunities', 'Exclusive merchandise', 'VIP dinner']
//     },
//     {
//       id: 2,
//       type: 'community',
//       title: 'BookLovers Convention',
//       date: '2024-12-01',
//       duration: '2 days',
//       fee: 29.99,
//       location: 'Library Hall',
//       capacity: 150,
//       description: 'Join fellow book enthusiasts for readings, discussions, and author meetups',
//       perks: ['Author signatures', 'Book swaps', 'Reading workshops']
//     },
//     {
//       id: 3,
//       type: 'startup',
//       title: 'Innovation Summit 2024',
//       date: '2024-12-15',
//       duration: '3 days',
//       fee: 299.99,
//       location: 'Convention Center',
//       capacity: 500,
//       description: 'Connect with investors, showcase your startup, and attend masterclasses',
//       perks: ['Investor pitching', '50% room discount', 'Networking dinners']
//     },
//     {
//       id: 4,
//       type: 'regular',
//       title: 'Startup Hub Weekly',
//       date: 'Every Thursday',
//       duration: '3 hours',
//       fee: 0,
//       location: 'Coworking Space',
//       capacity: 50,
//       description: 'Weekly meetup for entrepreneurs to share ideas and collaborate',
//       perks: ['Free mentoring', 'Coffee & snacks', 'Coworking access']
//     }
//   ];

//   const getEventIcon = (type) => {
//     switch (type) {
//       case 'fan-meetup': return <Users className="w-12 h-12 text-purple-500" />;
//       case 'community': return <BookOpen className="w-12 h-12 text-blue-500" />;
//       case 'startup': return <Rocket className="w-12 h-12 text-red-500" />;
//       case 'regular': return <Calendar className="w-12 h-12 text-green-500" />;
//       default: return <Sparkles className="w-12 h-12 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-3xl font-bold">Exclusive Member Events</h1>
//         <Trophy className="w-8 h-8 text-yellow-500" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//         {events.map((event) => (
//           <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
//             <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
//                     {event.type.replace('-', ' ')}
//                   </p>
//                   <h3 className="text-xl font-bold mb-2">{event.title}</h3>
//                   <p className="text-gray-600">{event.date} • {event.duration}</p>
//                 </div>
//                 {getEventIcon(event.type)}
//               </div>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="mb-4">
//                 <p className="text-gray-600">{event.description}</p>
//               </div>
              
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {event.perks.map((perk, index) => (
//                   <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                     {perk}
//                   </span>
//                 ))}
//               </div>
              
//               <div className="flex justify-between items-center mt-4">
//                 <div className="flex items-center space-x-2">
//                   <Users className="w-5 h-5 text-gray-400" />
//                   <span className="text-gray-600">{event.capacity} spots</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <DollarSign className="w-5 h-5 text-gray-400" />
//                   <span className="text-gray-600">
//                     {event.fee === 0 ? 'Free' : `$${event.fee}`}
//                   </span>
//                 </div>
//               </div>
              
//               <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
//                 Register Now
//               </button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
//         <h2 className="text-xl font-bold mb-4">Upcoming Regular Meetups</h2>
//         <div className="flex flex-wrap gap-4">
//           {['Mon', 'Wed', 'Thu'].map((day) => (
//             <div key={day} className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="flex items-center space-x-3">
//                 <Calendar className="w-5 h-5 text-gray-400" />
//                 <span className="font-medium">{day}</span>
//                 <span className="text-gray-500">•</span>
//                 <span className="text-gray-600">Startup Hub</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExclusiveEventsDashboard;

import React, { useState } from 'react';
import { Calendar, Users, Sparkles, Trophy, BookOpen, Rocket, DollarSign, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Exclusive Community Events</h1>
        <Trophy className="w-8 h-8 text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    {event.type.replace('-', ' ')}
                  </p>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600">{event.date} • {event.duration}</p>
                </div>
                {getEventIcon(event.type)}
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600">{event.description}</p>
              </div>

              {/* Event Type and Entry Info */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{event.capacity} spots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {event.fee === 0 ? 'Free Entry' : `$${event.fee}`}
                  </span>
                </div>
              </div>

              {/* Room Discount Information */}
              <div className="flex items-center mt-4 space-x-2">
                {event.roomDiscount ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-600">
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
