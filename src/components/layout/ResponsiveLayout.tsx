import React, { useState, useEffect } from 'react';
import Layout from '@theme-original/Layout';
import Link from '@docusaurus/Link';
import ModuleNavigation from './ModuleNavigation';
import styles from './ResponsiveLayout.module.css';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps): JSX.Element {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close mobile nav if switching to desktop
      if (window.innerWidth >= 768) {
        setIsMobileNavOpen(false);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  // Close mobile navigation
  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  return (
    <Layout>
      <div className={styles.responsiveLayout}>
        {/* Mobile Header */}
        <header className={styles.mobileHeader}>
          <div className={styles.mobileHeaderContent}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>🤖</span>
              <span className={styles.logoText}>Robotics</span>
            </Link>
            <button
              className={styles.menuToggle}
              onClick={toggleMobileNav}
              aria-label="Toggle navigation"
              aria-expanded={isMobileNavOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.layoutContainer}>
          {/* Desktop Sidebar - Hidden on mobile unless menu is open */}
          {!isMobile && (
            <aside className={styles.sidebar}>
              <div className={styles.sidebarContent}>
                <ModuleNavigation />
              </div>
            </aside>
          )}

          {/* Mobile Sidebar Overlay */}
          {isMobile && (
            <aside
              className={`${styles.sidebar} ${isMobileNavOpen ? styles.sidebarActive : ''}`}
            >
              <div className={styles.sidebarContent}>
                <ModuleNavigation onNavigate={closeMobileNav} />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.contentWrapper}>
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Navigation Overlay for Larger Screens */}
        {isMobile && (
          <div
            className={`${styles.mobileNavOverlay} ${isMobileNavOpen ? styles.mobileNavOverlayActive : ''}`}
            onClick={closeMobileNav}
          >
            <div className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mobileNavHeader}>
                <Link to="/" className={styles.mobileNavLogo}>
                  <span className={styles.logoIcon}>🤖</span>
                  <span className={styles.logoText}>Robotics</span>
                </Link>
                <button
                  className={styles.mobileNavClose}
                  onClick={closeMobileNav}
                  aria-label="Close navigation"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <ModuleNavigation onNavigate={closeMobileNav} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}