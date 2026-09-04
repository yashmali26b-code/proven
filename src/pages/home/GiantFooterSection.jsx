import React from 'react';
import './GiantFooterSection.css';

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const GiantFooterSection = ({ onNavigateTeam, onNavigateHome, onNavigateFaq }) => {
  return (
    <footer className="proven-giant-footer" id="footer">
      <div className="proven-giant-footer-inner">
        <h2 className="proven-footer-headline">
          Secure what matters.
          <span>With PROVEN.</span>
        </h2>

        <div className="proven-footer-mid-grid">
          <div className="proven-footer-col">
            <span className="proven-footer-col-title">Security</span>
            <span className="proven-footer-col-desc">Built for modern identity and compliance teams</span>
          </div>

          <div className="proven-footer-col">
            <span className="proven-footer-col-title">Social</span>
            <div className="proven-social-links">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="proven-social-btn" aria-label="X (Twitter)">
                <XIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="proven-social-btn" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="proven-social-btn" aria-label="LinkedIn">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="proven-footer-nav-row">
          <div className="proven-footer-subcol">
            <span className="proven-footer-subcol-title">Menu</span>
            <div className="proven-footer-sublinks">
              <a 
                href="/" 
                className="proven-footer-sublink"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateHome) {
                    onNavigateHome();
                  } else if (window.lenis) {
                    window.lenis.scrollTo(0, { duration: 1.0 });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                Work
              </a>
              <a 
                href="#features" 
                className="proven-footer-sublink"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector('#how-it-works');
                  if (el && window.lenis) window.lenis.scrollTo(el, { duration: 1.0 });
                }}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="proven-footer-sublink"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector('#how-it-works');
                  if (el && window.lenis) window.lenis.scrollTo(el, { duration: 1.0 });
                }}
              >
                Pricing
              </a>
              <a 
                href="/team" 
                className="proven-footer-sublink"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateTeam) {
                    onNavigateTeam();
                  }
                }}
              >
                Model Mavericks Team
              </a>
              <a 
                href="/faq" 
                className="proven-footer-sublink"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateFaq) {
                    onNavigateFaq();
                  }
                }}
              >
                FAQ & Knowledge Base
              </a>
            </div>
          </div>

          <div className="proven-footer-subcol">
            <span className="proven-footer-subcol-title">Legal</span>
            <div className="proven-footer-sublinks">
              <a href="/" className="proven-footer-sublink" onClick={(e) => e.preventDefault()}>Terms of service</a>
              <a href="/" className="proven-footer-sublink" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>

          <div className="proven-footer-copyright">
            <p>© 2026 PROVEN. All rights reserved.</p>
          </div>
        </div>

        <div className="proven-giant-watermark-wrap">
          <h1 className="proven-giant-watermark-text">PROVEN</h1>
        </div>
      </div>
    </footer>
  );
};

export default GiantFooterSection;
