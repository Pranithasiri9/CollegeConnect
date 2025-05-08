import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getEvent, registerForEvent, getEventRegistrations } from '../utils/api';
import RegistrationForm, { RegistrationFormData } from '../components/registration/RegistrationForm';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: string;
  name: string;
  description: string;
  datetime: string;
  category: string;
  location?: string;
}

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Filtering/searching state
  const [search, setSearch] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    // Filter registrations by search
    if (!search) {
      setFilteredRegistrations(registrations);
    } else {
      const lower = search.toLowerCase();
      setFilteredRegistrations(
        registrations.filter((reg) =>
          reg.user.name.toLowerCase().includes(lower) ||
          reg.user.email.toLowerCase().includes(lower) ||
          reg.user.student_id.toLowerCase().includes(lower) ||
          reg.user.phone.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, registrations]);

  const fetchEventDetails = async (id: string) => {
    try {
      setLoading(true);
      const eventData = await getEvent(id);
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData: RegistrationFormData) => {
    if (!eventId) return;
    
    try {
      setRegistering(true);
      const response = await registerForEvent(eventId, formData);
      toast.success('Registration successful!');
      navigate(`/confirmation/${response.registration_id}`);
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleViewRegistrations = async () => {
    if (!eventId) return;
    setLoadingRegistrations(true);
    try {
      const data = await getEventRegistrations(eventId);
      setRegistrations(data);
      setShowRegistrations(true);
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // CSV export helper
  const handleDownloadCSV = () => {
    if (!filteredRegistrations.length) return;
    const header = ['S. No.', 'Name', 'Email', 'Student ID', 'Phone', 'Registration Date'];
    const rows = filteredRegistrations.map((reg, idx) => [
      idx + 1,
      `"${reg.user.name.replace(/"/g, '""')}"`,
      `"${reg.user.email.replace(/"/g, '""')}"`,
      `"${reg.user.student_id.replace(/"/g, '""')}"`,
      `"${reg.user.phone.replace(/"/g, '""')}"`,
      `"${new Date(reg.registration_date).toLocaleString().replace(/"/g, '""')}"`
    ]);
    const csvContent =
      [header, ...rows]
        .map((row) => row.join(','))
        .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'event'}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-pulse-slow">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  // Format event date and time
  const eventDate = new Date(event.datetime);
  const formattedDate = format(eventDate, 'MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center text-gray-700 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
              ${event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' : 
                event.category === 'Sports' ? 'bg-green-100 text-green-800' : 
                event.category === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'}`}
            >
              {event.category}
            </span>
            
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{event.name}</h1>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-600 mr-2" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>
            
            <div className="mt-8">
              {isAuthenticated ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleViewRegistrations}
                    className="btn-primary inline-flex items-center"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    View Registrations
                  </button>
                </div>
              ) : (
                showRegistrationForm ? (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Register for this Event</h2>
                    <RegistrationForm onSubmit={handleRegistration} isLoading={registering} />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowRegistrationForm(true)}
                      className="btn-primary inline-flex items-center"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Register Now
                    </button>
                  </div>
                )
              )}
            </div>
            {showRegistrations && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowRegistrations(false)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    Registrations
                    <button
                      onClick={handleDownloadCSV}
                      className="ml-auto btn-secondary flex items-center"
                      title="Download CSV"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download CSV
                    </button>
                  </h3>
                  <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
                    <input
                      type="text"
                      className="form-input mb-2 md:mb-0"
                      placeholder="Search by name, email, student ID, phone..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <span className="text-sm text-gray-500 mt-1 md:mt-0">
                      Showing {filteredRegistrations.length} of {registrations.length}
                    </span>
                  </div>
                  {loadingRegistrations ? (
                    <div>Loading...</div>
                  ) : filteredRegistrations.length === 0 ? (
                    <div>No registrations found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S. No.</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRegistrations.map((reg, idx) => (
                            <tr key={reg.registration_id}>
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{reg.user.name}</td>
                              <td className="px-4 py-2">{reg.user.email}</td>
                              <td className="px-4 py-2">{reg.user.student_id}</td>
                              <td className="px-4 py-2">{reg.user.phone}</td>
                              <td className="px-4 py-2">{new Date(reg.registration_date).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;