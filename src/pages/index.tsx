import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '../context/AuthContext';

export default function Home(): JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <Layout
      title="Physical Humanoid Robotics Textbook - Learn Robotics & AI"
      description="Master physical humanoid robotics and artificial intelligence with interactive tutorials, hands-on projects, and expert guidance">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2 text--center">
            <h1>🤖 Welcome to Physical Humanoid Robotics Textbook</h1>
            <p>Your comprehensive guide to building intelligent systems</p>

            <div style={{ marginTop: '2rem' }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="button button--primary button--lg">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="button button--primary button--lg" style={{ marginRight: '1rem' }}>
                    Get Started Free
                  </Link>
                  <Link to="/login" className="button button--secondary button--lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2>📚 Start Your Learning Journey</h2>
              <Link to="/docs/" className="button button--outline button--lg">
                Browse Modules →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}