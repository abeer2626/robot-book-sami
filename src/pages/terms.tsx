import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function TermsPage(): JSX.Element {
  return (
    <Layout title="Terms of Service - Physical Humanoid Robotics Textbook" description="Terms of Service for the Physical Humanoid Robotics Textbook platform">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Terms of Service</h1>
            <div className="margin-top--md">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using the Physical Humanoid Robotics Textbook platform, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h2>2. Intellectual Property</h2>
              <p>All content on this platform, including text, graphics, logos, images, and software, is the property of the platform owners and is protected by intellectual property laws.</p>

              <h2>3. User Responsibilities</h2>
              <p>Users are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of their account credentials</li>
                <li>Using the platform for educational purposes only</li>
                <li>Not violating any intellectual property rights</li>
                <li>Respecting the rights of other users</li>
              </ul>

              <h2>4. Platform Usage</h2>
              <p>The platform is intended for educational use by students and instructors in the field of humanoid robotics. Commercial use or redistribution of content without permission is prohibited.</p>

              <h2>5. Disclaimer</h2>
              <p>The platform provides educational content "as is" without any warranties of any kind, either express or implied.</p>

              <h2>6. Limitation of Liability</h2>
              <p>The platform owners shall not be liable for any damages arising out of the use or inability to use the platform.</p>

              <h2>7. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>

              <div className="margin-top--lg">
                <Link to="/privacy">Privacy Policy</Link> | <Link to="/">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}