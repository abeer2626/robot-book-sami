import React, { useState, FormEvent, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../context/AuthContext';
import Link from '@docusaurus/Link';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <Layout title="Login - Physical Humanoid Robotics Textbook" description="Sign in to your Physical Humanoid Robotics Textbook account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1 className="text--center">Sign In</h1>
                <p className="text--center text--muted">
                  Welcome back! Please sign in to your account.
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
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox">
                      <input type="checkbox" /> Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="button button--primary button--block button--lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="text--center margin-top--md">
                  <Link to="/forgot-password" className="text--muted">
                    Forgot your password?
                  </Link>
                </div>

                <hr />

                <div className="text--center">
                  <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
              </div>

              <div className="card__footer">
                <div className="alert alert--info">
                  <h4>Demo Accounts:</h4>
                  <p><strong>Student:</strong> demo@robotic-book.com / demo123</p>
                  <p><strong>Instructor:</strong> instructor@robotic-book.com / instructor123</p>
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

        .alert--info {
          background-color: #e6f7ff;
          border: 1px solid #91d5ff;
          color: #1890ff;
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