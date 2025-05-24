import React from "react";
import "./Terms.scss";

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: April 25, 2025</p>
        
        <section className="terms-section">
          <h2>Introduction</h2>
          <p>
            Welcome to TalentHub. These Terms of Service ("Terms") govern your access to and use of the TalentHub website, services, and applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Fees and Payment</h2>
          <p>
            You agree to pay all fees or charges to your account based on the fee, charges, and billing terms in effect at the time a fee or charge is due and payable. If, in our judgment, your purchase constitutes a high-risk transaction, we may require you to provide us with a copy of your valid government-issued photo identification, and possibly a copy of a recent bank statement for the credit or debit card used for the purchase.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Limitation of Liability</h2>
          <p>
            In no event shall TalentHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@talenthub.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
