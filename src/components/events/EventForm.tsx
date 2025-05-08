import React from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Clock, Tag, MapPin } from 'lucide-react';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export interface EventFormData {
  name: string;
  description: string;
  datetime: string;
  category: string;
  location?: string; // added
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="form-label">
          Event Name
        </label>
        <input
          id="name"
          type="text"
          className="form-input"
          placeholder="Enter event name"
          {...register('name', { required: 'Event name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="form-input"
          placeholder="Enter event description"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="form-label flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Venue / Location
        </label>
        <input
          id="location"
          type="text"
          className="form-input"
          placeholder="Enter venue or location"
          {...register('location', { required: 'Venue is required' })}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="datetime" className="form-label flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Date and Time
          </label>
          <input
            id="datetime"
            type="datetime-local"
            className="form-input"
            {...register('datetime', { required: 'Date and time are required' })}
          />
          {errors.datetime && (
            <p className="mt-1 text-sm text-error-600">{errors.datetime.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="form-label flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Category
          </label>
          <select
            id="category"
            className="form-select"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Technical">Technical</option>
            <option value="Academic">Academic</option>
            <option value="Social">Social</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;