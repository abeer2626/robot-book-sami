import React, { useState, FormEvent, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../context/AuthContext';
import Link from '@docusaurus/Link';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor';
}

export default function RegisterPage(): JSX.Element {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const { register, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <Layout title="Register - Physical Humanoid Robotics Textbook" description="Create your Physical Humanoid Robotics Textbook account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1 className="text--center">Create Account</h1>
                <p className="text--center text--muted">
                  Join our community and start your robotics journey!
                </p>
              </div>
              <div className="card__body">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert--danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">I am a</label>
                    <select
                      id="role"
                      name="role"
                      className="form-control"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password (min. 6 characters)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox">
                      <input type="checkbox" required /> I agree to the{' '}
                      <Link to="/terms">Terms of Service</Link> and{' '}
                      <Link to="/privacy">Privacy Policy</Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="button button--primary button--block button--lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>

                <div className="text--center margin-top--md">
                  <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--ifm-color-primary);
          box-shadow: 0 0 0 2px var(--ifm-color-primary);
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox input {
          margin: 0;
        }

        .button--block {
          width: 100%;
        }

        .alert {
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        }

        .alert--danger {
          background-color: #fee;
          border: 1px solid #fcc;
          color: #c00;
        }

        .text--center {
          text-align: center;
        }

        .text--muted {
          opacity: 0.7;
        }
      `}</style>
    </Layout>
  );
}