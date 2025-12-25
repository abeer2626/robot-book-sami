import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function PrivacyPage(): JSX.Element {
  return (
    <Layout title="Privacy Policy - Physical Humanoid Robotics Textbook" description="Privacy Policy for the Physical Humanoid Robotics Textbook platform">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Privacy Policy</h1>
            <div className="margin-top--md">
              <h2>1. Information Collection</h2>
              <p>We collect information that you provide directly to us, such as when you create an account, sign in, or contact us for support.</p>

              <h2>2. Types of Information Collected</h2>
              <h3>Account Information</h3>
              <ul>
                <li>Name and email address</li>
                <li>Role (student or instructor)</li>
                <li>Password (encrypted)</li>
              </ul>

              <h3>Usage Information</h3>
              <ul>
                <li>Pages visited and time spent</li>
                <li>Search queries</li>
                <li>Device and browser information</li>
              </ul>

              <h2>3. Information Use</h2>
              <p>We use collected information to:</p>
              <ul>
                <li>Maintain and improve the platform</li>
                <li>Personalize the learning experience</li>
                <li>Communicate with users</li>
                <li>Ensure platform security</li>
              </ul>

              <h2>4. Information Sharing</h2>
              <p>We do not sell, trade, or share your personal information with third parties without your consent, except as required by law.</p>

              <h2>5. Data Security</h2>
              <p>We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</p>

              <h2>6. Cookie Usage</h2>
              <p>We use cookies to enhance your browsing experience, analyze site traffic, and help with our marketing efforts.</p>

              <h2>7. User Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your account</li>
                <li>Opt-out of promotional communications</li>
              </ul>

              <h2>8. Children's Privacy</h2>
              <p>The platform is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

              <h2>9. International Data Transfers</h2>
              <p>Your information may be transferred to and maintained on servers located outside of your country, subject to applicable privacy laws.</p>

              <h2>10. Policy Updates</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

              <div className="margin-top--lg">
                <Link to="/terms">Terms of Service</Link> | <Link to="/">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}