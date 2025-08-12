// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Required for redirection
import { User, AuthContextType } from '../types';

// ✅ Exporting the context so it can be imported elsewhere
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Custom hook for using AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // 👈 Hook to enable navigation

  useEffect(() => {
    const savedUser = localStorage.getItem('student-portal-user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      console.log('✅ Loaded user from localStorage:', parsedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
    };
    console.log('✅ Logging in user:', newUser);
    setUser(newUser);
    localStorage.setItem('student-portal-user', JSON.stringify(newUser));

    // 👇 Redirect based on role
    if (newUser.department === 'ADMIN') {
      navigate('/admin'); // Adjust route as needed
    } else {
      navigate('/dashboard'); // Go to Dashboard after login
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student-portal-user');
    navigate('/login'); // Optional: redirect to login on logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
