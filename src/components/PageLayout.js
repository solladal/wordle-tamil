import React from 'react';
import { Link } from 'react-router-dom';

// Simple layout wrapper for standalone, crawlable content pages
// (About, Privacy Policy, Contact, How to Play) so they share the same
// header/back-link chrome and are visually consistent with the game.
export function PageLayout({ title, children }) {
  return (
    <div className="contentPage">
      <div className="contentPageHeader">
        <Link to="/" className="backLink">&larr; வேடல்</Link>
      </div>
      <h1>{title}</h1>
      <div className="contentPageBody">
        {children}
      </div>
      <div className="contentPageNav">
        <Link to="/how-to-play">எப்படி விளையாடுவது</Link>
        <Link to="/about">எங்களை பற்றி</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">தொடர்பு கொள்ள</Link>
      </div>
    </div>
  );
}
