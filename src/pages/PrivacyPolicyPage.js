import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Seo } from '../components/Seo';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy - வேடல் (Wordle Tamil)"
        description="Wordle Tamil's privacy policy: what data is stored locally, and how Google Analytics and Google AdSense are used on this site."
        path="/privacy-policy"
      />
      <PageLayout title="Privacy Policy - வேடல் (Wordle Tamil)">
      <p><em>Last updated: {new Date().getFullYear()}</em></p>
      <p>
        வேடல் (Wordle Tamil) ("we", "our", "the game") respects your privacy.
        This page explains what information is collected when you play the
        game at solladal.github.io/wordle-tamil and how it is used.
      </p>

      <h2>1. Information stored on your device</h2>
      <p>
        Your game progress, statistics, and settings (such as dark mode,
        easy mode, and dictionary preferences) are stored locally in your
        browser's <strong>localStorage</strong>. This data stays on your
        device, is never transmitted to our servers, and is not accessible
        to us. Clearing your browser data will remove it.
      </p>

      <h2>2. Cookies and third-party services</h2>
      <p>
        We use the following third-party services, which may set cookies or
        collect data as described in their own privacy policies:
      </p>
      <ul>
        <li>
          <strong>Google Analytics</strong> — helps us understand how the
          site is used (e.g. page views, approximate location, device type).
        </li>
        <li>
          <strong>Google AdSense</strong> — may serve ads and use cookies to
          personalize ads based on your visits to this and other websites.
          You can opt out of personalized advertising by visiting{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
            Google Ads Settings
          </a>.
        </li>
      </ul>
      <p>
        You can learn more about how Google uses information from sites
        that use its services at{' '}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
          policies.google.com/technologies/partner-sites
        </a>.
      </p>

      <h2>3. Information we do not collect</h2>
      <p>
        We do not require account creation, and we do not collect names,
        email addresses, or payment information through the game itself.
        Any email you choose to send us (e.g. for feedback) is used only to
        respond to you.
      </p>

      <h2>4. Children's privacy</h2>
      <p>
        This game is suitable for a general audience and does not knowingly
        collect personal information from children.
      </p>

      <h2>5. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about this policy can be sent to{' '}
        <a href="mailto:wordletamil@gmail.com?subject=Privacy Policy">wordletamil@gmail.com</a>.
      </p>
    </PageLayout>
    </>
  );
}
