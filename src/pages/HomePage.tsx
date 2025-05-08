import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import EventCategorySection from '../components/events/EventCategorySection';
import { getEvents, deleteEvent } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: string;
  name: string;
  description: string;
  datetime: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event. Please try again.');
      }
    }
  };

  // Group events by category
  const eventsByCategory = events.reduce<{ [key: string]: Event[] }>((acc, event) => {
    const category = event.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              College Events Registration
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
              Discover, register, and participate in the best events happening on campus. Never miss out on exciting opportunities!
            </p>
            <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50">
              <Calendar className="h-5 w-5 mr-2" />
              <a href="#events">Browse Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="events" className="py-12">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-16">
            <div className="animate-pulse-slow">Loading events...</div>
          </div>
        ) : (
          <div>
            {Object.keys(eventsByCategory).length === 0 ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No events found</h2>
                <p className="text-gray-600">
                  There are currently no events scheduled. Please check back later.
                </p>
                {isAuthenticated && (
                  <div className="mt-8">
                    <a href="/admin/create-event" className="btn-primary">
                      Create New Event
                    </a>
                  </div>
                )}
              </div>
            ) : (
              Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
                <EventCategorySection
                  key={category}
                  title={category}
                  events={categoryEvents}
                  onDeleteEvent={isAuthenticated ? handleDeleteEvent : undefined}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;