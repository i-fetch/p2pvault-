import React from "react";
import illustration1 from "../assets/security.png"; // Example image for security
import illustration2 from "../assets/illustration.png"; // Example image for portfolio management
import illustration3 from "../assets/customer-service.png"; // Example image for support

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-900 via-black to-pink-700 text-gray-100 flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-black shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
            P2PVault
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-8 max-w-6xl mx-auto">
        <section className="text-center mb-12">
        <Link to="/" className="text-2xl font-bold text-pink-500">P2PVault</Link>

          <p className="text-lg text-gray-300 leading-relaxed">
            At <span className="text-pink-500">P2PVault</span>, we empower users to take full control of their cryptocurrency portfolios. 
            Our mission is to provide secure, user-friendly, and efficient solutions for managing digital assets.
          </p>
        </section>

        {/* Services Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Security */}
          <div className="bg-black rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition duration-500">
            <img
              src={illustration1}
              alt="Security Illustration"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">Unmatched Security</h3>
            <p className="text-gray-300 text-sm">
              We prioritize the safety of your assets with state-of-the-art encryption, multi-factor authentication, and cold wallet storage.
            </p>
          </div>

          {/* Portfolio Management */}
          <div className="bg-black rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition duration-500">
            <img
              src={illustration2}
              alt="Portfolio Management Illustration"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              Smart Portfolio Management
            </h3>
            <p className="text-gray-300 text-sm">
              Track and manage your cryptocurrency investments effortlessly with real-time analytics and insights.
            </p>
          </div>

          {/* 24/7 Support */}
          <div className="bg-black rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition duration-500">
            <img
              src={illustration3}
              alt="Support Illustration"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              24/7 Customer Support
            </h3>
            <p className="text-gray-300 text-sm">
              Our dedicated support team is available around the clock to assist you with any questions or concerns.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            We envision a world where decentralized finance is accessible to everyone. 
            At <span className="text-pink-500">P2PVault</span>, we strive to make this a reality by bridging the gap between traditional finance and the crypto world.
          </p>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="text-gray-400 text-center py-4">
        <p>&copy; 2024 P2PVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
