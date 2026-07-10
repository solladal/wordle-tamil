import React from 'react';
import { Link } from 'react-router-dom';

// Footer with links to the standalone content pages. Rendered on the
// main game screen so search engines (and users) can discover and
// crawl /how-to-play, /about, /privacy-policy and /contact.
export function Footer() {
  return (
    <div className="footer">
      <Link to="/how-to-play">எப்படி விளையாடுவது</Link>
      <span className="footerPipe">|</span>
      <Link to="/about">எங்களை பற்றி</Link>
      <span className="footerPipe">|</span>
      <Link to="/privacy-policy">Privacy Policy</Link>
      <span className="footerPipe">|</span>
      <Link to="/contact">தொடர்பு கொள்ள</Link>
    </div>
  );
}
