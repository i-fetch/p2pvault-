import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon from react-icons

const SupportPage = () => {
  const [faqOpen, setFaqOpen] = useState(null);

  const handleFaqToggle = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="p-6 bg-stone-900 text-gray-200 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold mb-4">Support</h1>

      {/* FAQ Section */}
      <div className="mb-6 bg-stone-900">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[ 
            { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page." },
            { question: "How long does KYC approval take?", answer: "KYC approval typically takes 24-48 hours." },
            { question: "How can I contact support?", answer: "You can use the contact details below to reach us." },
          ].map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => handleFaqToggle(index)}
                className="flex justify-between items-center w-full text-left py-2 px-4 bg-gray-800 rounded-lg focus:outline-none"
              >
                <span>{faq.question}</span>
                <span>{faqOpen === index ? "-" : "+"}</span>
              </button>
              {faqOpen === index && (
                <p className="mt-2 text-gray-400 px-4">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-400">For support, you can reach us through the following channels:</p>
        <ul className="mt-4 space-y-2">
          <li>
            <a
              href="mailto:p2pvualts@gmail.com"
              className="text-pink-500 hover:text-pink-600"
            >
              Email: p2pvaults@gmail.com
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <FaWhatsapp className="text-green-500" size={24} /> {/* WhatsApp Icon */}
            <a
              href="https://wa.me/+16315994210"
              className="text-green-500 hover:text-green-600"
            >
              WhatsApp: +1 631 599 890
            </a>
          </li>
          <li>
            <a
              href="tel:+16315994210"
              className="text-blue-500 hover:text-blue-600"
            >
              Phone: +1 631 599 4210
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default SupportPage;
