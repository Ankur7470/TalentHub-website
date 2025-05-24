import React from "react";
import "./Privacy.scss";

const Privacy = () => {
    return (
        <div className="privacy-page">
            <div className="container">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last updated: April 25, 2025</p>
                <section className="policy-section">
                    <h2>Introduction</h2>
                    <p>
                        We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>Important Information and Who We Are</h2>
                    <p>
                        This Privacy Policy aims to give you information on how TalentHub collects and processes your personal data through your use of this website and your interactions with us, including any data you may provide through this website when you sign up to our newsletter, sign up for our free or paid services or offerings, or take part in a competition.
                    </p>
                    <p>
                        This website is not intended for children and we do not knowingly collect data relating to children.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>What Information We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul>
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                        <li><strong>Financial Data</strong> includes payment card details.</li>
                        <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                        <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>How We Use Your Information</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@talenthub.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;