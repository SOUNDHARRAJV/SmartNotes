import React, { useEffect, useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from "../firebase/firebaseConfig"; 


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
    // Ensure auth state persists across reloads
    setPersistence(auth, browserLocalPersistence).catch(() => {});

    // Handle redirect result (fallback flow)
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        const user = result.user;
        if (!user) return;

        const email = user.email || '';
        const name = user.displayName || '';
        const avatar = user.photoURL || '';

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
      })
      .catch((error) => {
        console.error('Google Sign-In redirect failed:', error);
      });
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

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Try popup first
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const email = user.email || '';
      const name = user.displayName || '';
      const avatar = user.photoURL || '';

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
    } catch (error: any) {
      console.warn('Popup sign-in failed, falling back to redirect...', error?.code || error);
      // Common popup failure codes: auth/popup-blocked, auth/popup-closed-by-user, COOP-related issues
      try {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      } catch (redirectError) {
        console.error('Google Sign-In redirect also failed:', redirectError);
      }
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

        {/* Google Sign-In with Firebase */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs text-gray-500 text-center pt-4">
          Admins use credentials. Students login with Google (bitsathy.ac.in)<br />
          <span className="text-blue-500 font-semibold">Powered by TEAM WEXLER</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
