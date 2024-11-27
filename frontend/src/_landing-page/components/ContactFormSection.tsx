import React, { useState } from "react";

const ContactFormSection: React.FC = () => {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!fname || !email || !message || !subject) {
      setFormStatus("Please fill all the fields.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus(null); // Clear any previous status

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/common/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          email,
          message,
          subject,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      const data = await response.json();

      // Handle response based on the success
      if (data.status == "success") {
        setFormStatus("Your message has been sent successfully!");
        setFname("");
        setEmail("");
        setMessage("");
        setSubject("");
      } else {
        setFormStatus("Failed to send the message. Please try again.");
      }
    } catch (error) {
      setFormStatus("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-20 bg-top bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://wp.alithemes.com/html/monst/assets/imgs/elements/blob.svg")',
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="relative px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-3xl lg:text-4xl font-bold font-heading wow animate__animated animate__fadeInUp">
              <span>Connect With Me</span>
              <span className="text-blue-500"> For any Query </span>
              <span>or any suggestion/service</span>
            </h2>
            <p className="mb-8 text-blueGray-400 wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
              Your information is completely confidential.
            </p>

            <div
              className="p-8 rounded-lg shadow-lg flex flex-wrap max-w-2xl mx-auto wow animate__animated animate__fadeInUp"
              data-wow-delay=".5s"
            >
              {/* Name and Email Inputs */}
              <div className="flex gap-4 w-full mb-6">
                <input
                  className="w-full p-4 text-sm text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Your Name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
                <input
                  className="w-full p-4 text-sm text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Subject Input */}
              <div className="w-full mb-6">
                <input
                  className="w-full p-4 text-sm text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message Textarea */}
              <div className="w-full mb-6">
                <textarea
                  className="w-full p-4 text-sm text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-4 px-8 text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-300"
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Form Status */}
            {formStatus && (
              <div
                className={`mt-6 text-center text-sm ${
                  formStatus.includes("success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {formStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;