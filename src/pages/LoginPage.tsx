import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm, { LoginFormData } from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.username, data.password);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Lock className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;