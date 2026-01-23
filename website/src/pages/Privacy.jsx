import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: January 2024</p>
      </header>

      <div className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Trading DZ ("we", "us", "our", or "Company") operates the www.tradingdz.com website (the "Service"). 
            This page informs you of our policies regarding the collection, use, and disclosure of personal data 
            when you use our Service and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2>2. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h3>Types of Data Collected:</h3>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, country, wallet address</li>
            <li><strong>Technical Data:</strong> IP address, browser type, pages visited, time spent on pages</li>
            <li><strong>Transaction Data:</strong> Payment history, referral activity, commission records</li>
            <li><strong>Cookies:</strong> Session tokens, user preferences</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Data</h2>
          <p>Trading DZ uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical and security issues</li>
          </ul>
        </section>

        <section>
          <h2>4. Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet 
            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
            your personal data, we cannot guarantee its absolute security.
          </p>
          <p>
            We implement security measures including:
          </p>
          <ul>
            <li>HTTPS/SSL encryption for all data transmission</li>
            <li>Password hashing using industry-standard algorithms</li>
            <li>Regular security audits and penetration testing</li>
            <li>Limited access to personal data by authorized personnel only</li>
            <li>Two-factor authentication options</li>
          </ul>
        </section>

        <section>
          <h2>5. Disclosure of Data</h2>
          <h3>Business Transaction</h3>
          <p>
            If Trading DZ is involved in a merger, acquisition, or asset sale, your personal data may be transferred 
            as part of that transaction. We will provide notice before your personal data becomes subject to a different privacy policy.
          </p>
          <h3>Disclosure by Law</h3>
          <p>
            Trading DZ may disclose your personal data in good faith when required to do so by law, such as to comply 
            with a subpoena or similar legal process.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            We use cookies to enhance your experience with our Service. You have the option to disable cookies through 
            your browser settings, but this may impact your ability to use certain features of the Service.
          </p>
        </section>

        <section>
          <h2>7. Third-Party Links</h2>
          <p>
            Our Service may contain links to other sites that are not operated by us. This Privacy Policy applies only 
            to information we collect. We have no control over the practices of third-party websites and are not responsible 
            for their privacy policies or practices.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our Service is not intended for anyone under the age of 18. We do not knowingly collect personally identifiable 
            information from children under 18. If we become aware that a child under 18 has provided us with personal information, 
            we immediately delete such information from our servers.
          </p>
        </section>

        <section>
          <h2>9. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal data:
          </p>
          <ul>
            <li><strong>Right to Access:</strong> You have the right to access your personal data</li>
            <li><strong>Right to Correct:</strong> You have the right to correct inaccurate data</li>
            <li><strong>Right to Delete:</strong> You have the right to request deletion of your data</li>
            <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for data processing at any time</li>
          </ul>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <p>
            <strong>Email:</strong> privacy@tradingdz.com<br />
            <strong>Telegram:</strong> @TradingDZSupport<br />
            <strong>Website:</strong> www.tradingdz.com
          </p>
        </section>

        <section>
          <h2>12. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide our Service and fulfill the purposes outlined 
            in this Privacy Policy. You can request deletion of your data at any time, subject to legal and regulatory requirements.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
