import React, { useState } from 'react';

interface SupportPageProps {
  title?: string;
  supportEmail?: string;
}

export const SupportPage: React.FC<SupportPageProps> = ({ 
  title = "Support Center", 
  supportEmail = "support@example.com" 
}) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic would go here (e.g., call API)
    console.log("Sending support message:", message);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Thank you for contacting us!</h2>
        <p>We'll get back to you at {supportEmail} shortly.</p>
        <button onClick={() => setSubmitted(false)}>Send another message</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{title}</h1>
      <p>Need help? Fill out the form below or email us at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <label>
          <strong>Describe your issue:</strong>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <button type="submit" style={{ padding: '0.75rem', cursor: 'pointer' }}>
          Submit Request
        </button>
      </form>
    </div>
  );
};
