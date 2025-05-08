import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, User, ArrowLeft } from 'lucide-react';
import { getConfirmation } from '../utils/api';
import toast from 'react-hot-toast';

interface RegistrationDetails {
  id: string;
  event: {
    id: string;
    name: string;
    datetime: string;
    category: string;
    location?: string; // add location
  };
  user: {
    name: string;
    email: string;
    student_id: string;
    phone?: string; // ensure phone is included
  };
  registrationDate: string;
}

const RegistrationConfirmationPage: React.FC = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<RegistrationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (registrationId) {
      fetchRegistrationDetails(registrationId);
    }
  }, [registrationId]);

  const fetchRegistrationDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await getConfirmation(id);
      setRegistration(data);
    } catch (error) {
      console.error('Error fetching registration details:', error);
      toast.error('Failed to load registration details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-pulse-slow">Loading registration details...</div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration not found</h2>
        <p className="text-gray-600 mb-8">
          The registration details you're looking for don't exist or have been removed.
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

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center text-gray-700 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 text-white p-6 text-center">
            <div className="inline-flex items-center justify-center bg-white text-primary-600 h-12 w-12 rounded-full mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Registration Confirmed!</h1>
            <p className="mt-2">You're all set for the event</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Event Name</h3>
                    <p className="text-2xl font-bold">{registration.event.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Date & Time</h3>
                    <p className="text-xl font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(registration.event.datetime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Location</h3>
                    <p className="text-xl font-semibold">{registration.event.location || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Category</h3>
                    <p className="text-xl font-semibold">{registration.event.category}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Registrant</h3>
                    <div className="space-y-1">
                      <p className="flex items-center text-2xl font-bold">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        {registration.user.name}
                      </p>
                      <p className="text-lg font-semibold">{registration.user.email}</p>
                      <p className="text-lg font-semibold">Student ID: {registration.user.student_id}</p>
                      {registration.user.phone && (
                        <p className="text-lg font-semibold">Phone: {registration.user.phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Registration ID</h3>
                    <p className="font-mono text-base">{registration.id}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => window.print()}
                className="btn-secondary"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmationPage;