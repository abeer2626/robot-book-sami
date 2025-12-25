import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import Link from '@docusaurus/Link';

export default function DashboardPage(): JSX.Element {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview');

  return (
    <ProtectedRoute>
      <Layout title="Dashboard - Physical Humanoid Robotics Textbook" description="Your learning dashboard">
        <div className="container margin-vert--lg">
          {/* Header */}
          <div className="row margin-bottom--lg">
            <div className="col col--12">
              <div className="card">
                <div className="card__header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={user?.avatar || '/img/default-avatar.png'}
                      alt={user?.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '3px solid var(--ifm-color-primary)',
                      }}
                    />
                    <div>
                      <h1 style={{ margin: 0 }}>Welcome back, {user?.name}! 👋</h1>
                      <p className="text--muted" style={{ margin: 0 }}>
                        {user?.role === 'instructor' ? 'Instructor' : 'Student'} • {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="button button--secondary"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="row margin-bottom--lg">
            <div className="col col--12">
              <div className="tabs-container">
                <div className="tabs-nav">
                  <button
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    📊 Overview
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('progress')}
                  >
                    📈 Progress
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                  >
                    🏆 Achievements
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="row">
            <div className="col col--8">
              {activeTab === 'overview' && (
                <div className="card">
                  <div className="card__header">
                    <h2>📚 Learning Overview</h2>
                  </div>
                  <div className="card__body">
                    <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                      <div className="stat-card">
                        <h3>Modules Completed</h3>
                        <div className="stat-number">1 / 4</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <h3>Lessons Completed</h3>
                        <div className="stat-number">12 / 50</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <h3>Study Streak</h3>
                        <div className="stat-number">7 days 🔥</div>
                        <p>Keep up the great work!</p>
                      </div>
                      <div className="stat-card">
                        <h3>Time Spent</h3>
                        <div className="stat-number">24 hours</div>
                        <p>This month</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <h3>Continue Learning</h3>
                      <div className="card" style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                        <div className="card__body">
                          <h4>Module 1: Foundations</h4>
                          <p>You're currently learning about AI Fundamentals</p>
                          <Link to="/docs/module-01/3-ai-fundamentals" className="button button--primary">
                            Continue Learning →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="card">
                  <div className="card__header">
                    <h2>📈 Your Progress</h2>
                  </div>
                  <div className="card__body">
                    <div className="progress-section">
                      <h3>Module 1: Foundations</h3>
                      <div className="lesson-list">
                        <div className="lesson-item completed">
                          <span>✅ Introduction to Robotics</span>
                          <span>Completed</span>
                        </div>
                        <div className="lesson-item completed">
                          <span>✅ Robot Components</span>
                          <span>Completed</span>
                        </div>
                        <div className="lesson-item in-progress">
                          <span>🔄 AI Fundamentals</span>
                          <span>In Progress</span>
                        </div>
                      </div>
                    </div>

                    <div className="progress-section" style={{ marginTop: '2rem' }}>
                      <h3>Module 2: Core Concepts</h3>
                      <p className="text--muted">Coming soon...</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="card">
                  <div className="card__header">
                    <h2>🏆 Your Achievements</h2>
                  </div>
                  <div className="card__body">
                    <div className="achievements-grid">
                      <div className="achievement-badge unlocked">
                        <div className="badge-icon">🎯</div>
                        <h4>First Steps</h4>
                        <p>Complete your first lesson</p>
                      </div>
                      <div className="achievement-badge unlocked">
                        <div className="badge-icon">🔥</div>
                        <h4>Week Warrior</h4>
                        <p>7-day learning streak</p>
                      </div>
                      <div className="achievement-badge">
                        <div className="badge-icon">🚀</div>
                        <h4>Module Master</h4>
                        <p>Complete your first module</p>
                      </div>
                      <div className="achievement-badge">
                        <div className="badge-icon">⭐</div>
                        <h4>Code Expert</h4>
                        <p>Complete 10 coding exercises</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col col--4">
              <div className="card">
                <div className="card__header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card__body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/docs/" className="button button--outline button--block">
                      📚 Browse All Modules
                    </Link>
                    <Link to="/profile" className="button button--outline button--block">
                      👤 Edit Profile
                    </Link>
                    <Link to="/community" className="button button--outline button--block">
                      💬 Join Community
                    </Link>
                    {user?.role === 'instructor' && (
                      <Link to="/instructor" className="button button--outline button--block">
                        🎓 Instructor Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card__header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="card__body">
                  <div className="activity-list">
                    <div className="activity-item">
                      <span>Completed "Robot Components"</span>
                      <small>2 hours ago</small>
                    </div>
                    <div className="activity-item">
                      <span>Started "AI Fundamentals"</span>
                      <small>1 day ago</small>
                    </div>
                    <div className="activity-item">
                      <span>Earned "Week Warrior" badge</span>
                      <small>3 days ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <style jsx>{`
        .tabs-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tabs-nav {
          display: flex;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
        }

        .tab-button {
          flex: 1;
          padding: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--ifm-color-emphasis-700);
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          background: var(--ifm-color-emphasis-100);
        }

        .tab-button.active {
          color: var(--ifm-color-primary);
          border-bottom: 2px solid var(--ifm-color-primary);
          background: var(--ifm-color-emphasis-100);
        }

        .grid-container {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 0.5rem;
          background: var(--ifm-color-emphasis-100);
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--ifm-color-primary);
          margin: 0.5rem 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--ifm-color-emphasis-300);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--ifm-color-primary);
          transition: width 0.3s ease;
        }

        .progress-section {
          margin-bottom: 2rem;
        }

        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--ifm-color-emphasis-100);
          border-radius: 0.375rem;
        }

        .lesson-item.completed {
          background: #f0f9f0;
          color: #2d5a2d;
        }

        .lesson-item.in-progress {
          background: #fff3cd;
          color: #856404;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .achievement-badge {
          text-align: center;
          padding: 1.5rem;
          border-radius: 0.5rem;
          background: var(--ifm-color-emphasis-100);
          opacity: 0.5;
        }

        .achievement-badge.unlocked {
          opacity: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .badge-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
        }

        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-item small {
          color: var(--ifm-color-emphasis-600);
        }

        .text--muted {
          opacity: 0.7;
        }

        .button--block {
          width: 100%;
          text-align: left;
        }
      `}</style>
    </ProtectedRoute>
  );
}