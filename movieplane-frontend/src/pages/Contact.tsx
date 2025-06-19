import React, { useState } from "react";
import "./css/Contact.css";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally, you'd send this to a server
    console.log("Message sent:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>

      {submitted ? (
        <div className="thank-you">
          <h3>Thank you for reaching out!</h3>
          <p>We'll get back to you as soon as possible.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              name="message"
              id="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
        
      )}
      <p>We'll respond shortly. You can also reach me directly at <a href="mailto=adigwedennis@gmail.com">adigwedennis@gmail.com</a>.</p>
    </div>
  );
};

export default ContactPage;
