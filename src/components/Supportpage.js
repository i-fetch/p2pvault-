import React, { useState, useEffect } from "react";

const SupportPage = () => {
  const [faqOpen, setFaqOpen] = useState(null);
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, subject: "Issue with transaction", status: "Open" },
    { id: 2, subject: "KYC verification delay", status: "Open" },
  ]);

  useEffect(() => {
    // Add Tawk.to script to load the chat widget
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/your-tawkto-id/default";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the Tawk.to script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleFaqToggle = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Support request submitted. We'll get back to you shortly.");
  };

  return (
    <div className="p-6 bg-stone-900 text-gray-200 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold mb-4">Support</h1>

      {/* FAQ Section */}
      <div className="mb-6 bg-black">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page." },
            { question: "How long does KYC approval take?", answer: "KYC approval typically takes 24-48 hours." },
            { question: "How can I contact support?", answer: "You can use the contact form below or email us at support@p2pvault.com." },
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

      {/* Contact Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Submit a Support Request</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block mb-2">Subject</label>
            <input
              id="subject"
              type="text"
              className="w-full p-2 bg-gray-800 rounded-lg text-gray-200"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-2 bg-gray-800 rounded-lg text-gray-200"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Live Chat Placeholder */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Live Chat</h2>
        <p className="text-gray-400">Live chat is coming soon. Stay tuned!</p>
      </div>

      {/* Support Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Support Tickets</h2>
        <ul className="space-y-4">
          {supportTickets.map((ticket) => (
            <li key={ticket.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-bold">{ticket.subject}</h3>
              <p>Status: <span className={`font-semibold ${ticket.status === "Open" ? "text-yellow-400" : "text-green-400"}`}>{ticket.status}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupportPage;
