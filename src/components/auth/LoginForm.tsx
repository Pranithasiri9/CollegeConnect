import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  error = null
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 rounded-md bg-error-50 text-error-700">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            type="text"
            className="form-input pl-10"
            placeholder="Enter your username"
            {...register('username', { required: 'Username is required' })}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-error-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            className="form-input pl-10"
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required' })}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;