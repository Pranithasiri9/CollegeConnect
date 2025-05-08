import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import EventForm, { EventFormData } from '../components/events/EventForm';
import { createEvent } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCreateEvent = async (formData: EventFormData) => {
    try {
      setIsSubmitting(true);
      await createEvent(formData); // formData now includes location
      toast.success('Event created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse-slow">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/admin')}
          className="mb-8 inline-flex items-center text-gray-700 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <CalendarPlus className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details to create a new event for students to register
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <EventForm onSubmit={handleCreateEvent} isLoading={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;