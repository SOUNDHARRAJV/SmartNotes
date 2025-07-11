import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, User, Building, BookOpen } from 'lucide-react';
import { Department } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '' as Department,
    customDepartment: '',
  });

  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AGRI', 'IT', 'BIOTECH', 'Department'];

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '363745650076-ug72jrlij6q2u52ik48gdicqjg6darv6.apps.googleusercontent.com',
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
      });
    }
  }, []);

  const handleGoogleSignIn = (response: any) => {
    setIsLoading(true);
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = payload.email;
      const name = payload.name;
      const avatar = payload.picture;

      // Domain restriction
      const domain = email.split('@')[1];
      if (domain !== 'bitsathy.ac.in') {
        alert('Only bitsathy.ac.in emails are allowed.');
        return;
      }

     const prefix = email.split('@')[0].toLowerCase();
const departmentCodeMatch = prefix.match(/(cs|ec|ag|ee|me|ce|it|bt)/);
const departmentCode = departmentCodeMatch ? departmentCodeMatch[0] : '';

const departmentMap: Record<string, Department> = {
  ag: 'AGRI',
  cs: 'CSE',
  ec: 'ECE',
  ee: 'EEE',
  me: 'MECH',
  ce: 'CIVIL',
  it: 'IT',
  bt: 'BIOTECH',
};

const department = departmentMap[departmentCode] || 'Others';

      console.log('Email:', email, '| Prefix:', prefix, '| Dept Code:', departmentCode, '| Dept:', department);

      login({
        name,
        email,
        department,
        avatar,
      });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setShowManualForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        name: formData.name,
        email: formData.email,
        department:
          formData.department === 'Others' && formData.customDepartment
            ? formData.customDepartment
            : formData.department,
        customDepartment:
          formData.department === 'Others' ? formData.customDepartment : undefined,
        avatar:
          'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Smart Notes</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your student portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {!showManualForm ? (
            <>
              <div className="flex justify-center">
                <div id="google-signin-button"></div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with demo</span>
                </div>
              </div>

              <button
                onClick={() => setShowManualForm(true)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Use Demo Login
              </button>
            </>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-3 text-gray-400" />
                  <select
                    id="department"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value as Department,
                        customDepartment: e.target.value !== 'Others' ? '' : formData.customDepartment,
                      })
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="">Select your department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.department === 'Others' && (
                <div>
                  <label htmlFor="customDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                    Specify Department
                  </label>
                  <input
                    id="customDepartment"
                    type="text"
                    required
                    value={formData.customDepartment}
                    onChange={(e) => setFormData({ ...formData, customDepartment: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your department"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to Google Sign-In
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Secure authentication powered by Google OAuth 2.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;