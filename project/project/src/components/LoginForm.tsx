import React, { useEffect, useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [admin, setAdmin] = useState({ username: '', password: '' });
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '363745650076-ug72jrlij6q2u52ik48gdicqjg6darv6.apps.googleusercontent.com',
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          shape: 'pill',
          text: 'signin_with',
        }
      );
    }
  }, []);

  // Extract department from emails like example.ag23@bitsathy.ac.in
  const getDepartmentFromEmail = (email: string): string => {
    const match = email.match(/\.(\w{2,3})\d{2}@bitsathy\.ac\.in$/);
    const deptCode = match?.[1]?.toLowerCase();

    switch (deptCode) {
      case 'cs': return 'CSE';
      case 'ec': return 'ECE';
      case 'ee': return 'EEE';
      case 'me': return 'MECH';
      case 'ce': return 'CIVIL';
      case 'ag': return 'AGRI';
      case 'it': return 'IT';
      case 'bt': return 'BIOTECH';
      case 'ai': return 'AI&DS';
      default: return 'Others';
    }
  };

  const handleGoogleSignIn = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const email = payload.email;
      const name = payload.name;
      const avatar = payload.picture;

      const domain = email.split('@')[1];
      if (domain !== 'bitsathy.ac.in') {
        alert('Only bitsathy.ac.in emails are allowed.');
        return;
      }

      const department = getDepartmentFromEmail(email);

      login({
        name,
        email,
        department,
        avatar,
      });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);

    setTimeout(() => {
      if (admin.username === 'admin' && admin.password === 'admin123') {
        login({
          name: 'Administrator',
          email: 'admin@smartnotes.edu',
          department: 'ADMIN',
          avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        });
      } else {
        alert('Invalid admin credentials');
      }
      setIsAdminLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Smart Notes 📓 Smarter You ⚡</h2>
        <p className="text-sm text-gray-600 text-center">Admin or Student Login</p>

        {/* Admin Login */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Admin Username"
              value={admin.username}
              onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={admin.password}
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isAdminLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            {isAdminLoading ? (
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
            ) : (
              <>Login as Admin</>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Google Sign-In */}
        <div id="google-signin-button" className="flex justify-center" />

        <p className="text-xs text-gray-500 text-center pt-4">
          Admins use credentials. Students login with Google (bitsathy.ac.in)<br />
          <span className="text-blue-500 font-semibold">Powered by TEAM WEXLER</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
