import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading?: boolean;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  student_id: string; // changed from studentId
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            className="form-input pl-10"
            placeholder="Enter your full name"
            {...register('name', { required: 'Full name is required' })}
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            className="form-input pl-10"
            placeholder="Enter your email address"
            {...register('email', { 
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              }
            })}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            type="tel"
            className="form-input pl-10"
            placeholder="Enter your phone number"
            {...register('phone', { required: 'Phone number is required' })}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="student_id" className="form-label">
          Student ID
        </label>
        <input
          id="student_id"
          type="text"
          className="form-input"
          placeholder="Enter your student ID"
          {...register('student_id', { required: 'Student ID is required' })} // changed from studentId
        />
        {errors.student_id && (
          <p className="mt-1 text-sm text-error-600">{errors.student_id.message}</p>
        )}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register for this Event'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;