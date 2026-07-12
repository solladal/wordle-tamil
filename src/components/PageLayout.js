import React from 'react';
import { Link } from 'react-router-dom';

// Simple layout wrapper for standalone, crawlable content pages
// (About, Privacy Policy, Contact, How to Play) so they share the same
// header/back-link chrome and are visually consistent with the game.
export function PageLayout({ title, children, wide, darkmode }) {
  const dm = darkmode ? 'true' : 'false';
  return (
    <div className={`contentPage ${wide ? 'wide' : ''}`} darkmode={dm}>
      <div className="contentPageHeader">
        <Link to="/" className="backLink" darkmode={dm}>&larr; வேடல்</Link>
      </div>
      {title && <h1 darkmode={dm}>{title}</h1>}
      <div className="contentPageBody" darkmode={dm}>
        {children}
      </div>
      <div className="contentPageNav">
        <Link to="/how-to-play" darkmode={dm}>எப்படி விளையாடுவது</Link>
        <Link to="/about" darkmode={dm}>எங்களை பற்றி</Link>
        <Link to="/privacy-policy" darkmode={dm}>Privacy Policy</Link>
        <Link to="/contact" darkmode={dm}>தொடர்பு கொள்ள</Link>
        <Link to="/testimonials" darkmode={dm}>வாசகர் கருத்துகள்</Link>
      </div>
    </div>
  );
}
