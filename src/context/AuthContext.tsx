import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'instructor';
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: { error: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Mock API functions (replace with real API calls)
const api = {
  async login(email: string, password: string) {
    // Simulate API call
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === 'demo@robotic-book.com' && password === 'demo123') {
          resolve({
            user: {
              id: '1',
              email,
              name: 'Demo User',
              role: 'student',
              avatar: '/img/demo-avatar.png',
              createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
          });
        } else if (email === 'instructor@robotic-book.com' && password === 'instructor123') {
          resolve({
            user: {
              id: '2',
              email,
              name: 'Demo Instructor',
              role: 'instructor',
              avatar: '/img/instructor-avatar.png',
              createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  async register(userData: RegisterData) {
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        // Simulate registration
        if (userData.email && userData.password && userData.name) {
          resolve({
            user: {
              id: Date.now().toString(),
              email: userData.email,
              name: userData.name,
              role: userData.role || 'student',
              avatar: '/img/default-avatar.png',
              createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
          });
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  },

  async validateToken(token: string) {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        if (token && token.startsWith('mock-jwt-token')) {
          resolve({
            id: '1',
            email: 'demo@robotic-book.com',
            name: 'Demo User',
            role: 'student',
            avatar: '/img/demo-avatar.png',
            createdAt: new Date().toISOString(),
          });
        } else {
          reject(new Error('Invalid token'));
        }
      }, 500);
    });
  },

  async updateProfile(userId: string, userData: Partial<User>) {
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          email: 'demo@robotic-book.com',
          name: userData.name || 'Demo User',
          role: 'student',
          avatar: userData.avatar || '/img/demo-avatar.png',
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch({ type: 'AUTH_START' });
      api.validateToken(token)
        .then((user) => {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        })
        .catch(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          dispatch({ type: 'AUTH_FAILURE', payload: { error: 'Session expired' } });
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.login(email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: { error: errorMessage } });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.register(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: { error: errorMessage } });
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!state.user) return;

    try {
      const updatedUser = await api.updateProfile(state.user.id, userData);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: { error: errorMessage } });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}