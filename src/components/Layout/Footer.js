import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} HRMS System | 
        <a href="/privacy-policy"> Privacy Policy</a> | 
        <a href="/contact"> Contact</a>
      </p>
    </footer>
  );
};

export default Footer;
