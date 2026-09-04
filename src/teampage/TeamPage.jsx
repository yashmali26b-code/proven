import React, { useState, useEffect } from 'react';
import './TeamPage.css';
import Navbar from '../pages/navbar/navbar';
import GiantFooterSection from '../pages/home/GiantFooterSection';
import sihLogo from '../assets/sih.webp';
import { Mail, Copy, Check } from 'lucide-react';

export const TeamPage = ({ user, onNavigateHome, onNavigateTeam, onNavigateFaq, onOpenAuth }) => {
  const [copiedEmail, setCopiedEmail] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (e) {}
    }
  }, []);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const teamMembers = [
    {
      name: 'Yash Bharat Mali',
      initials: 'YM',
      email: 'yashmali26b@gmail.com'
    },
    {
      name: 'Yash Bharat Desale',
      initials: 'YD',
      email: 'yashdesale982@gmail.com'
    },
    {
      name: 'Neha Shantaram Bhamare',
      initials: 'NB',
      email: 'nehabhamare65@gmail.com'
    },
    {
      name: 'Dhanashri Ajay Patil',
      initials: 'DP',
      email: 'patildhanshri2008@gmail.com'
    },
    {
      name: 'Nikhil Nitin Sonawane',
      initials: 'NS',
      email: 'nikhilson306@gmail.com'
    },
    {
      name: 'Sejal Gopalsing Girase',
      initials: 'SG',
      email: 'sejalg992@gmail.com'
    }
  ];

  return (
    <div className="proven-teampage-wrapper">
      <div className="proven-team-grid-bg" />
      <div className="proven-team-grid-glow" />
      <div className="proven-team-grid-vignette" />

      <Navbar 
        user={user}
        onStartSecuring={onOpenAuth}
        onNavigateHome={onNavigateHome}
        onNavigateTeam={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
        onNavigateFaq={onNavigateFaq}
        isTeamPage={true}
      />

      <main className="proven-team-neat-container">
        <section className="proven-team-neat-hero">
          <div className="proven-hero-badge-link">
            <span className="proven-badge-tag">TEAM</span>
            <span className="proven-badge-text">Model Mavericks</span>
          </div>

          <h1 className="proven-hero-title">
            <span>The minds behind</span>
            <span>Model Mavericks & PROVEN.</span>
          </h1>

          <p className="proven-hero-description">
            Meet the engineers, security researchers, and systems architects powering modern multi-document identity forensics.
          </p>
        </section>

        {/* Smart India Hackathon Problem Statement Card */}
        <section className="proven-sih-statement-section">
          <div className="proven-neat-box proven-sih-statement-box">
            <div className="proven-sih-logo-card">
              <img src={sihLogo} alt="Smart India Hackathon Logo" className="proven-sih-logo-img" />
            </div>

            <div className="proven-sih-content">
              <div className="proven-sih-tags-row">
                <div className="proven-sih-badge-pill">
                  <span className="proven-sih-dot" />
                  <span className="proven-sih-badge-text">Smart India Hackathon</span>
                </div>
                <div className="proven-sih-statement-id-pill">
                  <span className="proven-sih-id-label">Statement No.</span>
                  <span className="proven-sih-id-val">188</span>
                </div>
              </div>

              <h2 className="proven-sih-statement-heading">
                AI Based Fake Docs Screening System
              </h2>

              <p className="proven-sih-statement-desc">
                An advanced multi-layer identity verification engine built by Team <strong>Model Mavericks</strong> to detect counterfeit credentials, extract tamper-resistant OCR vectors, and cross-validate identity authenticity with zero-trust machine intelligence.
              </p>
            </div>
          </div>
        </section>

        <section className="proven-neat-teammates-section">
          <div className="proven-neat-teammates-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="proven-neat-box proven-neat-member-box">
                <div className="proven-neat-member-top">
                  <div className="proven-neat-avatar-box">
                    <span>{member.initials}</span>
                  </div>
                  <div className="proven-neat-member-meta">
                    <h3 className="proven-neat-member-name">{member.name}</h3>
                  </div>
                </div>

                <div className="proven-neat-member-bottom">
                  <div className="proven-neat-email-row">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="proven-neat-member-email-link"
                    >
                      <Mail size={13} />
                      <span>{member.email}</span>
                    </a>
                    <button 
                      onClick={() => handleCopyEmail(member.email)}
                      className="proven-neat-copy-btn"
                      title="Copy email"
                      aria-label="Copy email"
                    >
                      {copiedEmail === member.email ? (
                        <Check size={12} className="copied-icon" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <GiantFooterSection 
        onNavigateHome={onNavigateHome}
        onNavigateTeam={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
        onNavigateFaq={onNavigateFaq}
      />
    </div>
  );
};

export default TeamPage;
