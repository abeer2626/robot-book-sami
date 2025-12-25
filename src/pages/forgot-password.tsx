import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <Layout title="Forgot Password - Physical Humanoid Robotics Textbook" description="Reset your password for the Physical Humanoid Robotics Textbook">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1 className="text--center">Forgot Password</h1>
                <p className="text--center text--muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              <div className="card__body">
                <form>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="button button--primary button--block button--lg"
                  >
                    Send Reset Link
                  </button>
                </form>
                <div className="text--center margin-top--md">
                  <Link to="/login">Back to Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}