import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEvents, deleteEvent } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: string;
  name: string;
  description: string;
  datetime: string;
  category: string;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
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

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse-slow">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/admin/create-event')}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
            <p className="mt-1 text-sm text-gray-600">
              View, edit, or delete events you've created
            </p>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse-slow">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-gray-500">
                Get started by creating your first event.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/create-event')}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Event
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => {
                    const eventDate = new Date(event.datetime);
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' : 
                              event.category === 'Sports' ? 'bg-green-100 text-green-800' : 
                              event.category === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eventDate.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-error-600 hover:text-error-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;